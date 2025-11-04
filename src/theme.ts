import { grey } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const BRAND_RED = {
  main: '#d23b38',
}

const TYPOGRAPHY_GRAY = {
  main: '#2c2c2c',
  light: '#5d686e',
  white: '#ffffff',
}

export function getTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // ☀️ LIGHT MODE
            primary: {
              main: BRAND_RED.main,
            },
            background: {
              default: '#fafafa',
              paper: '#ffffff',
            },
            text: {
              primary: TYPOGRAPHY_GRAY.main,
              secondary: TYPOGRAPHY_GRAY.light,
              disabled: grey[500],
            },
            success: {
              main: '#1f9b78',
            },
          }
        : {
            // 🌙 DARK MODE
            primary: {
              main: BRAND_RED.main,
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: grey[400],
              disabled: grey[600],
            },
            success: {
              main: '#27c49b',
            },
          }),
    },

    typography: {
      fontFamily: ['Montserrat', 'Roboto', 'sans-serif'].join(','),
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'background-color 0.3s, color 0.3s',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            fontWeight: 500,
            borderRadius: 12,
            backgroundColor:
                            theme.palette.mode === 'light' ? '#f4f5f5' : '#2a2a2a',
            transition: 'background-color 0.3s, color 0.3s',
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            fontSize: '1rem',
          }),
        },
      },
    },
  })
}
