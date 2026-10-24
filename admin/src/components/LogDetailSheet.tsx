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

import { LogLevelChip } from './LogLevelChip'
import { formatTime } from '../data/demo'
import type { FleetLog } from '../data/logs'

type Props = {
  log: FleetLog | null
  deviceName: string
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

export function LogDetailSheet({ log, deviceName, onClose }: Props) {
  const open = log != null
  const payload = log
    ? {
        id: log.id,
        timestamp: log.at,
        level: log.level,
        source: log.source,
        message: log.message,
        device_id: log.deviceId,
        http:
          log.method || log.path || log.statusCode
            ? {
                method: log.method,
                path: log.path,
                status: log.statusCode,
                duration_ms: log.durationMs,
                request_id: log.requestId,
                remote_ip: log.remoteIp,
                bytes_in: log.bytesIn,
                bytes_out: log.bytesOut,
              }
            : undefined,
        fields: log.fields,
      }
    : null

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 460 },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 0, sm: '12px 0 0 12px' },
        },
      }}
    >
      {log && payload && (
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
                {log.message}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <LogLevelChip level={log.level} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {log.source}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(log.at)}
                </Typography>
              </Stack>
            </Stack>
            <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ mt: -0.25 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            <Stack spacing={0.25} sx={{ mb: 2.5 }}>
              <Row label="Log ID" value={<Mono>{log.id}</Mono>} />
              <Row label="Timestamp" value={new Date(log.at).toISOString()} />
              <Row label="Source" value={log.source} />
              {log.deviceId ? (
                <Row
                  label="Device"
                  value={
                    <Typography
                      component={RouterLink}
                      to={`/devices/${log.deviceId}`}
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
              ) : (
                <Row label="Device" value="—" />
              )}
              {log.method ? (
                <Row
                  label="HTTP"
                  value={
                    <Mono>
                      {log.method} {log.path} → {log.statusCode}
                    </Mono>
                  }
                />
              ) : null}
              {log.durationMs != null ? <Row label="Duration" value={`${log.durationMs} ms`} /> : null}
              {log.requestId ? <Row label="Request ID" value={<Mono>{log.requestId}</Mono>} /> : null}
              {log.remoteIp ? <Row label="Remote IP" value={<Mono>{log.remoteIp}</Mono>} /> : null}
              {log.bytesIn != null ? <Row label="Bytes in" value={log.bytesIn} /> : null}
              {log.bytesOut != null ? <Row label="Bytes out" value={log.bytesOut} /> : null}
            </Stack>

            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Raw event
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
            {log.deviceId ? (
              <Button
                component={RouterLink}
                to={`/devices/${log.deviceId}`}
                onClick={onClose}
                variant="outlined"
              >
                Open device
              </Button>
            ) : null}
            <Button variant="contained" onClick={onClose}>
              Done
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  )
}
