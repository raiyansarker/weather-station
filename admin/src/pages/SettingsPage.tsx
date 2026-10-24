import { useEffect, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import type { AppSettings } from '../data/settings'
import { useFleet } from '../fleet/FleetContext'

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  )
}

export function SettingsPage() {
  const { settings, updateSettings, devices } = useFleet()
  const [draft, setDraft] = useState<AppSettings>(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)

  function setField<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    updateSettings(draft)
    setSaved(true)
  }

  function handleReset() {
    setDraft(settings)
  }

  return (
    <Stack spacing={3} maxWidth={720}>
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          API connection, fleet defaults, beacon thresholds, and notifications. Demo only —
          saved in this browser session.
        </Typography>
      </Box>

      {dirty && (
        <Alert
          severity="info"
          action={
            <Stack direction="row" spacing={1}>
              <Button color="inherit" size="small" onClick={handleReset}>
                Discard
              </Button>
              <Button color="inherit" size="small" variant="outlined" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          }
        >
          You have unsaved settings changes.
        </Alert>
      )}

      <Section title="API connection" description="Where Weather Admin talks to the Go backend.">
        <TextField
          label="API base URL"
          fullWidth
          size="small"
          value={draft.apiBaseUrl}
          onChange={(e) => setField('apiBaseUrl', e.target.value)}
        />
        <TextField
          label="Admin API key"
          type="password"
          fullWidth
          size="small"
          value={draft.apiKey}
          onChange={(e) => setField('apiKey', e.target.value)}
        />
        <TextField
          label="Broker URL (unused)"
          fullWidth
          size="small"
          value={draft.mqttBroker}
          onChange={(e) => setField('mqttBroker', e.target.value)}
          helperText="Not used by the Go API — demo field only."
        />
      </Section>

      <Section
        title="Fleet defaults"
        description="Applied when provisioning new devices from the admin panel."
      >
        <TextField
          label="Default Wi‑Fi SSID"
          fullWidth
          size="small"
          value={draft.defaultSsid}
          onChange={(e) => setField('defaultSsid', e.target.value)}
        />
        <TextField
          label="Ops email"
          fullWidth
          size="small"
          value={draft.adminEmail}
          onChange={(e) => setField('adminEmail', e.target.value)}
        />
        <TextField
          select
          label="Timezone"
          fullWidth
          size="small"
          value={draft.timezone}
          onChange={(e) => setField('timezone', e.target.value)}
        >
          <MenuItem value="Asia/Dhaka">Asia/Dhaka</MenuItem>
          <MenuItem value="UTC">UTC</MenuItem>
          <MenuItem value="America/New_York">America/New_York</MenuItem>
          <MenuItem value="Europe/London">Europe/London</MenuItem>
        </TextField>
        <Typography variant="caption" color="text.secondary">
          Current fleet size: {devices.length} devices
        </Typography>
      </Section>

      <Section title="Units & display" description="How readings and lists appear in the console.">
        <TextField
          select
          label="Temperature unit"
          fullWidth
          size="small"
          value={draft.temperatureUnit}
          onChange={(e) => setField('temperatureUnit', e.target.value as 'c' | 'f')}
        >
          <MenuItem value="c">Celsius (°C)</MenuItem>
          <MenuItem value="f">Fahrenheit (°F)</MenuItem>
        </TextField>
        <TextField
          select
          label="Pressure unit"
          fullWidth
          size="small"
          value={draft.pressureUnit}
          onChange={(e) => setField('pressureUnit', e.target.value as 'hpa' | 'inhg')}
        >
          <MenuItem value="hpa">hPa</MenuItem>
          <MenuItem value="inhg">inHg</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={draft.showOfflineOnDashboard}
              onChange={(e) => setField('showOfflineOnDashboard', e.target.checked)}
            />
          }
          label="Show offline devices on dashboard"
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.highlightHighPing}
              onChange={(e) => setField('highlightHighPing', e.target.checked)}
            />
          }
          label={`Highlight high ping (>${draft.highPingMs} ms)`}
        />
        <TextField
          label="High ping threshold (ms)"
          type="number"
          fullWidth
          size="small"
          value={draft.highPingMs}
          onChange={(e) => setField('highPingMs', Number(e.target.value))}
        />
      </Section>

      <Section
        title="Beacons & health"
        description="Heartbeat expectations used for weak / missed beacon status."
      >
        <TextField
          label="Expected beacon interval (seconds)"
          type="number"
          fullWidth
          size="small"
          value={draft.beaconIntervalSec}
          onChange={(e) => setField('beaconIntervalSec', Number(e.target.value))}
        />
        <TextField
          label="Missed after (seconds)"
          type="number"
          fullWidth
          size="small"
          value={draft.beaconMissedAfterSec}
          onChange={(e) => setField('beaconMissedAfterSec', Number(e.target.value))}
          helperText="No beacon within this window → missed"
        />
        <TextField
          label="Weak RSSI threshold (dBm)"
          type="number"
          fullWidth
          size="small"
          value={draft.weakRssiThreshold}
          onChange={(e) => setField('weakRssiThreshold', Number(e.target.value))}
        />
        <TextField
          label="Ping interval (seconds)"
          type="number"
          fullWidth
          size="small"
          value={draft.pingIntervalSec}
          onChange={(e) => setField('pingIntervalSec', Number(e.target.value))}
        />
      </Section>

      <Section
        title="Notifications"
        description="Which fleet events should raise attention in the console."
      >
        <FormControlLabel
          control={
            <Switch
              checked={draft.notifyOnOffline}
              onChange={(e) => setField('notifyOnOffline', e.target.checked)}
            />
          }
          label="Notify when a device goes offline"
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.notifyOnMissedBeacon}
              onChange={(e) => setField('notifyOnMissedBeacon', e.target.checked)}
            />
          }
          label="Notify on missed beacons"
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.notifyOnOtaFail}
              onChange={(e) => setField('notifyOnOtaFail', e.target.checked)}
            />
          }
          label="Notify on OTA failures"
        />
      </Section>

      <Divider />

      <Stack direction="row" spacing={1.5}>
        <Button variant="contained" disabled={!dirty} onClick={handleSave}>
          Save settings
        </Button>
        <Button disabled={!dirty} onClick={handleReset}>
          Discard
        </Button>
      </Stack>

      <Snackbar
        open={saved}
        autoHideDuration={2500}
        onClose={() => setSaved(false)}
        message="Settings saved for this session"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  )
}
