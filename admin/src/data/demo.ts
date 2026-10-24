export type DeviceStatus = 'online' | 'degraded' | 'offline'
export type BeaconStatus = 'ok' | 'weak' | 'missed'
export type AlertSeverity = 'info' | 'warning' | 'critical'

export type Device = {
  id: string
  name: string
  model: string
  chipRevision: string
  firmware: string
  firmwareChannel: 'stable' | 'beta'
  status: DeviceStatus
  lastSeenAt: string
  lastBootAt: string
  lastPingMs: number | null
  avgPingMs: number | null
  packetLossPct: number
  uptimeHours: number
  rebootCount: number
  location: string
  ip: string
  mac: string
  ssid: string
  rssiDbm: number | null
  mqttTopic: string
  cpuTempC: number | null
  freeHeapKb: number | null
  flashMb: number
  power: 'mains' | 'battery'
  batteryPct: number | null
  sensors: string[]
  tags: string[]
  notes: string
}

export type WeatherReading = {
  id: string
  deviceId: string
  recordedAt: string
  temperatureC: number
  relativeHumidityPct: number
  pressureHpa: number
  lightLevel: number
}

export type PingSample = {
  deviceId: string
  at: string
  latencyMs: number
  ok: boolean
}

/** Periodic device beacon / heartbeat payload. */
export type DeviceBeacon = {
  id: string
  deviceId: string
  at: string
  seq: number
  status: BeaconStatus
  rssiDbm: number | null
  uptimeSec: number
  freeHeapKb: number | null
  batteryPct: number | null
  firmware: string
  intervalSec: number
  payloadBytes: number
}

export type FleetAlert = {
  id: string
  deviceId: string | null
  severity: AlertSeverity
  title: string
  detail: string
  at: string
  acknowledged: boolean
}

export const devices: Device[] = [
  {
    id: 'esp32-roof-01',
    name: 'Roof Station',
    model: 'ESP32-WROOM-32',
    chipRevision: 'v3.1',
    firmware: '1.4.2',
    firmwareChannel: 'stable',
    status: 'online',
    lastSeenAt: '2026-10-24T09:52:00Z',
    lastBootAt: '2026-10-11T08:10:00Z',
    lastPingMs: 18,
    avgPingMs: 22,
    packetLossPct: 0.2,
    uptimeHours: 312,
    rebootCount: 3,
    location: 'Roof · north edge',
    ip: '192.168.1.41',
    mac: '24:6F:28:A1:C3:01',
    ssid: 'WeatherLab-IoT',
    rssiDbm: -51,
    mqttTopic: 'station/roof/telemetry',
    cpuTempC: 46.2,
    freeHeapKb: 184,
    flashMb: 4,
    power: 'mains',
    batteryPct: null,
    sensors: ['BME280', 'BH1750', 'DS18B20'],
    tags: ['primary', 'outdoor'],
    notes: 'Primary uplink. Mounted under solar shield.',
  },
  {
    id: 'esp32-garden-02',
    name: 'Garden Node',
    model: 'ESP32-S3',
    chipRevision: 'v0.2',
    firmware: '1.4.2',
    firmwareChannel: 'stable',
    status: 'online',
    lastSeenAt: '2026-10-24T09:51:40Z',
    lastBootAt: '2026-10-16T14:22:00Z',
    lastPingMs: 31,
    avgPingMs: 35,
    packetLossPct: 1.1,
    uptimeHours: 188,
    rebootCount: 5,
    location: 'Back garden',
    ip: '192.168.1.42',
    mac: '24:6F:28:A1:C3:02',
    ssid: 'WeatherLab-IoT',
    rssiDbm: -67,
    mqttTopic: 'station/garden/telemetry',
    cpuTempC: 51.8,
    freeHeapKb: 212,
    flashMb: 8,
    power: 'battery',
    batteryPct: 78,
    sensors: ['BME680', 'TSL2591', 'Soil moisture'],
    tags: ['outdoor', 'garden'],
    notes: 'Battery-backed. Soil probe buried 8cm.',
  },
  {
    id: 'esp32-shed-03',
    name: 'Shed Sensor',
    model: 'ESP32-C3',
    chipRevision: 'v0.4',
    firmware: '1.3.9',
    firmwareChannel: 'beta',
    status: 'degraded',
    lastSeenAt: '2026-10-24T09:48:12Z',
    lastBootAt: '2026-10-22T03:41:00Z',
    lastPingMs: 142,
    avgPingMs: 96,
    packetLossPct: 8.4,
    uptimeHours: 54,
    rebootCount: 17,
    location: 'Tool shed',
    ip: '192.168.1.43',
    mac: '24:6F:28:A1:C3:03',
    ssid: 'WeatherLab-IoT',
    rssiDbm: -81,
    mqttTopic: 'station/shed/telemetry',
    cpuTempC: 58.4,
    freeHeapKb: 96,
    flashMb: 4,
    power: 'mains',
    batteryPct: null,
    sensors: ['BME280', 'PIR'],
    tags: ['indoor', 'beta'],
    notes: 'Weak Wi‑Fi through metal shed. OTA stuck mid-retry.',
  },
  {
    id: 'esp32-balcony-04',
    name: 'Balcony Probe',
    model: 'ESP32-WROOM-32',
    chipRevision: 'v3.0',
    firmware: '1.2.0',
    firmwareChannel: 'stable',
    status: 'offline',
    lastSeenAt: '2026-10-23T21:14:05Z',
    lastBootAt: '2026-10-20T19:02:00Z',
    lastPingMs: null,
    avgPingMs: 28,
    packetLossPct: 100,
    uptimeHours: 0,
    rebootCount: 9,
    location: 'East balcony',
    ip: '192.168.1.44',
    mac: '24:6F:28:A1:C3:04',
    ssid: 'WeatherLab-IoT',
    rssiDbm: null,
    mqttTopic: 'station/balcony/telemetry',
    cpuTempC: null,
    freeHeapKb: null,
    flashMb: 4,
    power: 'battery',
    batteryPct: 4,
    sensors: ['DHT22', 'BH1750'],
    tags: ['outdoor', 'legacy'],
    notes: 'Likely battery dead. Last brownout before drop.',
  },
]

