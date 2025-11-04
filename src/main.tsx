import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { startWorker } from './mocks/browser'
import { queryClient } from './services/queryClient.ts'
import 'i18next'

async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    return startWorker()
  }
  return Promise.resolve()
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  )
})
