export interface ContactInfo {
  email: string
  phone: string
}

export interface Passenger {
  seat: number
  firstName: string
  lastName: string
  idNo: string
  gender: 'male' | 'female'
}

/**
 * The structure for the request body sent to POST /api/tickets/sell.
 */
export interface TicketSaleRequest {
  tripId: string
  seats: number[]
  contact: ContactInfo
  passengers: Passenger[]
}
