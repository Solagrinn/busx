import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

const SearchPage = lazy(() => import('../pages/SearchPage'))
const SeatSelectionPage = lazy(() => import('../pages/SeatSelectionPage'))
const SummaryPage = lazy(() => import('../pages/SummaryPage'))

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <Routes>
          <Route path="/" element={<SearchPage />} />

          <Route path="/trip/:tripId" element={<SeatSelectionPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