export const liveReadings: WeatherReading[] = [
  {
    id: 'rd-1001',
    deviceId: 'esp32-roof-01',
    recordedAt: '2026-10-24T09:52:00Z',
    temperatureC: 28.4,
    relativeHumidityPct: 64.2,
    pressureHpa: 1008.6,
    lightLevel: 4120,
  },
  {
    id: 'rd-1002',
    deviceId: 'esp32-garden-02',
    recordedAt: '2026-10-24T09:51:40Z',
    temperatureC: 27.1,
    relativeHumidityPct: 71.8,
    pressureHpa: 1009.1,
    lightLevel: 2860,
  },
  {
    id: 'rd-1003',
    deviceId: 'esp32-shed-03',
    recordedAt: '2026-10-24T09:48:12Z',
    temperatureC: 25.6,
    relativeHumidityPct: 78.0,
    pressureHpa: 1008.9,
    lightLevel: 420,
  },
]

export const historyReadings: WeatherReading[] = [
  {
    id: 'rd-0901',
    deviceId: 'esp32-roof-01',
    recordedAt: '2026-10-24T09:45:00Z',
    temperatureC: 28.1,
    relativeHumidityPct: 65.0,
    pressureHpa: 1008.4,
    lightLevel: 3980,
  },
  {
    id: 'rd-0902',
    deviceId: 'esp32-garden-02',
    recordedAt: '2026-10-24T09:45:00Z',
    temperatureC: 26.9,
    relativeHumidityPct: 72.4,
    pressureHpa: 1009.0,
    lightLevel: 2710,
  },
  {
    id: 'rd-0903',
    deviceId: 'esp32-roof-01',
    recordedAt: '2026-10-24T09:30:00Z',
    temperatureC: 27.8,
    relativeHumidityPct: 66.1,
    pressureHpa: 1008.2,
    lightLevel: 3650,
  },
  {
    id: 'rd-0904',
    deviceId: 'esp32-shed-03',
    recordedAt: '2026-10-24T09:30:00Z',
    temperatureC: 25.2,
    relativeHumidityPct: 79.3,
    pressureHpa: 1008.7,
    lightLevel: 380,
  },
  {
    id: 'rd-0905',
    deviceId: 'esp32-garden-02',
    recordedAt: '2026-10-24T09:15:00Z',
    temperatureC: 26.4,
    relativeHumidityPct: 73.5,
    pressureHpa: 1008.8,
    lightLevel: 2400,
  },
  {
    id: 'rd-0906',
    deviceId: 'esp32-balcony-04',
    recordedAt: '2026-10-23T21:14:00Z',
    temperatureC: 24.0,
    relativeHumidityPct: 81.2,
    pressureHpa: 1010.3,
    lightLevel: 15,
  },
  {
    id: 'rd-0907',
    deviceId: 'esp32-roof-01',
    recordedAt: '2026-10-24T09:00:00Z',
    temperatureC: 27.2,
    relativeHumidityPct: 67.8,
    pressureHpa: 1008.0,
    lightLevel: 3100,
  },
  {
    id: 'rd-0908',
    deviceId: 'esp32-garden-02',
    recordedAt: '2026-10-24T09:00:00Z',
    temperatureC: 25.9,
    relativeHumidityPct: 74.1,
    pressureHpa: 1008.5,
    lightLevel: 1980,
  },
]

