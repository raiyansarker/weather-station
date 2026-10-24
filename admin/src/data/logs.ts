export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type LogSource = 'api' | 'ingest' | 'device' | 'wifi' | 'ota' | 'auth'

export type FleetLog = {
  id: string
  at: string
  level: LogLevel
  source: LogSource
  deviceId: string | null
  message: string
  method?: string
  path?: string
  statusCode?: number
  durationMs?: number
  requestId?: string
  remoteIp?: string
  bytesIn?: number
  bytesOut?: number
  fields?: Record<string, string | number | boolean | null>
}

function noise(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const devices = [
  'esp32-roof-01',
  'esp32-garden-02',
  'esp32-shed-03',
  'esp32-balcony-04',
] as const

type Template = {
  level: LogLevel
  source: LogSource
  message: string
  method?: string
  path?: string
  statusCode?: number
  withDevice?: boolean
  offlineOk?: boolean
  fields?: (deviceId: string | null, n: number) => Record<string, string | number | boolean | null>
}

const templates: Template[] = [
  {
    level: 'info',
    source: 'ingest',
    message: 'Telemetry accepted',
    method: 'POST',
    path: '/api/v1/telemetry',
    statusCode: 201,
    withDevice: true,
    fields: (d, n) => ({
      reading_id: `rd-${1000 + (n % 900)}`,
      content_type: 'application/json',
      schema: 'weather.v1',
      temp_c: Number((24 + noise(n) * 6).toFixed(1)),
      rh_pct: Number((55 + noise(n + 1) * 25).toFixed(1)),
      device_id: d,
    }),
  },
  {
    level: 'info',
    source: 'ingest',
    message: 'Batch ingest flushed to TimescaleDB',
    method: 'POST',
    path: '/api/v1/telemetry/batch',
    statusCode: 200,
    fields: (_d, n) => ({
      rows: 12 + Math.floor(noise(n) * 30),
      hypertable: 'weather_readings',
      chunk: '2026-10-24',
    }),
  },
  {
    level: 'warn',
    source: 'ingest',
    message: 'Rejected telemetry — schema validation failed',
    method: 'POST',
    path: '/api/v1/telemetry',
    statusCode: 422,
    withDevice: true,
    fields: (d) => ({
      error: 'pressure_hpa out of range',
      field: 'pressure_hpa',
      got: 42,
      device_id: d,
    }),
  },
  {
    level: 'error',
    source: 'ingest',
    message: 'Insert failed — database unavailable',
    method: 'POST',
    path: '/api/v1/telemetry',
    statusCode: 503,
    withDevice: true,
    fields: (d) => ({
      error: 'connection refused',
      target: 'postgres:5432',
      device_id: d,
      retried: true,
    }),
  },
  {
    level: 'info',
    source: 'api',
    message: 'Health check ok',
    method: 'GET',
    path: '/health',
    statusCode: 200,
    fields: () => ({ db: 'up', version: '0.3.1' }),
  },
  {
    level: 'info',
    source: 'api',
    message: 'Listed devices',
    method: 'GET',
    path: '/api/v1/devices',
    statusCode: 200,
    fields: (_d, n) => ({ count: 4, page: 1, took_ms: 4 + Math.floor(noise(n) * 20) }),
  },
  {
    level: 'warn',
    source: 'auth',
    message: 'Request rejected — invalid API key',
    method: 'POST',
    path: '/api/v1/telemetry',
    statusCode: 401,
    fields: (_d, n) => ({
      remote_ip: `192.168.1.${40 + Math.floor(noise(n) * 20)}`,
      reason: 'api_key_mismatch',
    }),
  },
  {
    level: 'warn',
    source: 'api',
    message: 'Rate limited',
    method: 'POST',
    path: '/api/v1/telemetry',
    statusCode: 429,
    withDevice: true,
    fields: (d, n) => ({
      limit: '60/min',
      retry_after_sec: 12 + Math.floor(noise(n) * 20),
      device_id: d,
    }),
  },
  {
    level: 'info',
    source: 'wifi',
    message: 'Station associated to AP',
    withDevice: true,
    fields: (d, n) => ({
      ssid: 'WeatherLab-IoT',
      rssi_dbm: -45 - Math.floor(noise(n) * 40),
      channel: 6,
      device_id: d,
    }),
  },
  {
    level: 'warn',
    source: 'wifi',
    message: 'Wi‑Fi disconnect — beacon timeout',
    withDevice: true,
    offlineOk: true,
    fields: (d, n) => ({
      reason: 'beacon_timeout',
      rssi_dbm: -88 - Math.floor(noise(n) * 8),
      device_id: d,
    }),
  },
  {
    level: 'error',
    source: 'device',
    message: 'Sensor read failed',
    withDevice: true,
    fields: (d, n) => ({
      sensor: n % 2 === 0 ? 'BME280' : 'BH1750',
      bus: 'i2c0',
      error: 'NACK / timeout',
      device_id: d,
    }),
  },
  {
    level: 'debug',
    source: 'device',
    message: 'Heartbeat sent',
    withDevice: true,
    fields: (d, n) => ({
      uptime_sec: 80_000 + n * 60,
      free_heap_kb: 90 + Math.floor(noise(n) * 100),
      firmware: n % 5 === 0 ? '1.3.9' : '1.4.2',
      device_id: d,
    }),
  },
  {
    level: 'info',
    source: 'ota',
    message: 'OTA download started',
    withDevice: true,
    fields: (d) => ({
      from: '1.3.9',
      to: '1.4.2',
      url: 'https://ota.weatherlab.local/fw/1.4.2.bin',
      device_id: d,
    }),
  },
  {
    level: 'error',
    source: 'ota',
    message: 'OTA aborted — CRC mismatch',
    withDevice: true,
    fields: (d) => ({
      expected: 'a3f91c…',
      got: '000000…',
      bytes: 1_048_576,
      device_id: d,
    }),
  },
  {
    level: 'info',
    source: 'ota',
    message: 'OTA applied; rebooting',
    withDevice: true,
    fields: (d) => ({ to: '1.4.2', device_id: d }),
  },
  {
    level: 'warn',
    source: 'device',
    message: 'Brownout detector fired',
    withDevice: true,
    offlineOk: true,
    fields: (d, n) => ({
      rail_mv: 3100 + Math.floor(noise(n) * 200),
      device_id: d,
    }),
  },
  {
    level: 'error',
    source: 'api',
    message: 'Upstream timeout waiting for device',
    method: 'POST',
    path: '/api/v1/devices/:id/ping',
    statusCode: 504,
    withDevice: true,
    offlineOk: true,
    fields: (d) => ({ timeout_ms: 3000, device_id: d }),
  },
]

function pickDevice(n: number, offlineOk?: boolean): string {
  if (offlineOk && noise(n + 9) > 0.55) return 'esp32-balcony-04'
  const idx = Math.floor(noise(n + 3) * (offlineOk ? 4 : 3))
  return devices[Math.min(idx, offlineOk ? 3 : 2)]
}

function buildFleetLogs(): FleetLog[] {
  const end = Date.parse('2026-10-24T09:52:40Z')
  const out: FleetLog[] = []

  for (let i = 0; i < 120; i += 1) {
    const tmpl = templates[Math.floor(noise(i * 1.7) * templates.length)]!
    const deviceId = tmpl.withDevice ? pickDevice(i, tmpl.offlineOk) : null
    const at = new Date(end - i * 47_000 - Math.floor(noise(i) * 12_000)).toISOString()
    const durationBase =
      tmpl.statusCode && tmpl.statusCode >= 500
        ? 800
        : tmpl.source === 'ingest'
          ? 18
          : 6
    const durationMs = tmpl.method
      ? Math.round(durationBase + noise(i + 2) * (tmpl.statusCode && tmpl.statusCode >= 400 ? 400 : 40))
      : undefined

    out.push({
      id: `log-${String(120 - i).padStart(4, '0')}`,
      at,
      level: tmpl.level,
      source: tmpl.source,
      deviceId,
      message: tmpl.message,
      method: tmpl.method,
      path: tmpl.path?.replace(':id', deviceId ?? 'unknown'),
      statusCode: tmpl.statusCode,
      durationMs,
      requestId: tmpl.method ? `req_${(noise(i + 5) * 1e8).toString(16).slice(0, 8)}` : undefined,
      remoteIp: tmpl.method
        ? deviceId === 'esp32-roof-01'
          ? '192.168.1.41'
          : deviceId === 'esp32-garden-02'
            ? '192.168.1.42'
            : deviceId === 'esp32-shed-03'
              ? '192.168.1.43'
              : deviceId
                ? '192.168.1.44'
                : `10.0.0.${20 + (i % 30)}`
        : undefined,
      bytesIn: tmpl.method === 'POST' ? 180 + Math.floor(noise(i) * 220) : undefined,
      bytesOut: tmpl.method ? 40 + Math.floor(noise(i + 1) * 120) : undefined,
      fields: tmpl.fields?.(deviceId, i),
    })
  }

  return out.sort((a, b) => b.at.localeCompare(a.at))
}

export const fleetLogs: FleetLog[] = buildFleetLogs()

export function logsForDevice(deviceId: string): FleetLog[] {
  return fleetLogs.filter((l) => l.deviceId === deviceId)
}
