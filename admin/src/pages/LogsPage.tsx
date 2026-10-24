import { useMemo, useState } from 'react'
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
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'

import { BeaconDetailSheet } from '../components/BeaconDetailSheet'
import { BeaconStatusChip } from '../components/BeaconStatusChip'
import {
  formatBeaconUptime,
  formatTime,
  type BeaconStatus,
  type DeviceBeacon,
} from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

const statuses: Array<BeaconStatus | 'all'> = ['all', 'ok', 'weak', 'missed']

export function LogsPage() {
  const { beacons, devices, deviceName } = useFleet()
  const [searchParams] = useSearchParams()
  const initialDevice = searchParams.get('device') ?? 'all'
  const [status, setStatus] = useState<BeaconStatus | 'all'>('all')
  const [deviceId, setDeviceId] = useState(
    devices.some((d) => d.id === initialDevice) ? initialDevice : 'all',
  )
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<DeviceBeacon | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...beacons]
      .sort((a, b) => b.at.localeCompare(a.at))
      .filter((b) => (status === 'all' ? true : b.status === status))
      .filter((b) => (deviceId === 'all' ? true : b.deviceId === deviceId))
      .filter((b) =>
        q
          ? deviceName(b.deviceId).toLowerCase().includes(q) ||
            b.deviceId.toLowerCase().includes(q) ||
            String(b.seq).includes(q) ||
            b.firmware.includes(q)
          : true,
      )
  }, [beacons, status, deviceId, query, deviceName])

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.75 }}>
          Logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Device beacon stream — click a row to open the detail sheet.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Search"
          placeholder="device, seq, firmware…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 220, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BeaconStatus | 'all')}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
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

      <Paper variant="outlined" sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Received</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Seq</TableCell>
              <TableCell align="right">RSSI</TableCell>
              <TableCell align="right">Uptime</TableCell>
              <TableCell align="right">Heap</TableCell>
              <TableCell align="right">Batt</TableCell>
              <TableCell>FW</TableCell>
              <TableCell align="right">Bytes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((b) => (
              <TableRow
                key={b.id}
                hover
                onClick={() => setSelected(b)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(b.at)}</TableCell>
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography
                    component={RouterLink}
                    to={`/devices/${b.deviceId}`}
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                    }}
                  >
                    {deviceName(b.deviceId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <BeaconStatusChip status={b.status} />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {b.seq}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {b.rssiDbm != null ? `${b.rssiDbm}` : '—'}
                </TableCell>
                <TableCell align="right">{formatBeaconUptime(b.uptimeSec)}</TableCell>
                <TableCell align="right">
                  {b.freeHeapKb != null ? `${b.freeHeapKb}K` : '—'}
                </TableCell>
                <TableCell align="right">
                  {b.batteryPct != null ? `${b.batteryPct}%` : '—'}
                </TableCell>
                <TableCell>v{b.firmware}</TableCell>
                <TableCell align="right">{b.payloadBytes || '—'}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4, textAlign: 'center' }}
                  >
                    No beacons match these filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <BeaconDetailSheet
        beacon={selected}
        deviceName={selected ? deviceName(selected.deviceId) : ''}
        onClose={() => setSelected(null)}
      />
    </Stack>
  )
}
