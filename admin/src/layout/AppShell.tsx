import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'

import { TopBar } from './TopBar'

/**
 * Shopify layout: dark chrome + light content well with curved top corners.
 * Components inside remain Material UI.
 */
export function AppShell() {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1a1a1a',
      }}
    >
      <TopBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            bgcolor: '#f1f1f1',
            borderTopLeftRadius: { xs: 12, sm: 16 },
            borderTopRightRadius: { xs: 12, sm: 16 },
            overflow: 'auto',
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box sx={{ maxWidth: 1180, mx: 'auto', width: '100%' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
