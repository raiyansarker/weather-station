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

import { ChartPanel } from '../charts/ChartPanel'
import { TemperatureChart } from '../charts/TemperatureChart'
import { ReadingDetailSheet } from '../components/ReadingDetailSheet'
import { formatTime, type WeatherReading } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

const PAGE_SIZE_OPTIONS = [25, 50, 100]
const CHART_DEVICE_IDS = ['esp32-roof-01', 'esp32-garden-02', 'esp32-shed-03']

export function HistoryPage() {
  const { historyReadings, liveReadings, devices, deviceName, settings } = useFleet()
  const [searchParams] = useSearchParams()
  const initialDevice = searchParams.get('device') ?? 'all'
  const [deviceId, setDeviceId] = useState(
    devices.some((d) => d.id === initialDevice) ? initialDevice : 'all',
  )
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [selected, setSelected] = useState<WeatherReading | null>(null)

  const tempLabel = settings.temperatureUnit === 'f' ? 'Temp °F' : 'Temp °C'
  const pressureLabel = settings.pressureUnit === 'inhg' ? 'Pressure inHg' : 'Pressure hPa'

  const allReadings = useMemo(
    () => [...liveReadings, ...historyReadings],
    [liveReadings, historyReadings],
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...allReadings]
      .filter((r) => (deviceId === 'all' ? true : r.deviceId === deviceId))
      .filter((r) => {
        if (!q) return true
        const hay = [
          r.id,
          r.deviceId,
          deviceName(r.deviceId),
          String(r.temperatureC),
          String(r.relativeHumidityPct),
          String(r.pressureHpa),
          String(r.lightLevel),
        ]
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
  }, [allReadings, deviceId, query, deviceName])

  const chartReadings = useMemo(() => {
    if (deviceId === 'all') return allReadings
    return allReadings.filter((r) => r.deviceId === deviceId)
  }, [allReadings, deviceId])

  const chartDeviceIds = useMemo(() => {
    if (deviceId !== 'all') return [deviceId]
    return CHART_DEVICE_IDS
  }, [deviceId])

  useEffect(() => {
    setPage(0)
  }, [deviceId, query, rowsPerPage])

  const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  function displayTemp(c: number): string {
    if (settings.temperatureUnit === 'f') return ((c * 9) / 5 + 32).toFixed(1)
    return c.toFixed(1)
  }

  function displayPressure(hpa: number): string {
    if (settings.pressureUnit === 'inhg') return (hpa * 0.02953).toFixed(2)
    return hpa.toFixed(1)
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.75 }}>
          History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ingested weather readings — temperature, humidity, pressure, and light. Click a row for
          the raw payload.
        </Typography>
      </Box>

      <ChartPanel
        title="Temperature"
        subtitle={
          deviceId === 'all'
            ? `Last 12 hours · ${settings.temperatureUnit === 'f' ? '°F' : '°C'}`
            : `${deviceName(deviceId)} · ${settings.temperatureUnit === 'f' ? '°F' : '°C'}`
        }
      >
        <TemperatureChart
          readings={chartReadings}
          deviceIds={chartDeviceIds}
          deviceLabel={deviceName}
          temperatureUnit={settings.temperatureUnit}
          height={260}
        />
      </ChartPanel>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          label="Search"
          placeholder="reading id, device, value…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ minWidth: 220, flex: 1 }}
        />
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
                <TableCell>Recorded</TableCell>
                <TableCell>Device</TableCell>
                <TableCell align="right">{tempLabel}</TableCell>
                <TableCell align="right">Humidity %RH</TableCell>
                <TableCell align="right">{pressureLabel}</TableCell>
                <TableCell align="right">Light lux</TableCell>
                <TableCell>Reading ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  onClick={() => setSelected(r)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(r.recordedAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Typography
                      component={RouterLink}
                      to={`/devices/${r.deviceId}`}
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'underline',
                        textUnderlineOffset: 2,
                      }}
                    >
                      {deviceName(r.deviceId)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{displayTemp(r.temperatureC)}</TableCell>
                  <TableCell align="right">{r.relativeHumidityPct.toFixed(1)}</TableCell>
                  <TableCell align="right">{displayPressure(r.pressureHpa)}</TableCell>
                  <TableCell align="right">{r.lightLevel}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {r.id}
                    </Typography>
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
                      No readings match these filters.
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

      <ReadingDetailSheet
        reading={selected}
        deviceName={selected ? deviceName(selected.deviceId) : ''}
        temperatureUnit={settings.temperatureUnit}
        pressureUnit={settings.pressureUnit}
        onClose={() => setSelected(null)}
      />
    </Stack>
  )
}
