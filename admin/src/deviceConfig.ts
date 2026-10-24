import type { NewDeviceInput } from './fleet/FleetContext'
import type { AppSettings } from './data/settings'

export type TelemetryGroup = {
  enabled: boolean
  intervalSec: number
}

export type DeviceProvisionOptions = {
  wifiPassword: string
  sensors: TelemetryGroup
  internal: TelemetryGroup
  privateKeyPkcs8B64: string
}

function yamlQuote(value: string): string {
  if (value === '') return '""'
  if (/[:#{}[\],&*?|>!%@`']|\s/.test(value) || value.includes('"')) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  return value
}

function bytesToBase64(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(bin)
}

/** Ed25519 key pair via Web Crypto. Private key goes in device YAML; public key stays in admin for later API registration. */
export async function generateEd25519KeyPair(): Promise<{
  privateKeyPkcs8B64: string
  publicKeySpkiB64: string
}> {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
  ])
  const [pkcs8, spki] = await Promise.all([
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
    crypto.subtle.exportKey('spki', keyPair.publicKey),
  ])
  return {
    privateKeyPkcs8B64: bytesToBase64(pkcs8),
    publicKeySpkiB64: bytesToBase64(spki),
  }
}

export function buildDeviceConfigYaml(
  input: Omit<NewDeviceInput, 'publicKeySpkiB64'>,
  settings: AppSettings,
  options: DeviceProvisionOptions,
): { yaml: string; filename: string } {
  const id = input.id.trim()

  const yaml = `# Weather Station device config
# Flash as /config.yaml on the node.
# Generated ${new Date().toISOString()}

device:
  id: ${yamlQuote(id)}
  name: ${yamlQuote(input.name.trim())}
  location: ${yamlQuote(input.location.trim() || 'unassigned')}

wifi:
  ssid: ${yamlQuote(input.ssid.trim() || settings.defaultSsid)}
  password: ${yamlQuote(options.wifiPassword)}

api:
  base_url: ${yamlQuote(settings.apiBaseUrl.replace(/\/$/, ''))}
  telemetry_path: "/api/v1/telemetry"
  api_key: ${yamlQuote(settings.apiKey)}
  auth:
    algorithm: Ed25519
    private_key_pkcs8: ${yamlQuote(options.privateKeyPkcs8B64)}

telemetry:
  sensors:
    enabled: ${options.sensors.enabled}
    interval_sec: ${options.sensors.intervalSec}
  internal:
    enabled: ${options.internal.enabled}
    interval_sec: ${options.internal.intervalSec}
`

  return {
    yaml: yaml.trimEnd() + '\n',
    filename: 'config.yaml',
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadTextFile(filename: string, text: string, mime = 'text/yaml') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
