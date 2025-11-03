/**
 * The parameters passed by the user to the GET /api/schedules endpoint.
 * These are used to filter the list of available trips.
 */
export interface ScheduleSearchParams {
  fromId: string
  toId: string
  date: string // YYYY-MM-DD format
}

/**
 * Represents a single available bus trip/schedule returned by the API.
 * GET /api/schedules
 */
export interface RawSchedule {
  id: string
  company: string

  from: string
  to: string

  departure: string
  arrival: string

  price: number
  availableSeats: number
}

/**
 * Represents a single available bus trip/schedule returned by the API.
 * GET /api/schedules
 */
export interface Schedule {
  id: string
  company: string

  from: string
  to: string

  departure: Date
  arrival: Date

  price: number
  availableSeats: number
}

/**
 * Represents a bus agency/terminal for the dropdown lists.
 * GET /api/reference/agencies
 */
export interface Agency {
  id: string // e.g., "ist-alibeykoy"
  name: string // e.g., "İstanbul – Alibeyköy"
}
