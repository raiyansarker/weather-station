import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

import { formatTime } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

export function HistoryPage() {
  const { historyReadings, deviceName, settings } = useFleet()
  const tempLabel = settings.temperatureUnit === 'f' ? 'Temp °F' : 'Temp °C'
  const pressureLabel = settings.pressureUnit === 'inhg' ? 'Pressure inHg' : 'Pressure hPa'

  function displayTemp(c: number): string {
    if (settings.temperatureUnit === 'f') return ((c * 9) / 5 + 32).toFixed(1)
    return c.toFixed(1)
  }

  function displayPressure(hpa: number): string {
    if (settings.pressureUnit === 'inhg') return (hpa * 0.02953).toFixed(2)
    return hpa.toFixed(1)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" component="h1" gutterBottom>
          History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Recent telemetry samples across the fleet.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Recorded</TableCell>
              <TableCell>Device</TableCell>
              <TableCell align="right">{tempLabel}</TableCell>
              <TableCell align="right">Humidity %</TableCell>
              <TableCell align="right">{pressureLabel}</TableCell>
              <TableCell align="right">Light</TableCell>
              <TableCell>Reading ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...historyReadings]
              .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
              .map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{formatTime(r.recordedAt)}</TableCell>
                  <TableCell>
                    <Typography
                      component={RouterLink}
                      to={`/devices/${r.deviceId}`}
                      variant="body2"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
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
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}
