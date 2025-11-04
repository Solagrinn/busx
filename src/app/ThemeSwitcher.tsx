import { Button } from '@mui/material'

interface ThemeSwitcherProps {
  toggleTheme: () => void
  mode: 'light' | 'dark'
}

export default function ThemeSwitcher({ toggleTheme, mode }: ThemeSwitcherProps) {
  return (
    <Button variant="outlined" color="primary" onClick={toggleTheme}>
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  )
}