export const recentPings: PingSample[] = [
  { deviceId: 'esp32-roof-01', at: '2026-10-24T09:52:05Z', latencyMs: 18, ok: true },
  { deviceId: 'esp32-garden-02', at: '2026-10-24T09:52:05Z', latencyMs: 31, ok: true },
  { deviceId: 'esp32-shed-03', at: '2026-10-24T09:52:05Z', latencyMs: 142, ok: true },
  { deviceId: 'esp32-balcony-04', at: '2026-10-24T09:52:05Z', latencyMs: 0, ok: false },
  { deviceId: 'esp32-roof-01', at: '2026-10-24T09:51:05Z', latencyMs: 21, ok: true },
  { deviceId: 'esp32-garden-02', at: '2026-10-24T09:51:05Z', latencyMs: 29, ok: true },
  { deviceId: 'esp32-shed-03', at: '2026-10-24T09:51:05Z', latencyMs: 118, ok: true },
  { deviceId: 'esp32-balcony-04', at: '2026-10-24T09:51:05Z', latencyMs: 0, ok: false },
]

export const deviceBeacons: DeviceBeacon[] = [
  {
    id: 'bcn-4012',
    deviceId: 'esp32-roof-01',
    at: '2026-10-24T09:52:00Z',
    seq: 4012,
    status: 'ok',
    rssiDbm: -51,
    uptimeSec: 1_123_200,
    freeHeapKb: 184,
    batteryPct: null,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-2881',
    deviceId: 'esp32-garden-02',
    at: '2026-10-24T09:51:40Z',
    seq: 2881,
    status: 'ok',
    rssiDbm: -67,
    uptimeSec: 676_800,
    freeHeapKb: 212,
    batteryPct: 78,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 52,
  },
  {
    id: 'bcn-0914',
    deviceId: 'esp32-shed-03',
    at: '2026-10-24T09:51:58Z',
    seq: 914,
    status: 'weak',
    rssiDbm: -81,
    uptimeSec: 194_400,
    freeHeapKb: 96,
    batteryPct: null,
    firmware: '1.3.9',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-miss-47',
    deviceId: 'esp32-balcony-04',
    at: '2026-10-24T09:52:00Z',
    seq: 1540,
    status: 'missed',
    rssiDbm: null,
    uptimeSec: 0,
    freeHeapKb: null,
    batteryPct: 4,
    firmware: '1.2.0',
    intervalSec: 60,
    payloadBytes: 0,
  },
  {
    id: 'bcn-4011',
    deviceId: 'esp32-roof-01',
    at: '2026-10-24T09:51:00Z',
    seq: 4011,
    status: 'ok',
    rssiDbm: -52,
    uptimeSec: 1_123_140,
    freeHeapKb: 186,
    batteryPct: null,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-2880',
    deviceId: 'esp32-garden-02',
    at: '2026-10-24T09:50:40Z',
    seq: 2880,
    status: 'ok',
    rssiDbm: -66,
    uptimeSec: 676_740,
    freeHeapKb: 210,
    batteryPct: 78,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 52,
  },
  {
    id: 'bcn-0913',
    deviceId: 'esp32-shed-03',
    at: '2026-10-24T09:50:58Z',
    seq: 913,
    status: 'weak',
    rssiDbm: -79,
    uptimeSec: 194_340,
    freeHeapKb: 98,
    batteryPct: null,
    firmware: '1.3.9',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-0912',
    deviceId: 'esp32-shed-03',
    at: '2026-10-24T09:49:58Z',
    seq: 912,
    status: 'weak',
    rssiDbm: -82,
    uptimeSec: 194_280,
    freeHeapKb: 94,
    batteryPct: null,
    firmware: '1.3.9',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-4010',
    deviceId: 'esp32-roof-01',
    at: '2026-10-24T09:50:00Z',
    seq: 4010,
    status: 'ok',
    rssiDbm: -50,
    uptimeSec: 1_123_080,
    freeHeapKb: 185,
    batteryPct: null,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-2879',
    deviceId: 'esp32-garden-02',
    at: '2026-10-24T09:49:40Z',
    seq: 2879,
    status: 'ok',
    rssiDbm: -68,
    uptimeSec: 676_680,
    freeHeapKb: 214,
    batteryPct: 79,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 52,
  },
  {
    id: 'bcn-1539',
    deviceId: 'esp32-balcony-04',
    at: '2026-10-23T21:14:00Z',
    seq: 1539,
    status: 'weak',
    rssiDbm: -88,
    uptimeSec: 86_400,
    freeHeapKb: 72,
    batteryPct: 4,
    firmware: '1.2.0',
    intervalSec: 60,
    payloadBytes: 44,
  },
  {
    id: 'bcn-1538',
    deviceId: 'esp32-balcony-04',
    at: '2026-10-23T21:13:00Z',
    seq: 1538,
    status: 'weak',
    rssiDbm: -86,
    uptimeSec: 86_340,
    freeHeapKb: 74,
    batteryPct: 5,
    firmware: '1.2.0',
    intervalSec: 60,
    payloadBytes: 44,
  },
  {
    id: 'bcn-4005',
    deviceId: 'esp32-roof-01',
    at: '2026-10-24T09:45:00Z',
    seq: 4005,
    status: 'ok',
    rssiDbm: -51,
    uptimeSec: 1_122_780,
    freeHeapKb: 188,
    batteryPct: null,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-0908',
    deviceId: 'esp32-shed-03',
    at: '2026-10-24T09:45:58Z',
    seq: 908,
    status: 'weak',
    rssiDbm: -80,
    uptimeSec: 194_040,
    freeHeapKb: 101,
    batteryPct: null,
    firmware: '1.3.9',
    intervalSec: 60,
    payloadBytes: 48,
  },
  {
    id: 'bcn-2870',
    deviceId: 'esp32-garden-02',
    at: '2026-10-24T09:40:40Z',
    seq: 2870,
    status: 'ok',
    rssiDbm: -65,
    uptimeSec: 676_140,
    freeHeapKb: 209,
    batteryPct: 79,
    firmware: '1.4.2',
    intervalSec: 60,
    payloadBytes: 52,
  },
]

