import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  deviceBeacons as seedBeacons,
  devices as seedDevices,
  fleetAlerts as seedAlerts,
  historyReadings,
  liveReadings,
  recentPings,
  type Device,
  type DeviceBeacon,
  type DeviceStatus,
  type FleetAlert,
} from '../data/demo'
import { defaultSettings, type AppSettings } from '../data/settings'

export type NewDeviceInput = {
  id: string
  name: string
  model: string
  location: string
  ip: string
  mac: string
  ssid: string
  mqttTopic: string
  firmware: string
  firmwareChannel: 'stable' | 'beta'
  power: 'mains' | 'battery'
  sensors: string
  tags: string
  notes: string
}

type FleetContextValue = {
  devices: Device[]
  beacons: DeviceBeacon[]
  alerts: FleetAlert[]
  settings: AppSettings
  liveReadings: typeof liveReadings
  historyReadings: typeof historyReadings
  recentPings: typeof recentPings
  addDevice: (input: NewDeviceInput) => { ok: true } | { ok: false; error: string }
  removeDevice: (id: string) => void
  updateSettings: (next: AppSettings) => void
  acknowledgeAlert: (id: string) => void
  getDevice: (id: string) => Device | undefined
  deviceName: (id: string) => string
  beaconsForDevice: (id: string) => DeviceBeacon[]
  readingsForDevice: (id: string) => typeof liveReadings
  fleetSummary: {
    total: number
    online: number
    degraded: number
    offline: number
    avgPingMs: number
    openAlerts: number
    missedBeacons: number
    weakBeacons: number
    lastTelemetryAt: string
  }
}

const FleetContext = createContext<FleetContextValue | null>(null)

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildDevice(input: NewDeviceInput, settings: AppSettings): Device {
  const now = new Date().toISOString()
  const status: DeviceStatus = 'offline'
  return {
    id: input.id.trim(),
    name: input.name.trim(),
    model: input.model.trim() || 'ESP32-WROOM-32',
    chipRevision: 'unknown',
    firmware: input.firmware.trim() || '1.0.0',
    firmwareChannel: input.firmwareChannel,
    status,
    lastSeenAt: now,
    lastBootAt: now,
    lastPingMs: null,
    avgPingMs: null,
    packetLossPct: 0,
    uptimeHours: 0,
    rebootCount: 0,
    location: input.location.trim() || 'Unassigned',
    ip: input.ip.trim() || '0.0.0.0',
    mac: input.mac.trim().toUpperCase() || '00:00:00:00:00:00',
    ssid: input.ssid.trim() || settings.defaultSsid,
    rssiDbm: null,
    mqttTopic: input.mqttTopic.trim() || `station/${input.id.trim()}/telemetry`,
    cpuTempC: null,
    freeHeapKb: null,
    flashMb: 4,
    power: input.power,
    batteryPct: input.power === 'battery' ? 100 : null,
    sensors: splitList(input.sensors),
    tags: splitList(input.tags),
    notes: input.notes.trim() || 'Provisioned from Weather Admin.',
  }
}

export function FleetProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(seedDevices)
  const [beacons, setBeacons] = useState<DeviceBeacon[]>(seedBeacons)
  const [alerts, setAlerts] = useState<FleetAlert[]>(seedAlerts)
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  const getDevice = useCallback((id: string) => devices.find((d) => d.id === id), [devices])

  const deviceName = useCallback(
    (id: string) => devices.find((d) => d.id === id)?.name ?? id,
    [devices],
  )

  const beaconsForDevice = useCallback(
    (id: string) =>
      beacons.filter((b) => b.deviceId === id).sort((a, b) => b.at.localeCompare(a.at)),
    [beacons],
  )

  const readingsForDevice = useCallback(
    (id: string) =>
      [...liveReadings, ...historyReadings]
        .filter((r) => r.deviceId === id)
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
    [],
  )

  const addDevice = useCallback(
    (input: NewDeviceInput) => {
      const id = input.id.trim()
      if (!id) return { ok: false as const, error: 'Device ID is required.' }
      if (!input.name.trim()) return { ok: false as const, error: 'Name is required.' }
      if (devices.some((d) => d.id === id)) {
        return { ok: false as const, error: `Device ID "${id}" already exists.` }
      }

      const device = buildDevice(input, settings)
      setDevices((prev) => [...prev, device])
      setAlerts((prev) => [
        {
          id: `al-new-${id}`,
          deviceId: id,
          severity: 'info',
          title: 'Device provisioned',
          detail: `${device.name} was added and is waiting for first beacon.`,
          at: new Date().toISOString(),
          acknowledged: false,
        },
        ...prev,
      ])
      return { ok: true as const }
    },
    [devices, settings],
  )

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
    setBeacons((prev) => prev.filter((b) => b.deviceId !== id))
    setAlerts((prev) => prev.filter((a) => a.deviceId !== id))
  }, [])

  const updateSettings = useCallback((next: AppSettings) => {
    setSettings(next)
  }, [])

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    )
  }, [])

  const fleetSummary = useMemo(() => {
    const reachable = devices.filter((d) => d.lastPingMs != null)
    return {
      total: devices.length,
      online: devices.filter((d) => d.status === 'online').length,
      degraded: devices.filter((d) => d.status === 'degraded').length,
      offline: devices.filter((d) => d.status === 'offline').length,
      avgPingMs:
        reachable.length === 0
          ? 0
          : Math.round(
              reachable.reduce((sum, d) => sum + (d.lastPingMs ?? 0), 0) / reachable.length,
            ),
      openAlerts: alerts.filter((a) => !a.acknowledged).length,
      missedBeacons: beacons.filter((b) => b.status === 'missed').length,
      weakBeacons: beacons.filter((b) => b.status === 'weak').length,
      lastTelemetryAt:
        liveReadings.map((r) => r.recordedAt).sort().at(-1) ?? new Date().toISOString(),
    }
  }, [devices, beacons, alerts])

  const value = useMemo<FleetContextValue>(
    () => ({
      devices,
      beacons,
      alerts,
      settings,
      liveReadings,
      historyReadings,
      recentPings,
      addDevice,
      removeDevice,
      updateSettings,
      acknowledgeAlert,
      getDevice,
      deviceName,
      beaconsForDevice,
      readingsForDevice,
      fleetSummary,
    }),
    [
      devices,
      beacons,
      alerts,
      settings,
      addDevice,
      removeDevice,
      updateSettings,
      acknowledgeAlert,
      getDevice,
      deviceName,
      beaconsForDevice,
      readingsForDevice,
      fleetSummary,
    ],
  )

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
}

export function useFleet(): FleetContextValue {
  const ctx = useContext(FleetContext)
  if (!ctx) throw new Error('useFleet must be used within FleetProvider')
  return ctx
}
