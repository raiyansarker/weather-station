import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import WbCloudyIcon from '@mui/icons-material/WbCloudy'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Devices', path: '/devices' },
  { label: 'Logs', path: '/logs' },
  { label: 'History', path: '/history' },
  { label: 'Settings', path: '/settings' },
] as const

function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/'
  return pathname.startsWith(path)
}

export function TopBar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const desktopNav = navItems.filter((item) => item.path !== '/settings')

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: '#1a1a1a', color: '#fff', flexShrink: 0 }}
    >
      <Toolbar
        sx={{
          position: 'relative',
          minHeight: { xs: 56, sm: 56 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, zIndex: 1 }}>
          <WbCloudyIcon sx={{ mr: 1.5, flexShrink: 0 }} />
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
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {desktopNav.map((item) => {
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

        <Box sx={{ ml: 'auto', zIndex: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton
            component={RouterLink}
            to="/settings"
            aria-label="Settings"
            color="inherit"
            disableRipple
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
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
          <IconButton
            color="inherit"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            edge="end"
            onClick={() => setMenuOpen((open) => !open)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      <Collapse in={menuOpen} timeout={200} unmountOnExit sx={{ display: { md: 'none' } }}>
        <Box
          component="nav"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            px: 1.5,
            pb: 1.5,
            pt: 0.25,
          }}
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.path)
            return (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                color="inherit"
                fullWidth
                disableRipple
                sx={{
                  justifyContent: 'flex-start',
                  px: 1.5,
                  py: 1,
                  minHeight: 40,
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: 14,
                  color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                  bgcolor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                  '&:hover': {
                    bgcolor: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                  },
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>
      </Collapse>
    </AppBar>
  )
}
