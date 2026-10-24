import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'

import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <TopBar />
      <Box component="main" sx={{ flex: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
