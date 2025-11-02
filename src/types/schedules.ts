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
export interface Schedule {
  id: string // e.g., "TRIP-1001"
  company: string // e.g., "Atlas Lines"
  from: string // Agency ID of the departure point (e.g., "ist-alibeykoy")
  to: string // Agency ID of the arrival point (e.g., "ank-astim")

  // ISO 8601 string including date, time, and timezone offset
  // e.g., "2025-11-02T08:30:00+03:00"
  departure: string

  // ISO 8601 string for arrival
  arrival: string

  price: number // The ticket price in the local currency (e.g., 695)
  availableSeats: number // The number of remaining seats (e.g., 18)
}

/**
 * Represents a bus agency/terminal for the dropdown lists.
 * GET /api/reference/agencies
 */
export interface Agency {
  id: string // e.g., "ist-alibeykoy"
  name: string // e.g., "İstanbul – Alibeyköy"
}
