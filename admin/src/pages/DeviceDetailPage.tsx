import { useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom'

import { ChartPanel } from '../charts/ChartPanel'
import { RssiChart } from '../charts/RssiChart'
import { SingleDeviceClimateChart } from '../charts/TemperatureChart'
import { StatusChip } from '../components/StatusChip'
import { formatTime, formatUptime } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Box>
  )
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>
      {children}
    </Box>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.75, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="h6" component="div" sx={{ mt: 0.25, fontWeight: 600, fontSize: 18 }}>
        {value}
      </Typography>
      {hint ? (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      ) : null}
    </Paper>
  )
}

export function DeviceDetailPage() {
  const { deviceId = '' } = useParams()
  const navigate = useNavigate()
  const { getDevice, beaconsForDevice, readingsForDevice, removeDevice, settings } = useFleet()
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const device = getDevice(deviceId)

  if (!device) {
    return <Navigate to="/devices" replace />
  }

  const offline = device.status === 'offline'
  const allBeacons = beaconsForDevice(device.id)
  const allReadings = readingsForDevice(device.id)
  const latest = allReadings[0]

  function queueAction(message: string) {
    setToast(message)
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Button
          component={RouterLink}
          to="/devices"
          startIcon={<ArrowBackIcon />}
          size="small"
          sx={{ mb: 1.5, ml: -0.5 }}
        >
          Devices
        </Button>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'flex-start' }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h5" component="h1">
                {device.name}
              </Typography>
              <StatusChip status={device.status} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              <Mono>{device.id}</Mono>
              {' · '}
              {device.model}
              {' · '}
              {device.location}
            </Typography>
            {device.notes ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
                {device.notes}
              </Typography>
            ) : null}
          </Box>

          <Stack spacing={1} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ md: 'flex-end' }}>
              <ButtonGroup variant="outlined" disabled={offline}>
                <Button onClick={() => queueAction(`Ping queued · ${device.name}`)}>Ping</Button>
                <Button onClick={() => queueAction(`Reboot queued · ${device.name}`)}>
                  Reboot
                </Button>
                <Button onClick={() => queueAction(`OTA queued · ${device.name} → latest stable`)}>
                  Push OTA
                </Button>
              </ButtonGroup>
              <ButtonGroup variant="outlined">
                <Button component={RouterLink} to={`/logs?device=${device.id}`}>
                  Logs
                </Button>
                <Button component={RouterLink} to={`/history?device=${device.id}`}>
                  History
                </Button>
              </ButtonGroup>
              <Button
                variant="contained"
                color="error"
                onClick={() => setConfirmRemove(true)}
              >
                Remove
              </Button>
            </Stack>
            {offline ? (
              <Typography variant="caption" color="text.secondary">
                Commands disabled while offline
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(5, minmax(0, 1fr))',
          },
        }}
      >
        <Stat
          label="Latency"
          value={device.lastPingMs != null ? `${device.lastPingMs} ms` : 'timeout'}
          hint={device.avgPingMs != null ? `avg ${device.avgPingMs} ms` : undefined}
        />
        <Stat
          label="Wi‑Fi signal"
          value={device.rssiDbm != null ? `${device.rssiDbm} dBm` : '—'}
          hint={device.ssid}
        />
        <Stat
          label="Uptime"
          value={formatUptime(device.uptimeHours)}
          hint={`${device.rebootCount} reboots`}
        />
        <Stat label="Firmware" value={`v${device.firmware}`} hint={device.firmwareChannel} />
        <Stat
          label="Last seen"
          value={formatTime(device.lastSeenAt)}
          hint={
            latest
              ? `${latest.temperatureC.toFixed(1)} °C · ${latest.relativeHumidityPct.toFixed(0)} %RH`
              : 'No readings'
          }
        />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ChartPanel
            title="Climate"
            subtitle={`Temperature ${settings.temperatureUnit === 'f' ? '°F' : '°C'} and humidity`}
            action={
              <Button component={RouterLink} to={`/history?device=${device.id}`} size="small">
                All readings
              </Button>
            }
          >
            {allReadings.length > 1 ? (
              <SingleDeviceClimateChart
                readings={allReadings}
                temperatureUnit={settings.temperatureUnit}
                height={260}
              />
            ) : (
              <Box sx={{ px: 1.5, py: 4 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Not enough readings to chart yet.
                </Typography>
              </Box>
            )}
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <ChartPanel
            title="Wi‑Fi signal"
            subtitle="RSSI from recent heartbeats"
            action={
              <Button component={RouterLink} to={`/logs?device=${device.id}`} size="small">
                Logs
              </Button>
            }
          >
            {allBeacons.some((b) => b.rssiDbm != null) ? (
              <RssiChart beacons={allBeacons} height={260} />
            ) : (
              <Box sx={{ px: 1.5, py: 4 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No signal samples for this device.
                </Typography>
              </Box>
            )}
          </ChartPanel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Network
            </Typography>
            <Fact label="IP address" value={<Mono>{device.ip}</Mono>} />
            <Fact label="MAC" value={<Mono>{device.mac}</Mono>} />
            <Fact label="SSID" value={device.ssid} />
            <Fact
              label="Packet loss"
              value={`${device.packetLossPct.toFixed(1)}%`}
            />
            <Fact label="Ingest path" value={<Mono>{device.mqttTopic}</Mono>} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Hardware
            </Typography>
            <Fact label="Model" value={device.model} />
            <Fact label="Chip revision" value={device.chipRevision} />
            <Fact label="Flash" value={`${device.flashMb} MB`} />
            <Fact
              label="Free heap"
              value={device.freeHeapKb != null ? `${device.freeHeapKb} KB` : '—'}
            />
            <Fact
              label="CPU temperature"
              value={device.cpuTempC != null ? `${device.cpuTempC.toFixed(1)} °C` : '—'}
            />
            <Fact label="Sensors" value={device.sensors.join(', ') || '—'} />
            <Fact label="Last boot" value={formatTime(device.lastBootAt)} />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}>
        <DialogTitle>Remove device?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove <strong>{device.name}</strong> ({device.id}) from the fleet. Related demo
            session data for this device will be dropped.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              removeDevice(device.id)
              navigate('/devices')
            }}
          >
            Remove device
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  )
}
