import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { AddDeviceDialog } from '../components/AddDeviceDialog'
import { StatusChip } from '../components/StatusChip'
import { formatTime, formatUptime } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

export function DevicesPage() {
  const { devices, settings } = useFleet()
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <Stack spacing={2.5}>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 0.75 }}
        >
          <Typography variant="h5" component="h1">
            Devices
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add device
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          ESP32 fleet — provision nodes, open a row for hardware and beacons.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ping</TableCell>
              <TableCell align="right">RSSI</TableCell>
              <TableCell align="right">Loss</TableCell>
              <TableCell>Power</TableCell>
              <TableCell>Uptime</TableCell>
              <TableCell>Firmware</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((d) => {
              const highPing =
                settings.highlightHighPing &&
                d.lastPingMs != null &&
                d.lastPingMs > settings.highPingMs
              return (
                <TableRow
                  key={d.id}
                  hover
                  component={RouterLink}
                  to={`/devices/${d.id}`}
                  sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {d.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {d.id} · {d.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={d.status} />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: highPing ? 'error.main' : 'inherit',
                      fontWeight: highPing ? 600 : 400,
                    }}
                  >
                    {d.lastPingMs != null ? `${d.lastPingMs} ms` : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {d.rssiDbm != null ? `${d.rssiDbm}` : '—'}
                  </TableCell>
                  <TableCell align="right">{d.packetLossPct.toFixed(1)}%</TableCell>
                  <TableCell>
                    {d.power === 'battery' ? `Batt ${d.batteryPct}%` : 'Mains'}
                  </TableCell>
                  <TableCell>{formatUptime(d.uptimeHours)}</TableCell>
                  <TableCell>
                    v{d.firmware}
                    {d.firmwareChannel === 'beta' ? ' β' : ''}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {d.tags.map((t) => (
                        <Chip key={t} size="small" label={t} variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="caption" color="text.secondary">
        {devices.length} registered
        {devices[0] ? ` · newest fleet check ${formatTime(devices[0].lastSeenAt)}` : null}
      </Typography>

      <AddDeviceDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdded={(id) => {
          setToast(`Added ${id}`)
          navigate(`/devices/${id}`)
        }}
      />

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
