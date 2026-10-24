import { useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom'

import { BeaconStatusChip } from '../components/BeaconStatusChip'
import { StatusChip } from '../components/StatusChip'
import { formatBeaconUptime, formatTime, formatUptime } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" textAlign="right">
        {value}
      </Typography>
    </Stack>
  )
}

function Mono({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>
      {children}
    </Box>
  )
}

export function DeviceDetailPage() {
  const { deviceId = '' } = useParams()
  const navigate = useNavigate()
  const { getDevice, beaconsForDevice, readingsForDevice, removeDevice } = useFleet()
  const [confirmRemove, setConfirmRemove] = useState(false)
  const device = getDevice(deviceId)

  if (!device) {
    return <Navigate to="/devices" replace />
  }

  const beacons = beaconsForDevice(device.id).slice(0, 8)
  const readings = readingsForDevice(device.id).slice(0, 6)

  return (
    <Stack spacing={3}>
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
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h5" component="h1">
                {device.name}
              </Typography>
              <StatusChip status={device.status} />
              {device.tags.map((t) => (
                <Chip key={t} size="small" label={t} variant="outlined" />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <Mono>{device.id}</Mono> · {device.model} · {device.location}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" size="small" disabled>
              Ping now
            </Button>
            <Button variant="outlined" size="small" disabled>
              Reboot
            </Button>
            <Button variant="contained" size="small" disabled>
              Push OTA
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setConfirmRemove(true)}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Connectivity
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow label="IP" value={<Mono>{device.ip}</Mono>} />
            <InfoRow label="MAC" value={<Mono>{device.mac}</Mono>} />
            <InfoRow label="SSID" value={device.ssid} />
            <InfoRow
              label="RSSI"
              value={device.rssiDbm != null ? `${device.rssiDbm} dBm` : '—'}
            />
            <InfoRow
              label="Last ping"
              value={device.lastPingMs != null ? `${device.lastPingMs} ms` : 'timeout'}
            />
            <InfoRow
              label="Avg ping"
              value={device.avgPingMs != null ? `${device.avgPingMs} ms` : '—'}
            />
            <InfoRow label="Packet loss" value={`${device.packetLossPct.toFixed(1)}%`} />
            <InfoRow label="Topic" value={<Mono>{device.mqttTopic}</Mono>} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Hardware
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow label="Model" value={device.model} />
            <InfoRow label="Chip rev" value={device.chipRevision} />
            <InfoRow label="Flash" value={`${device.flashMb} MB`} />
            <InfoRow
              label="Free heap"
              value={device.freeHeapKb != null ? `${device.freeHeapKb} KB` : '—'}
            />
            <InfoRow
              label="CPU temp"
              value={device.cpuTempC != null ? `${device.cpuTempC.toFixed(1)} °C` : '—'}
            />
            <InfoRow
              label="Power"
              value={
                device.power === 'battery' ? `Battery ${device.batteryPct ?? '?'}%` : 'Mains'
              }
            />
            <InfoRow label="Sensors" value={device.sensors.join(', ') || '—'} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              Runtime
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <InfoRow
              label="Firmware"
              value={`v${device.firmware} (${device.firmwareChannel})`}
            />
            <InfoRow label="Uptime" value={formatUptime(device.uptimeHours)} />
            <InfoRow label="Reboots" value={device.rebootCount} />
            <InfoRow label="Last seen" value={formatTime(device.lastSeenAt)} />
            <InfoRow label="Last boot" value={formatTime(device.lastBootAt)} />
            <Box sx={{ pt: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2">{device.notes}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1">Recent readings</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">°C</TableCell>
                  <TableCell align="right">RH%</TableCell>
                  <TableCell align="right">hPa</TableCell>
                  <TableCell align="right">Light</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {readings.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{formatTime(r.recordedAt)}</TableCell>
                    <TableCell align="right">{r.temperatureC.toFixed(1)}</TableCell>
                    <TableCell align="right">{r.relativeHumidityPct.toFixed(1)}</TableCell>
                    <TableCell align="right">{r.pressureHpa.toFixed(1)}</TableCell>
                    <TableCell align="right">{r.lightLevel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1">Beacons</Typography>
              <Button component={RouterLink} to={`/logs?device=${device.id}`} size="small">
                View all
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Seq</TableCell>
                  <TableCell align="right">RSSI</TableCell>
                  <TableCell align="right">Uptime</TableCell>
                  <TableCell align="right">Heap</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beacons.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(b.at)}</TableCell>
                    <TableCell>
                      <BeaconStatusChip status={b.status} />
                    </TableCell>
                    <TableCell align="right">{b.seq}</TableCell>
                    <TableCell align="right">
                      {b.rssiDbm != null ? `${b.rssiDbm}` : '—'}
                    </TableCell>
                    <TableCell align="right">{formatBeaconUptime(b.uptimeSec)}</TableCell>
                    <TableCell align="right">
                      {b.freeHeapKb != null ? `${b.freeHeapKb}K` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}>
        <DialogTitle>Remove device?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove <strong>{device.name}</strong> ({device.id}) from the fleet. Beacons and
            alerts for this device will be dropped from the demo session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              removeDevice(device.id)
              navigate('/devices')
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
