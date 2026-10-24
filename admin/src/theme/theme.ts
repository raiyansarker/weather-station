import { createTheme } from '@mui/material/styles'

/** Material UI + Shopify-style shell. Black compact actions. */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      dark: '#000000',
      light: '#333333',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6d7175',
    },
    background: {
      default: '#f1f1f1',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.8125rem',
      lineHeight: 1.2,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          minHeight: 28,
          paddingInline: 10,
          paddingBlock: 4,
          borderRadius: 6,
          boxShadow: 'none',
          lineHeight: 1.25,
        },
        sizeSmall: {
          minHeight: 28,
          paddingInline: 10,
          paddingBlock: 4,
          fontSize: '0.8125rem',
        },
        sizeMedium: {
          minHeight: 30,
          paddingInline: 12,
          paddingBlock: 5,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&.Mui-disabled': {
            backgroundColor: '#e3e3e3',
            color: '#8c9196',
          },
        },
        containedPrimary: {
          backgroundColor: '#1a1a1a',
          color: '#fff',
          '&:hover': { backgroundColor: '#000' },
        },
        containedError: {
          backgroundColor: '#c62828',
          color: '#fff',
          '&:hover': { backgroundColor: '#b71c1c' },
        },
        outlined: {
          paddingInline: 9,
        },
        outlinedPrimary: {
          borderColor: '#1a1a1a',
          color: '#1a1a1a',
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: '#000',
            backgroundColor: 'rgba(26,26,26,0.04)',
          },
        },
        outlinedError: {
          borderColor: '#c62828',
          color: '#c62828',
          '&:hover': {
            borderColor: '#b71c1c',
            backgroundColor: 'rgba(198,40,40,0.04)',
          },
        },
        text: {
          minHeight: 28,
          paddingInline: 8,
        },
        textPrimary: {
          color: '#1a1a1a',
          '&:hover': {
            backgroundColor: 'rgba(26,26,26,0.04)',
          },
        },
        textError: {
          color: '#c62828',
          '&:hover': {
            backgroundColor: 'rgba(198,40,40,0.04)',
          },
        },
        textInherit: {
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'inherit',
          },
        },
        startIcon: {
          marginRight: 4,
          marginLeft: -2,
          '& > *:nth-of-type(1)': { fontSize: 16 },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          padding: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderRadius: 12,
          borderColor: '#e3e3e3',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 10,
          paddingBottom: 10,
        },
        head: {
          fontWeight: 500,
          color: '#6d7175',
        },
      },
    },
  },
})
