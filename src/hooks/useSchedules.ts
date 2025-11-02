/**
 * src/hooks/useSchedules.ts
 * Hook to fetch available trips (schedules) based on search criteria.
 * Uses the GET /api/schedules?from=...&to=...&date=... endpoint.
 */

import type { Schedule, ScheduleSearchParams } from '../types/schedules' // Assuming this defines the trip structure
import { useQuery } from '@tanstack/react-query'
import { get } from '../services/apiClient'

/**
 * Hook to fetch a list of schedules matching the search criteria.
 * @param params The search criteria (from, to, date).
 */
export function useSchedules(params: ScheduleSearchParams) {
  const { fromId, toId, date } = params

  const isEnabled = !!fromId && !!toId && !!date

  const queryKey = ['schedules', fromId, toId, date]

  return useQuery<Schedule[], Error>({
    queryKey,

    queryFn: () => {
      const queryString = `?from=${fromId}&to=${toId}&date=${date}`
      const endpoint = `/schedules${queryString}`

      return get<Schedule[]>(endpoint)
    },

    enabled: isEnabled,
  })
}
