export type AppSettings = {
  apiBaseUrl: string
  apiKey: string
  temperatureUnit: 'c' | 'f'
  pressureUnit: 'hpa' | 'inhg'
  pingIntervalSec: number
  beaconIntervalSec: number
  beaconMissedAfterSec: number
  weakRssiThreshold: number
  highPingMs: number
  showOfflineOnDashboard: boolean
  highlightHighPing: boolean
  notifyOnOffline: boolean
  notifyOnMissedBeacon: boolean
  notifyOnOtaFail: boolean
  defaultSsid: string
  mqttBroker: string
  adminEmail: string
  timezone: string
}

export const defaultSettings: AppSettings = {
  apiBaseUrl: 'http://localhost:8000',
  apiKey: 'demo-key-weather-admin',
  temperatureUnit: 'c',
  pressureUnit: 'hpa',
  pingIntervalSec: 60,
  beaconIntervalSec: 60,
  beaconMissedAfterSec: 180,
  weakRssiThreshold: -75,
  highPingMs: 100,
  showOfflineOnDashboard: true,
  highlightHighPing: true,
  notifyOnOffline: true,
  notifyOnMissedBeacon: true,
  notifyOnOtaFail: true,
  defaultSsid: 'WeatherLab-IoT',
  mqttBroker: 'mqtt://192.168.1.10:1883',
  adminEmail: 'ops@weatherlab.local',
  timezone: 'Asia/Dhaka',
}
