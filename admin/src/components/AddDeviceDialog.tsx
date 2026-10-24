import { useState, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import { useFleet, type NewDeviceInput } from '../fleet/FleetContext'

const emptyForm = (defaultSsid: string): NewDeviceInput => ({
  id: '',
  name: '',
  model: 'ESP32-WROOM-32',
  location: '',
  ip: '',
  mac: '',
  ssid: defaultSsid,
  mqttTopic: '',
  firmware: '1.4.2',
  firmwareChannel: 'stable',
  power: 'mains',
  sensors: 'BME280, BH1750',
  tags: 'outdoor',
  notes: '',
})

type Props = {
  open: boolean
  onClose: () => void
  onAdded?: (deviceId: string) => void
}

export function AddDeviceDialog({ open, onClose, onAdded }: Props) {
  const { addDevice, settings } = useFleet()
  const [form, setForm] = useState<NewDeviceInput>(() => emptyForm(settings.defaultSsid))
  const [error, setError] = useState<string | null>(null)

  function setField<K extends keyof NewDeviceInput>(key: K, value: NewDeviceInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleClose() {
    setError(null)
    setForm(emptyForm(settings.defaultSsid))
    onClose()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = addDevice(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const id = form.id.trim()
    handleClose()
    onAdded?.(id)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add device</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Device ID"
                required
                fullWidth
                size="small"
                placeholder="esp32-patio-05"
                value={form.id}
                onChange={(e) => setField('id', e.target.value)}
                helperText="Unique ID used by the Go API"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Display name"
                required
                fullWidth
                size="small"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Model"
                fullWidth
                size="small"
                value={form.model}
                onChange={(e) => setField('model', e.target.value)}
              >
                <MenuItem value="ESP32-WROOM-32">ESP32-WROOM-32</MenuItem>
                <MenuItem value="ESP32-S3">ESP32-S3</MenuItem>
                <MenuItem value="ESP32-C3">ESP32-C3</MenuItem>
                <MenuItem value="ESP32-C6">ESP32-C6</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Location"
                fullWidth
                size="small"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="IP address"
                fullWidth
                size="small"
                value={form.ip}
                onChange={(e) => setField('ip', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="MAC"
                fullWidth
                size="small"
                placeholder="24:6F:28:A1:C3:05"
                value={form.mac}
                onChange={(e) => setField('mac', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Wi‑Fi SSID"
                fullWidth
                size="small"
                value={form.ssid}
                onChange={(e) => setField('ssid', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Topic / path"
                fullWidth
                size="small"
                placeholder="station/patio/telemetry"
                value={form.mqttTopic}
                onChange={(e) => setField('mqttTopic', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Firmware"
                fullWidth
                size="small"
                value={form.firmware}
                onChange={(e) => setField('firmware', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                select
                label="Channel"
                fullWidth
                size="small"
                value={form.firmwareChannel}
                onChange={(e) =>
                  setField('firmwareChannel', e.target.value as 'stable' | 'beta')
                }
              >
                <MenuItem value="stable">stable</MenuItem>
                <MenuItem value="beta">beta</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                label="Power"
                fullWidth
                size="small"
                value={form.power}
                onChange={(e) => setField('power', e.target.value as 'mains' | 'battery')}
              >
                <MenuItem value="mains">Mains</MenuItem>
                <MenuItem value="battery">Battery</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Sensors"
                fullWidth
                size="small"
                value={form.sensors}
                onChange={(e) => setField('sensors', e.target.value)}
                helperText="Comma-separated"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tags"
                fullWidth
                size="small"
                value={form.tags}
                onChange={(e) => setField('tags', e.target.value)}
                helperText="Comma-separated"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Notes"
                fullWidth
                size="small"
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add device
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
