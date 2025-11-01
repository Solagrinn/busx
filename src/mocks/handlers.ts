import type { TicketSaleRequest } from '../types/seats.ts'
import { isSameDay, parseISO } from 'date-fns'
import { http, HttpResponse } from 'msw'
import { agencies, schedules, seatSchemas } from './mockData.ts'

export const handlers = [
  http.get('https://busx/api/reference/agencies', () => {
    return HttpResponse.json(agencies)
  }),

  http.get(`https://busx/api/schedules`, ({ request }) => {
    const url = new URL(request.url)

    const fromId = url.searchParams.get('from')
    const toId = url.searchParams.get('to')
    const date = url.searchParams.get('date') // Expected format: YYYY-MM-DD

    if (!fromId || !toId || !date) {
      return new HttpResponse('Missing required search parameters (from, to, date).', { status: 400 })
    }

    const searchDate = parseISO(date)

    if (Number.isNaN(searchDate.getTime())) {
      return new HttpResponse('Invalid date format provided.', { status: 400 })
    }

    const filteredSchedules = schedules.filter((schedule) => {
      const agencyMatch = schedule.from === fromId && schedule.to === toId
      const scheduleDepartureDate = parseISO(schedule.departure)
      const dateMatch = isSameDay(scheduleDepartureDate, searchDate)

      return agencyMatch && dateMatch
    })

    return HttpResponse.json(filteredSchedules, { status: 200 })
  }),

  http.get(`https://busx/api/seatSchemas/:tripId`, ({ params }) => {
    const { tripId } = params

    const schema = seatSchemas.find(s => s.tripId === tripId)

    if (!schema) {
      return new HttpResponse(`Seat schema not found for trip: ${tripId}`, { status: 404 })
    }

    return HttpResponse.json(schema, { status: 200 })
  }),

  http.post(`https://busx/api/tickets/sell`, async ({ request }) => {
    const saleData: TicketSaleRequest | null = (await request.json()) as TicketSaleRequest | null

    if (!saleData || !saleData.tripId || !Array.isArray(saleData.seats) || saleData.seats.length === 0) {
      console.error('MSW: Invalid sale data received (Missing tripId or seats).')
      return new HttpResponse('Invalid sale data structure or missing required fields.', { status: 400 })
    }

    const datePart = new Date().toISOString().substring(0, 10).replace(/-/g, '') // YYYYMMDD
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase() // Random letters/numbers

    return HttpResponse.json(
      {
        ok: true,
        pnr: `AT-${datePart}-${randomPart}`,
        message: 'Payment step mocked.',
      },
      { status: 200 },
    )
  }),
]
