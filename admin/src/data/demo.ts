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
  sensors: string[]
  tags: string[]
  notes: string
  /** Ed25519 SPKI public key (base64). Null on demo seeds; set when provisioning. */
  publicKeySpkiB64: string | null
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
    sensors: ['BME280', 'BH1750', 'DS18B20'],
    tags: ['primary', 'outdoor'],
    notes: 'Primary uplink. Mounted under solar shield.',
    publicKeySpkiB64: null,
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
    sensors: ['BME680', 'TSL2591', 'Soil moisture'],
    tags: ['outdoor', 'garden'],
    notes: 'Soil probe buried 8cm.',
    publicKeySpkiB64: null,
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
    sensors: ['BME280', 'PIR'],
    tags: ['indoor', 'beta'],
    notes: 'Weak Wi‑Fi through metal shed. OTA stuck mid-retry.',
    publicKeySpkiB64: null,
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
    sensors: ['DHT22', 'BH1750'],
    tags: ['outdoor', 'legacy'],
    notes: 'Offline after Wi‑Fi loss; last event was a brownout.',
    publicKeySpkiB64: null,
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

/** Deterministic demo noise (no Math.random) so charts stay stable. */
function demoNoise(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildHistoryReadings(): WeatherReading[] {
  const end = Date.parse('2026-10-24T09:45:00Z')
  const profiles = [
    {
      id: 'esp32-roof-01',
      baseTemp: 27.4,
      amp: 1.9,
      baseRh: 66,
      basePress: 1008.4,
      baseLight: 3400,
    },
    {
      id: 'esp32-garden-02',
      baseTemp: 26.1,
      amp: 2.3,
      baseRh: 73,
      basePress: 1009.0,
      baseLight: 2500,
    },
    {
      id: 'esp32-shed-03',
      baseTemp: 24.9,
      amp: 1.1,
      baseRh: 78,
      basePress: 1008.8,
      baseLight: 420,
    },
  ] as const

  const out: WeatherReading[] = []
  let n = 0
  // 12 hours @ 15 min → 48 ticks × 3 devices
  for (let step = 48; step >= 1; step -= 1) {
    const ms = end - step * 15 * 60_000
    const at = new Date(ms).toISOString()
    const hour = new Date(ms).getUTCHours() + new Date(ms).getUTCMinutes() / 60
    for (const p of profiles) {
      n += 1
      const wave = Math.sin(((hour - 6) / 24) * Math.PI * 2)
      const jitter = (demoNoise(n) - 0.5) * 0.4
      out.push({
        id: `rd-h${String(n).padStart(3, '0')}`,
        deviceId: p.id,
        recordedAt: at,
        temperatureC: Number((p.baseTemp + p.amp * wave + jitter).toFixed(1)),
        relativeHumidityPct: Number(
          (p.baseRh - wave * 4 + (demoNoise(n + 7) - 0.5) * 1.5).toFixed(1),
        ),
        pressureHpa: Number((p.basePress + wave * 0.6 + (demoNoise(n + 3) - 0.5) * 0.2).toFixed(1)),
        lightLevel: Math.max(
          10,
          Math.round(p.baseLight * (0.15 + 0.85 * Math.max(0, Math.sin(((hour - 5) / 14) * Math.PI)))),
        ),
      })
    }
  }

  out.push({
    id: 'rd-hbal',
    deviceId: 'esp32-balcony-04',
    recordedAt: '2026-10-23T21:14:00Z',
    temperatureC: 24.0,
    relativeHumidityPct: 81.2,
    pressureHpa: 1010.3,
    lightLevel: 15,
  })

  return out
}

export const historyReadings: WeatherReading[] = buildHistoryReadings()

function buildRecentPings(): PingSample[] {
  const end = Date.parse('2026-10-24T09:52:05Z')
  const profiles = [
    { id: 'esp32-roof-01', base: 20, spread: 6 },
    { id: 'esp32-garden-02', base: 32, spread: 8 },
    { id: 'esp32-shed-03', base: 125, spread: 28 },
  ] as const
  const out: PingSample[] = []
  for (let step = 29; step >= 0; step -= 1) {
    const at = new Date(end - step * 60_000).toISOString()
    for (const p of profiles) {
      const n = step * 10 + p.base
      const latencyMs = Math.max(8, Math.round(p.base + (demoNoise(n) - 0.5) * p.spread * 2))
      out.push({ deviceId: p.id, at, latencyMs, ok: true })
    }
    out.push({
      deviceId: 'esp32-balcony-04',
      at,
      latencyMs: 0,
      ok: false,
    })
  }
  return out
}

export const recentPings: PingSample[] = buildRecentPings()

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
    detail: 'No heartbeat for 12h 38m. Last event was a brownout before drop.',
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
    title: 'Node healthy',
    detail: 'Garden node reporting clean heartbeats.',
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
