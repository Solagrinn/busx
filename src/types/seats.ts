import { z } from 'zod'

export const SeatStatusSchema = z.enum(['empty', 'taken', 'selected', 'unavailable'])

export const SeatSchema = z.object({
  no: z.number().int().positive('Seat number (no) is required'),
  row: z.number().int().positive('Row must be a positive integer'),
  col: z.number().int().positive('Column must be a positive integer'),

  status: SeatStatusSchema,
})

export const LayoutSchema = z.object({
  rows: z.number().int().positive('Number of rows is required'),
  cols: z.number().int().positive('Number of columns is required'),
  cells: z.array(z.array(z.number().int())).optional(),
})

export const RawSeatMapSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),

  layout: LayoutSchema,
  unitPrice: z.number().positive('Unit price is required'),

  // The map is an array of individual seats
  seats: z.array(SeatSchema).min(1, 'Seat map must contain at least one seat'),
})

/**
 * Type representing a single seat, ready for UI use.
 */
export type Seat = z.infer<typeof SeatSchema>

/**
 * Type representing the status of a single seat.
 */
export type SeatStatus = z.infer<typeof SeatStatusSchema>

/**
 * Type representing the bus layout structure.
 */
export type Layout = z.infer<typeof LayoutSchema>

/**
 * Type representing the full seat map structure, used as the output model.
 */
export type SeatMap = z.infer<typeof RawSeatMapSchema>
