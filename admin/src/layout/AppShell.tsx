import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'

import { TopBar } from './TopBar'

/**
 * Shopify layout: dark chrome + light content well with curved top corners.
 * Shell is viewport-locked; only the inner well body scrolls, so the radius stays put.
 */
export function AppShell() {
  return (
    <Box
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
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
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            bgcolor: '#f1f1f1',
            borderTopLeftRadius: { xs: 12, sm: 16 },
            borderTopRightRadius: { xs: 12, sm: 16 },
          }}
        >
          <Box
            sx={{
              height: '100%',
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
    </Box>
  )
}
