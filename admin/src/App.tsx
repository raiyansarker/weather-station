import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { FleetProvider } from './fleet/FleetContext'
import { AppShell } from './layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { DeviceDetailPage } from './pages/DeviceDetailPage'
import { DevicesPage } from './pages/DevicesPage'
import { HistoryPage } from './pages/HistoryPage'
import { LogsPage } from './pages/LogsPage'
import { SettingsPage } from './pages/SettingsPage'
import { theme } from './theme/theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FleetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FleetProvider>
    </ThemeProvider>
  )
}
