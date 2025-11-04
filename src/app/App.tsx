import { Box, CssBaseline, GlobalStyles, Grid, ThemeProvider } from '@mui/material'
import { useMemo, useState } from 'react'
import { getTheme } from '../theme.ts'
import LanguageSwitcher from './LanguageSwitcher.tsx'
import AppRouter from './Router.tsx'
import ThemeSwitcher from './ThemeSwitcher.tsx'
import './i18n.ts'

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <GlobalStyles
        styles={{
          '#root': {
            maxWidth: 1280,
            margin: '0 auto',
            textAlign: 'center',
            padding: theme.spacing(1),
            [theme.breakpoints.up('sm')]: {
              padding: theme.spacing(3),
            },
          },

          'body::before': {
            content: '""',
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '150px',
            zIndex: -1,

            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(180, 0, 0, 0.8)'
              : 'rgb(204, 0, 0)',

            transition: 'background-color 0.3s ease',
          },
        }}
      />

      <Box sx={{ position: 'fixed' }}>
        <Grid container spacing={1}>
          <Grid size="auto">
            <ThemeSwitcher
              toggleTheme={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))}
              mode={mode}
            />
          </Grid>
          <Grid size="auto"><LanguageSwitcher /></Grid>
        </Grid>

      </Box>

      <AppRouter />
    </ThemeProvider>
  )
}

export default App
