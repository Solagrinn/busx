import type { Agency } from '../types/schedules'
import { useQuery } from '@tanstack/react-query'
import { get } from '../services/apiClient'

/**
 * Hook to fetch all available agencies (departure/arrival points).
 * This data is generally static and only needs to be fetched once.
 */
export function useAgencies() {
  const queryKey = ['agencies']

  return useQuery<Agency[], Error>({
    queryKey,
    queryFn: () => {
      return get<Agency[]>('/reference/agencies')
    },

    staleTime: 1000 * 60 * 60,

    gcTime: 1000 * 60 * 60 * 24,
  })
}
