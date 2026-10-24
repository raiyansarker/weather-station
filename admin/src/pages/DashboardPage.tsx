import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import CellTowerIcon from '@mui/icons-material/CellTower'
import DevicesIcon from '@mui/icons-material/Devices'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant'
import { Link as RouterLink } from 'react-router-dom'

import { ChartPanel } from '../charts/ChartPanel'
import { PingLatencyChart } from '../charts/PingLatencyChart'
import { TemperatureChart } from '../charts/TemperatureChart'
import { AlertSeverityChip } from '../components/AlertSeverityChip'
import { BeaconStatusChip } from '../components/BeaconStatusChip'
import { formatBeaconUptime, formatTime } from '../data/demo'
import { useFleet } from '../fleet/FleetContext'

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const {
    beacons,
    alerts,
    liveReadings,
    historyReadings,
    recentPings,
    fleetSummary,
    deviceName,
    settings,
    acknowledgeAlert,
  } = useFleet()

  const openAlerts = alerts.filter((a) => !a.acknowledged)
  const recentBeacons = [...beacons].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6)
  const chartDeviceIds = ['esp32-roof-01', 'esp32-garden-02', 'esp32-shed-03']
  const allReadings = [...liveReadings, ...historyReadings]

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ mb: 0.75 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fleet pulse — trends, alerts, and recent beacons.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Devices online"
            value={`${fleetSummary.online}/${fleetSummary.total}`}
            subtitle={`${fleetSummary.degraded} degraded · ${fleetSummary.offline} offline`}
            icon={<DevicesIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Avg ping"
            value={`${fleetSummary.avgPingMs} ms`}
            subtitle="Across reachable nodes"
            icon={<NetworkCheckIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Open alerts"
            value={String(fleetSummary.openAlerts)}
            subtitle="Unacknowledged fleet events"
            icon={<NotificationImportantIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Beacon issues"
            value={String(fleetSummary.missedBeacons + fleetSummary.weakBeacons)}
            subtitle={`${fleetSummary.missedBeacons} missed · ${fleetSummary.weakBeacons} weak`}
            icon={<CellTowerIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ChartPanel
            title="Temperature"
            subtitle={`Last 12 hours · ${settings.temperatureUnit === 'f' ? '°F' : '°C'}`}
            action={
              <Button component={RouterLink} to="/history" size="small">
                History
              </Button>
            }
          >
            <TemperatureChart
              readings={allReadings}
              deviceIds={chartDeviceIds}
              deviceLabel={deviceName}
              temperatureUnit={settings.temperatureUnit}
              height={260}
            />
          </ChartPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <ChartPanel title="Ping latency" subtitle="Last 30 minutes">
            <PingLatencyChart
              pings={recentPings}
              deviceIds={chartDeviceIds}
              deviceLabel={deviceName}
              height={260}
            />
          </ChartPanel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1">Open alerts</Typography>
            </Box>
            <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
              {openAlerts.length === 0 && (
                <Box sx={{ px: 2, py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No open alerts.
                  </Typography>
                </Box>
              )}
              {openAlerts.map((a) => (
                <Box key={a.id} sx={{ px: 2, py: 1.5 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AlertSeverityChip severity={a.severity} />
                      <Typography variant="subtitle2">{a.title}</Typography>
                    </Stack>
                    <Button size="small" onClick={() => acknowledgeAlert(a.id)}>
                      Ack
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {a.detail}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {a.deviceId ? (
                      <>
                        <Typography
                          component={RouterLink}
                          to={`/devices/${a.deviceId}`}
                          variant="caption"
                          sx={{
                            color: 'text.primary',
                            textDecoration: 'underline',
                            textUnderlineOffset: 2,
                          }}
                        >
                          {deviceName(a.deviceId)}
                        </Typography>
                        {' · '}
                      </>
                    ) : null}
                    {formatTime(a.at)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ overflow: 'hidden', height: '100%' }}>
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
              <Typography variant="subtitle1">Recent beacons</Typography>
              <Button component={RouterLink} to="/logs" size="small">
                View logs
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Seq</TableCell>
                  <TableCell align="right">RSSI</TableCell>
                  <TableCell align="right">Uptime</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBeacons.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(b.at)}</TableCell>
                    <TableCell>
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
                    <TableCell align="right">{b.seq}</TableCell>
                    <TableCell align="right">
                      {b.rssiDbm != null ? `${b.rssiDbm}` : '—'}
                    </TableCell>
                    <TableCell align="right">{formatBeaconUptime(b.uptimeSec)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
