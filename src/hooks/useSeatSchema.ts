import type { RawSeatMap } from '../types/seats.ts'
import { useQuery } from '@tanstack/react-query'
import { get } from '../services/apiClient.ts'

/**
 * Fetches the detailed seat map for a specific trip.
 * @param tripId The ID of the schedule/trip. Must be present to enable the query.
 * @returns TanStack Query result object containing data, isLoading, isError, etc.
 */
export function useSeatSchema(tripId: string | undefined) {
  const queryKey = ['seatMap', tripId]

  return useQuery<RawSeatMap, Error>({
    enabled: !!tripId,
    queryKey,
    queryFn: async () => {
      const endpoint = `/seatSchemas/${tripId}`

      return get<RawSeatMap>(endpoint)
    },
  })
}
