import type { Agency } from '../types/schedules'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SearchForm from '../components/SearchForm'

// Mock MSW
vi.mock('../mocks/node.js', () => ({
  server: {
    listen: vi.fn(),
    resetHandlers: vi.fn(),
    close: vi.fn(),
  },
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'fromLabel': 'From',
        'toLabel': 'To',
        'dateLabel': 'Date',
        'selectFrom': 'Select departure',
        'selectTo': 'Select arrival',
        'findTrips': 'Find Trips',
        'searching': 'Searching...',
        'searchBar.loading': 'Loading...',
        'searchBar.error': 'Error loading agencies',
        'schedule.fromId': 'Departure location is required.',
        'schedule.toId': 'Arrival location is required.',
        'schedule.date': 'Date must be in YYYY-MM-DD format.',
        'schedule.sameRoute': 'Departure and arrival locations cannot be the same.',
      }
      return translations[key] || key
    },
  }),
}))

describe('searchForm - Validation Flow', () => {
  const mockAgencies: Agency[] = [
    { id: '1', name: 'Istanbul' },
    { id: '2', name: 'Ankara' },
    { id: '3', name: 'Izmir' },
  ]

  const mockOnSubmit = vi.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    agencies: mockAgencies,
    isAgenciesLoading: false,
    isAgenciesError: false,
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('boş form gönderildiğinde validasyon hatası gösterir', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /find trips/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/departure location is required/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('tüm validasyonlar geçtiğinde form başarıyla gönderilir', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    // Kalkış yeri seç
    const fromSelect = screen.getByLabelText(/from/i)
    await user.click(fromSelect)
    const istanbulOption = await screen.findByText('Istanbul')
    await user.click(istanbulOption)
    await user.keyboard('{Escape}')
    await new Promise(resolve => setTimeout(resolve, 100))

    // Varış yeri seç
    const toSelect = screen.getByLabelText(/to/i)
    await user.click(toSelect)
    const ankaraOption = await screen.findByText('Ankara')
    await user.click(ankaraOption)
    await user.keyboard('{Escape}')
    await new Promise(resolve => setTimeout(resolve, 100))

    // Tarih seç
    const dateInput = screen.getByLabelText(/date/i)
    await user.clear(dateInput)
    await user.type(dateInput, '2025-12-25')

    // Formu gönder
    await waitFor(() => {
      const submitButton = screen.queryByRole('button', { name: /find trips/i })
      expect(submitButton).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /find trips/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // İlk parametreyi kontrol et (form data)
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      fromId: '1',
      toId: '2',
      date: '2025-12-25',
    })
  })

  it('kalkış yeri seçildiğinde varış listesinde görünmez', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    // Kalkış yeri seç
    const fromSelect = screen.getByLabelText(/from/i)
    await user.click(fromSelect)
    const istanbulOption = await screen.findByText('Istanbul')
    await user.click(istanbulOption)
    await user.keyboard('{Escape}')
    await new Promise(resolve => setTimeout(resolve, 100))

    // Varış dropdown'unu aç
    const toSelect = screen.getByLabelText(/to/i)
    await user.click(toSelect)

    // Istanbul varış listesinde olmamalı
    await waitFor(() => {
      const options = screen.getAllByRole('option')
      const istanbulInToList = options.some(option => option.textContent === 'Istanbul')
      expect(istanbulInToList).toBe(false)
    })
  })

  it('varış yeri seçildiğinde kalkış listesinde görünmez', async () => {
    const user = userEvent.setup()
    render(<SearchForm {...defaultProps} />)

    // Varış yeri seç
    const toSelect = screen.getByLabelText(/to/i)
    await user.click(toSelect)
    const ankaraOption = await screen.findByText('Ankara')
    await user.click(ankaraOption)
    await user.keyboard('{Escape}')
    await new Promise(resolve => setTimeout(resolve, 100))

    // Kalkış dropdown'unu aç
    const fromSelect = screen.getByLabelText(/from/i)
    await user.click(fromSelect)

    // Ankara kalkış listesinde olmamalı
    await waitFor(() => {
      const options = screen.getAllByRole('option')
      const ankaraInFromList = options.some(option => option.textContent === 'Ankara')
      expect(ankaraInFromList).toBe(false)
    })
  })
})
