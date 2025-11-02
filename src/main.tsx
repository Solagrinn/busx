import { ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { startWorker } from './mocks/browser'
import { queryClient } from './services/queryClient.ts'
import theme from './theme.ts'

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    return startWorker()
  }
  return Promise.resolve()
}

// 2. Render the app after the worker is ready.
enableMocking().then(() => {
  // Note: You would typically include your main CSS file here too (e.g., './index.css')
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
