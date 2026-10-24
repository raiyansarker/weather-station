import { useState, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DownloadIcon from '@mui/icons-material/Download'

import {
  buildDeviceConfigYaml,
  copyText,
  downloadTextFile,
  generateEd25519KeyPair,
  type TelemetryGroup,
} from '../deviceConfig'
import { useFleet, type NewDeviceInput } from '../fleet/FleetContext'

const emptyForm = (defaultSsid: string): Omit<NewDeviceInput, 'publicKeySpkiB64'> => ({
  id: '',
  name: '',
  location: '',
  ssid: defaultSsid,
})

type Props = {
  open: boolean
  onClose: () => void
  onAdded?: (deviceId: string) => void
}

type Step = 'form' | 'config'

function TelemetryGroupRow({
  title,
  description,
  group,
  onChange,
}: {
  title: string
  description: string
  group: TelemetryGroup
  onChange: (next: TelemetryGroup) => void
}) {
  return (
    <Box
      sx={{
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
            <Typography variant="body2" fontWeight={600}>
              {title}
            </Typography>
            <Switch
              size="small"
              checked={group.enabled}
              onChange={(e) => onChange({ ...group, enabled: e.target.checked })}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block">
            {description}
          </Typography>
        </Box>
        <TextField
          label="Every (sec)"
          type="number"
          size="small"
          disabled={!group.enabled}
          value={group.intervalSec}
          onChange={(e) =>
            onChange({ ...group, intervalSec: Number(e.target.value) || 60 })
          }
          inputProps={{ min: 5, max: 3600 }}
          sx={{ width: 112, flexShrink: 0 }}
        />
      </Stack>
    </Box>
  )
}

export function AddDeviceSheet({ open, onClose, onAdded }: Props) {
  const { addDevice, settings } = useFleet()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState(() => emptyForm(settings.defaultSsid))
  const [wifiPassword, setWifiPassword] = useState('')
  const [sensorGroup, setSensorGroup] = useState<TelemetryGroup>({
    enabled: true,
    intervalSec: 60,
  })
  const [internalGroup, setInternalGroup] = useState<TelemetryGroup>({
    enabled: true,
    intervalSec: 60,
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [configYaml, setConfigYaml] = useState('')
  const [configFilename, setConfigFilename] = useState('config.yaml')
  const [provisionedId, setProvisionedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetAll() {
    setStep('form')
    setError(null)
    setSubmitting(false)
    setForm(emptyForm(settings.defaultSsid))
    setWifiPassword('')
    setSensorGroup({ enabled: true, intervalSec: 60 })
    setInternalGroup({ enabled: true, intervalSec: 60 })
    setConfigYaml('')
    setConfigFilename('config.yaml')
    setProvisionedId(null)
    setCopied(false)
  }

  function finish() {
    const id = provisionedId
    resetAll()
    onClose()
    if (id) onAdded?.(id)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!wifiPassword.trim()) {
      setError('Wi‑Fi password is required for the device config.')
      return
    }
    if (!sensorGroup.enabled && !internalGroup.enabled) {
      setError('Enable device sensors or internal device telemetry.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const keys = await generateEd25519KeyPair()
      const input: NewDeviceInput = {
        ...form,
        publicKeySpkiB64: keys.publicKeySpkiB64,
      }
      const result = addDevice(input)
      if (!result.ok) {
        setError(result.error)
        return
      }

      const id = form.id.trim()
      const built = buildDeviceConfigYaml(form, settings, {
        wifiPassword: wifiPassword.trim(),
        sensors: sensorGroup,
        internal: internalGroup,
        privateKeyPkcs8B64: keys.privateKeyPkcs8B64,
      })
      setProvisionedId(id)
      setConfigYaml(built.yaml)
      setConfigFilename(built.filename)
      setStep('config')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not generate Ed25519 keys in this browser.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCopy() {
    const ok = await copyText(configYaml)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={finish}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: step === 'config' ? 520 : 460 },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 0, sm: '12px 0 0 12px' },
        },
      }}
    >
      {step === 'form' ? (
        <Box
          component="form"
          onSubmit={(e) => void handleSubmit(e)}
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ fontSize: 18 }}>
                Add device
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creates the node and a YAML config with an Ed25519 private key.
              </Typography>
            </Stack>
            <IconButton aria-label="Close" onClick={finish} size="small" sx={{ mt: -0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                label="Device ID"
                required
                fullWidth
                size="small"
                placeholder="esp32-patio-05"
                value={form.id}
                onChange={(e) => setField('id', e.target.value)}
              />
              <TextField
                label="Display name"
                required
                fullWidth
                size="small"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              <TextField
                label="Location"
                fullWidth
                size="small"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
              />

              <Divider />

              <Typography variant="subtitle2">Wi‑Fi</Typography>
              <TextField
                label="SSID"
                fullWidth
                size="small"
                value={form.ssid}
                onChange={(e) => setField('ssid', e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                size="small"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />

              <Divider />

              <Typography variant="subtitle2">Telemetry</Typography>
              <Box>
                <TelemetryGroupRow
                  title="Device sensors"
                  description="Sensor readings from the node"
                  group={sensorGroup}
                  onChange={setSensorGroup}
                />
                <TelemetryGroupRow
                  title="Internal device telemetry"
                  description="Wi‑Fi, ping, and node health"
                  group={internalGroup}
                  onChange={setInternalGroup}
                />
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              px: 2.5,
              py: 1.75,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fafafa',
            }}
          >
            <Button onClick={finish} variant="outlined" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Generating keys…' : 'Create & show config'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ fontSize: 18 }}>
                Device config
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download or copy this YAML. The Ed25519 private key is inside the file only.
              </Typography>
            </Stack>
            <IconButton aria-label="Close" onClick={finish} size="small" sx={{ mt: -0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {configFilename}
            </Typography>
            <Typography
              component="pre"
              variant="body2"
              sx={{
                m: 0,
                p: 1.75,
                borderRadius: 1,
                bgcolor: '#111',
                color: '#e8e8e8',
                border: '1px solid',
                borderColor: 'divider',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                lineHeight: 1.5,
                overflow: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {configYaml}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 2.5,
              py: 1.75,
              display: 'flex',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: '#fafafa',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => void handleCopy()}
            >
              {copied ? 'Copied' : 'Copy YAML'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => downloadTextFile(configFilename, configYaml)}
            >
              Download
            </Button>
            <Button variant="contained" onClick={finish}>
              Done
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}