export const fleetAlerts: FleetAlert[] = [
  {
    id: 'al-1',
    deviceId: 'esp32-balcony-04',
    severity: 'critical',
    title: 'Device offline',
    detail: 'No heartbeat for 12h 38m. Last event was brownout at 4% battery.',
    at: '2026-10-24T09:52:05Z',
    acknowledged: false,
  },
  {
    id: 'al-2',
    deviceId: 'esp32-shed-03',
    severity: 'warning',
    title: 'High latency + packet loss',
    detail: 'Ping 142ms, loss 8.4%. Wi‑Fi RSSI -81 dBm through metal shed.',
    at: '2026-10-24T09:52:05Z',
    acknowledged: false,
  },
  {
    id: 'al-3',
    deviceId: 'esp32-shed-03',
    severity: 'warning',
    title: 'OTA failed',
    detail: 'CRC mismatch during firmware 1.4.2 → still on 1.3.9-beta.',
    at: '2026-10-24T09:48:12Z',
    acknowledged: false,
  },
  {
    id: 'al-4',
    deviceId: 'esp32-garden-02',
    severity: 'info',
    title: 'Battery healthy',
    detail: '78% remaining · estimated 41 hours at current draw.',
    at: '2026-10-24T09:35:22Z',
    acknowledged: true,
  },
  {
    id: 'al-5',
    deviceId: null,
    severity: 'info',
    title: 'API ingest OK',
    detail: 'Last 15 minutes: 42 telemetry posts, 0 5xx responses.',
    at: '2026-10-24T09:50:00Z',
    acknowledged: true,
  },
]

export function getDevice(id: string): Device | undefined {
  return devices.find((d) => d.id === id)
}

export function deviceName(id: string): string {
  return getDevice(id)?.name ?? id
}

export function beaconsForDevice(deviceId: string): DeviceBeacon[] {
  return deviceBeacons
    .filter((b) => b.deviceId === deviceId)
    .sort((a, b) => b.at.localeCompare(a.at))
}

export function formatBeaconUptime(sec: number): string {
  if (sec <= 0) return '—'
  const d = Math.floor(sec / 86_400)
  const h = Math.floor((sec % 86_400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function readingsForDevice(deviceId: string): WeatherReading[] {
  return [...liveReadings, ...historyReadings]
    .filter((r) => r.deviceId === deviceId)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatUptime(hours: number): string {
  if (hours <= 0) return '—'
  const d = Math.floor(hours / 24)
  const h = hours % 24
  return d > 0 ? `${d}d ${h}h` : `${h}h`
}

export const fleetSummary = {
  total: devices.length,
  online: devices.filter((d) => d.status === 'online').length,
  degraded: devices.filter((d) => d.status === 'degraded').length,
  offline: devices.filter((d) => d.status === 'offline').length,
  avgPingMs: Math.round(
    devices.filter((d) => d.lastPingMs != null).reduce((sum, d) => sum + (d.lastPingMs ?? 0), 0) /
      devices.filter((d) => d.lastPingMs != null).length,
  ),
  openAlerts: fleetAlerts.filter((a) => !a.acknowledged).length,
  missedBeacons: deviceBeacons.filter((b) => b.status === 'missed').length,
  weakBeacons: deviceBeacons.filter((b) => b.status === 'weak').length,
  lastTelemetryAt: liveReadings
    .map((r) => r.recordedAt)
    .sort()
    .at(-1)!,
}
