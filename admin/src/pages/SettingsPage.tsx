import { useEffect, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
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
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Stack spacing={1.75}>{children}</Stack>
    </Paper>
  )
}

export function SettingsPage() {
  const { settings, updateSettings } = useFleet()
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
    <Stack spacing={2.5} maxWidth={560}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.75 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          API connection and display units. Demo only — saved in this browser session.
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
      </Section>

      <Section title="Units" description="How readings appear in charts and tables.">
        <TextField
          select
          label="Temperature"
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
          label="Pressure"
          fullWidth
          size="small"
          value={draft.pressureUnit}
          onChange={(e) => setField('pressureUnit', e.target.value as 'hpa' | 'inhg')}
        >
          <MenuItem value="hpa">hPa</MenuItem>
          <MenuItem value="inhg">inHg</MenuItem>
        </TextField>
      </Section>

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
