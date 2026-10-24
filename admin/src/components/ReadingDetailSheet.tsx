import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { Link as RouterLink } from 'react-router-dom'

import { formatTime, type WeatherReading } from '../data/demo'

type Props = {
  reading: WeatherReading | null
  deviceName: string
  temperatureUnit: 'c' | 'f'
  pressureUnit: 'hpa' | 'inhg'
  onClose: () => void
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={3} sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Stack>
  )
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
      {children}
    </Typography>
  )
}

function displayTemp(c: number, unit: 'c' | 'f'): string {
  if (unit === 'f') return `${((c * 9) / 5 + 32).toFixed(1)} °F`
  return `${c.toFixed(1)} °C`
}

function displayPressure(hpa: number, unit: 'hpa' | 'inhg'): string {
  if (unit === 'inhg') return `${(hpa * 0.02953).toFixed(2)} inHg`
  return `${hpa.toFixed(1)} hPa`
}

export function ReadingDetailSheet({
  reading,
  deviceName,
  temperatureUnit,
  pressureUnit,
  onClose,
}: Props) {
  const open = reading != null
  const payload = reading
    ? {
        id: reading.id,
        device_id: reading.deviceId,
        recorded_at: reading.recordedAt,
        temperature_c: reading.temperatureC,
        relative_humidity_pct: reading.relativeHumidityPct,
        pressure_hpa: reading.pressureHpa,
        illuminance_lux: reading.lightLevel,
      }
    : null

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 440 },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 0, sm: '12px 0 0 12px' },
        },
      }}
    >
      {reading && payload && (
        <>
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
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ fontSize: 18 }}>
                Reading {reading.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(reading.recordedAt)} · {deviceName}
              </Typography>
            </Stack>
            <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ mt: -0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            <Stack spacing={0.25} sx={{ mb: 2.5 }}>
              <Row label="Reading ID" value={<Mono>{reading.id}</Mono>} />
              <Row label="Recorded" value={new Date(reading.recordedAt).toISOString()} />
              <Row
                label="Device"
                value={
                  <Typography
                    component={RouterLink}
                    to={`/devices/${reading.deviceId}`}
                    variant="body2"
                    onClick={onClose}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                    }}
                  >
                    {deviceName}
                  </Typography>
                }
              />
              <Row label="Device ID" value={<Mono>{reading.deviceId}</Mono>} />
              <Row label="Temperature" value={displayTemp(reading.temperatureC, temperatureUnit)} />
              <Row label="Humidity" value={`${reading.relativeHumidityPct.toFixed(1)} %RH`} />
              <Row
                label="Pressure"
                value={displayPressure(reading.pressureHpa, pressureUnit)}
              />
              <Row label="Illuminance" value={`${reading.lightLevel} lux`} />
            </Stack>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Raw payload
            </Typography>
            <Typography
              component="pre"
              variant="body2"
              sx={{
                m: 0,
                p: 1.5,
                borderRadius: 1,
                bgcolor: '#f6f6f6',
                border: '1px solid',
                borderColor: 'divider',
                fontFamily: 'ui-monospace, monospace',
                fontSize: 12,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {JSON.stringify(payload, null, 2)}
            </Typography>
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
            <Button
              component={RouterLink}
              to={`/devices/${reading.deviceId}`}
              onClick={onClose}
              variant="outlined"
            >
              Open device
            </Button>
            <Button variant="contained" onClick={onClose}>
              Done
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  )
}
