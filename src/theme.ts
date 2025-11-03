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

const theme = createTheme({

  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: BRAND_RED.main,
    },
    text: {
      primary: TYPOGRAPHY_GRAY.main,
      secondary: TYPOGRAPHY_GRAY.light,
      disabled: grey[500],
    },
    success: {
      main: '#1f9b78',
    },
    background: {
      default: '#fafafa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: TYPOGRAPHY_GRAY.main,
          fontWeight: 500,
          borderRadius: 12,
          backgroundColor: '#f4f5f5',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: TYPOGRAPHY_GRAY.light,
          fontSize: '1rem',
        },
      },
    },
  },
})

export default theme
