import { useMemo, useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HistoryIcon from '@mui/icons-material/History'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import NetworkPingIcon from '@mui/icons-material/NetworkPing'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { AddDeviceSheet } from '../components/AddDeviceSheet'
import { StatusChip } from '../components/StatusChip'
import { formatTime, formatUptime, type Device, type DeviceStatus } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

const statuses: Array<DeviceStatus | 'all'> = ['all', 'online', 'degraded', 'offline']

export function DevicesPage() {
  const { devices, settings, removeDevice } = useFleet()
  const navigate = useNavigate()
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<DeviceStatus | 'all'>('all')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuDevice, setMenuDevice] = useState<Device | null>(null)
  const [removeTarget, setRemoveTarget] = useState<Device | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return devices.filter((d) => {
      if (status !== 'all' && d.status !== status) return false
      if (!q) return true
      const hay = [d.name, d.id, d.location, d.model, d.firmware, d.ip, ...d.tags]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [devices, query, status])

  function openMenu(event: MouseEvent<HTMLElement>, device: Device) {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
    setMenuDevice(device)
  }

  function closeMenu() {
    setMenuAnchor(null)
    setMenuDevice(null)
  }

  function runAction(label: string) {
    if (!menuDevice) return
    const name = menuDevice.name
    closeMenu()
    setToast(`${label} · ${name}`)
  }

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
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add device
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Fleet nodes — open a device for hardware detail, or use row actions.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Search"
          placeholder="name, id, location, IP…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 220, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as DeviceStatus | 'all')}
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
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
                <TableCell>Device</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last seen</TableCell>
                <TableCell align="right">Latency</TableCell>
                <TableCell align="right">RSSI</TableCell>
                <TableCell>Firmware</TableCell>
                <TableCell align="right" sx={{ width: 56 }}>
                  {/* actions */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((d) => {
                const highPing =
                  settings.highlightHighPing &&
                  d.lastPingMs != null &&
                  d.lastPingMs > settings.highPingMs
                return (
                  <TableRow
                    key={d.id}
                    hover
                    onClick={() => navigate(`/devices/${d.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ minWidth: 200 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {d.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontFamily: 'ui-monospace, monospace' }}
                      >
                        {d.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {d.model} · {d.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={d.status} />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">{formatTime(d.lastSeenAt)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        up {formatUptime(d.uptimeHours)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: highPing ? 'error.main' : 'inherit',
                        fontWeight: highPing ? 600 : 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.lastPingMs != null ? `${d.lastPingMs} ms` : 'timeout'}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {d.rssiDbm != null ? `${d.rssiDbm} dBm` : '—'}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">v{d.firmware}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d.firmwareChannel}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        aria-label={`Actions for ${d.name}`}
                        onClick={(e) => openMenu(e, d)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 4, textAlign: 'center' }}
                    >
                      No devices match these filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary">
        {rows.length} of {devices.length} devices
      </Typography>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            const id = menuDevice?.id
            closeMenu()
            if (id) navigate(`/devices/${id}`)
          }}
        >
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={menuDevice ? `/logs?device=${menuDevice.id}` : '/logs'}
          onClick={closeMenu}
        >
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View logs</ListItemText>
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={menuDevice ? `/history?device=${menuDevice.id}` : '/history'}
          onClick={closeMenu}
        >
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View history</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={menuDevice?.status === 'offline'}
          onClick={() => runAction('Ping queued')}
        >
          <ListItemIcon>
            <NetworkPingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ping now</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={menuDevice?.status === 'offline'}
          onClick={() => runAction('Reboot queued')}
        >
          <ListItemIcon>
            <RestartAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reboot</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const target = menuDevice
            closeMenu()
            if (target) setRemoveTarget(target)
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(removeTarget)} onClose={() => setRemoveTarget(null)}>
        <DialogTitle>Remove device?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove <strong>{removeTarget?.name}</strong> ({removeTarget?.id}) from the fleet.
            Beacons and alerts for this device will be dropped from the demo session.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveTarget(null)} variant="outlined">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (!removeTarget) return
              removeDevice(removeTarget.id)
              setToast(`Removed ${removeTarget.name}`)
              setRemoveTarget(null)
            }}
          >
            Remove device
          </Button>
        </DialogActions>
      </Dialog>

      <AddDeviceSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
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
