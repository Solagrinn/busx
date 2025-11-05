import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SeatMap from '../components/SeatMap.tsx'
import { seatSchemas } from '../mocks/mockData.ts'

vi.mock('../mocks/node.js', () => ({
  server: {
    listen: vi.fn(),
    resetHandlers: vi.fn(),
    close: vi.fn(),
  },
}))

describe('seatMap - Seat Selection', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('4\'ten fazla koltuk seçemez', async () => {
    const user = userEvent.setup()
    const mockOnSeatSelect = vi.fn()
    render(<SeatMap seatMapData={seatSchemas} onSeatSelect={mockOnSeatSelect} unitPrice={695} />)

    const allEmptySeats = screen.getAllByTitle(/empty$/)
    const seats = allEmptySeats.slice(0, 7)

    for (const seat of seats) {
      await user.click(seat)
    }

    expect(mockOnSeatSelect).toHaveBeenCalledTimes(4)
    expect(mockOnSeatSelect).toHaveBeenLastCalledWith(expect.arrayContaining([/* the 4 seat numbers */]))
  })
})
