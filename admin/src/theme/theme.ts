import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 4,
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
  },
})
