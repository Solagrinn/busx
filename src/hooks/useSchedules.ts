import type { RawSchedule, Schedule, ScheduleSearchFormData } from '../types/schedules'
import { useQuery } from '@tanstack/react-query'
import { get } from '../services/apiClient'

/**
 * Hook to fetch a list of schedules matching the search criteria.
 * @param params The search criteria (from, to, date).
 */
export function useSchedules(params: ScheduleSearchFormData) {
  const { fromId, toId, date } = params

  const isEnabled = !!fromId && !!toId && !!date

  const queryKey = ['schedules', fromId, toId, date]

  return useQuery<Schedule[], Error>({
    queryKey,

    queryFn: async () => {
      const queryString = `?from=${fromId}&to=${toId}&date=${date}`
      const endpoint = `/schedules${queryString}`

      const response = await get<RawSchedule[]>(endpoint)
      return (
        response.map(schedule => ({
          ...schedule,
          departure: new Date(schedule.departure),
          arrival: new Date(schedule.arrival),
        }))
      )
    },

    enabled: isEnabled,
  })
}
