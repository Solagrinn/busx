import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { seatSchemas } from '../mocks/mockData.ts'
import SeatSelectionPage from '../pages/SeatSelectionPage.tsx'
import { queryClient } from '../services/queryClient.ts'

vi.mock('../mocks/node.js', () => ({
  server: {
    listen: vi.fn(),
    resetHandlers: vi.fn(),
    close: vi.fn(),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // just returns the key for simplicity
  }),
}))

describe('priceSummary - price calculations', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('özet tutar doğru hesaplanır', async () => {
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/trip/TRIP-1001']}>
          <Routes>
            <Route path="/trip/:tripId" element={<SeatSelectionPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    // Select 3 empty seats
    const emptySeats = await screen.findAllByTitle(/empty$/)
    for (const seat of emptySeats.slice(0, 3)) {
      await user.click(seat)
    }

    // The totalPrice should now be updated in the DOM
    // For this, your component must render it somewhere, e.g.:
    // <div data-testid="total-price">{totalPrice}</div>
    const totalPriceEl = await screen.findByLabelText('totalAmount')
    expect(totalPriceEl).toHaveTextContent((3 * seatSchemas.unitPrice).toString())
  })
})
