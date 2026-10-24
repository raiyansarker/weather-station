import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'

import { LogDetailSheet } from '../components/LogDetailSheet'
import { LogLevelChip } from '../components/LogLevelChip'
import { formatTime } from '../data/demo'
import { fleetLogs, type FleetLog, type LogLevel, type LogSource } from '../data/logs'
import { useFleet } from '../fleet/FleetContext'

const levels: Array<LogLevel | 'all'> = ['all', 'error', 'warn', 'info', 'debug']
const sources: Array<LogSource | 'all'> = [
  'all',
  'ingest',
  'api',
  'device',
  'wifi',
  'ota',
  'auth',
]

const PAGE_SIZE_OPTIONS = [25, 50, 100]

function httpLabel(log: FleetLog): string {
  if (!log.method && log.statusCode == null) return '—'
  const left = [log.method, log.path].filter(Boolean).join(' ')
  return log.statusCode != null ? `${left} · ${log.statusCode}` : left
}

export function LogsPage() {
  const { devices, deviceName } = useFleet()
  const [searchParams] = useSearchParams()
  const initialDevice = searchParams.get('device') ?? 'all'
  const [level, setLevel] = useState<LogLevel | 'all'>('all')
  const [source, setSource] = useState<LogSource | 'all'>('all')
  const [deviceId, setDeviceId] = useState(
    devices.some((d) => d.id === initialDevice) ? initialDevice : 'all',
  )
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [selected, setSelected] = useState<FleetLog | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return fleetLogs.filter((log) => {
      if (level !== 'all' && log.level !== level) return false
      if (source !== 'all' && log.source !== source) return false
      if (deviceId !== 'all' && log.deviceId !== deviceId) return false
      if (!q) return true
      const hay = [
        log.message,
        log.id,
        log.source,
        log.level,
        log.deviceId ?? '',
        log.deviceId ? deviceName(log.deviceId) : '',
        log.method ?? '',
        log.path ?? '',
        log.requestId ?? '',
        log.remoteIp ?? '',
        String(log.statusCode ?? ''),
        JSON.stringify(log.fields ?? {}),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [level, source, deviceId, query, deviceName])

  useEffect(() => {
    setPage(0)
  }, [level, source, deviceId, query, rowsPerPage])

  const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.75 }}>
          Logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          API ingest, device, Wi‑Fi, and OTA events from the fleet — click a row for full detail.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Search"
          placeholder="message, path, request id, IP…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 220, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Level</InputLabel>
          <Select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value as LogLevel | 'all')}
          >
            {levels.map((l) => (
              <MenuItem key={l} value={l}>
                {l === 'all' ? 'All levels' : l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Source</InputLabel>
          <Select
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value as LogSource | 'all')}
          >
            {sources.map((s) => (
              <MenuItem key={s} value={s}>
                {s === 'all' ? 'All sources' : s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Device</InputLabel>
          <Select label="Device" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            <MenuItem value="all">All devices</MenuItem>
            {devices.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Box sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>HTTP</TableCell>
                <TableCell align="right">Latency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((log) => (
                <TableRow
                  key={log.id}
                  hover
                  onClick={() => setSelected(log)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(log.at)}</TableCell>
                  <TableCell>
                    <LogLevelChip level={log.level} />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                      }}
                    >
                      {log.source}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {log.deviceId ? (
                      <Typography
                        component={RouterLink}
                        to={`/devices/${log.deviceId}`}
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          textDecoration: 'underline',
                          textUnderlineOffset: 2,
                        }}
                      >
                        {deviceName(log.deviceId)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography variant="body2" noWrap title={log.message}>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      title={httpLabel(log)}
                      sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
                    >
                      {httpLabel(log)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {log.durationMs != null ? `${log.durationMs} ms` : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 4, textAlign: 'center' }}
                    >
                      No logs match these filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_e, next) => setPage(next)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        />
      </Paper>

      <LogDetailSheet
        log={selected}
        deviceName={selected?.deviceId ? deviceName(selected.deviceId) : ''}
        onClose={() => setSelected(null)}
      />
    </Stack>
  )
}
