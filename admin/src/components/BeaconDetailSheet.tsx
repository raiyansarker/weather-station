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

import { BeaconStatusChip } from './BeaconStatusChip'
import {
  formatBeaconUptime,
  formatTime,
  type DeviceBeacon,
} from '../data/demo'

type Props = {
  beacon: DeviceBeacon | null
  deviceName: string
  onClose: () => void
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={3}
      sx={{ py: 1 }}
    >
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

function buildPayload(beacon: DeviceBeacon) {
  return {
    id: beacon.id,
    device_id: beacon.deviceId,
    seq: beacon.seq,
    status: beacon.status,
    received_at: beacon.at,
    rssi_dbm: beacon.rssiDbm,
    uptime_sec: beacon.uptimeSec,
    free_heap_kb: beacon.freeHeapKb,
    battery_pct: beacon.batteryPct,
    firmware: beacon.firmware,
    interval_sec: beacon.intervalSec,
    payload_bytes: beacon.payloadBytes,
  }
}

export function BeaconDetailSheet({ beacon, deviceName, onClose }: Props) {
  const open = beacon != null
  const payload = beacon ? buildPayload(beacon) : null

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
      {beacon && payload && (
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
            <Stack spacing={1} sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ fontSize: 18 }}>
                Beacon {beacon.id}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <BeaconStatusChip status={beacon.status} />
                <Typography variant="body2" color="text.secondary">
                  seq {beacon.seq} · {formatTime(beacon.at)}
                </Typography>
              </Stack>
            </Stack>
            <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ mt: -0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            <Stack spacing={0.25} sx={{ mb: 2.5 }}>
              <Row
                label="Device"
                value={
                  <Typography
                    component={RouterLink}
                    to={`/devices/${beacon.deviceId}`}
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
              <Row label="Device ID" value={<Mono>{beacon.deviceId}</Mono>} />
              <Row label="Received" value={new Date(beacon.at).toISOString()} />
              <Row label="Sequence" value={beacon.seq} />
              <Row
                label="RSSI"
                value={beacon.rssiDbm != null ? `${beacon.rssiDbm} dBm` : '—'}
              />
              <Row label="Uptime" value={formatBeaconUptime(beacon.uptimeSec)} />
              <Row
                label="Free heap"
                value={beacon.freeHeapKb != null ? `${beacon.freeHeapKb} KB` : '—'}
              />
              <Row
                label="Battery"
                value={beacon.batteryPct != null ? `${beacon.batteryPct}%` : '—'}
              />
              <Row label="Firmware" value={`v${beacon.firmware}`} />
              <Row label="Expected interval" value={`${beacon.intervalSec}s`} />
              <Row label="Payload size" value={`${beacon.payloadBytes} bytes`} />
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
              to={`/devices/${beacon.deviceId}`}
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
