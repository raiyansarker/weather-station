import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import SettingsIcon from '@mui/icons-material/Settings'
import WbCloudyIcon from '@mui/icons-material/WbCloudy'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Devices', path: '/devices' },
  { label: 'Logs', path: '/logs' },
  { label: 'History', path: '/history' },
] as const

function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/'
  return pathname.startsWith(path)
}

export function TopBar() {
  const { pathname } = useLocation()

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
      <Toolbar sx={{ position: 'relative', minHeight: { xs: 56, sm: 56 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, zIndex: 1 }}>
          <WbCloudyIcon sx={{ mr: 1.5 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 500,
              fontSize: 16,
              color: 'inherit',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Weather Admin
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1.5 },
          }}
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.path)
            return (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit"
                disableRipple
                sx={{
                  px: 1.5,
                  minWidth: 'auto',
                  fontWeight: 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                  opacity: 1,
                  transition: 'none',
                  '&:hover': { bgcolor: 'transparent', color: '#fff' },
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>

        <Box sx={{ ml: 'auto', zIndex: 1 }}>
          <IconButton
            component={RouterLink}
            to="/settings"
            aria-label="Settings"
            color="inherit"
            disableRipple
            sx={{
              transition: 'none',
              bgcolor: pathname === '/settings' ? 'rgba(255,255,255,0.12)' : 'transparent',
              '&:hover': {
                bgcolor:
                  pathname === '/settings' ? 'rgba(255,255,255,0.12)' : 'transparent',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
