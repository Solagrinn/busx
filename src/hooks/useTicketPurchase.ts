import type { UseMutationOptions } from '@tanstack/react-query'

import type { TicketSaleRequest, TicketSaleResponse } from '../types/booking.ts'
import { useMutation } from '@tanstack/react-query'
import { post } from '../services/apiClient.ts'

/**
 * Executes the asynchronous ticket sale API call using useMutation.
 * @param options Optional configuration for useMutation (e.g., onSuccess, onError).
 * @returns TanStack Query mutation object containing mutate, mutateAsync, isPending, etc.
 */
export function useTicketPurchase(
  options?: UseMutationOptions<TicketSaleResponse, Error, TicketSaleRequest>,
) {
  return useMutation<TicketSaleResponse, Error, TicketSaleRequest>({
    mutationKey: ['ticketSale'],

    mutationFn: async (payload: TicketSaleRequest): Promise<TicketSaleResponse> => {
      const endpoint = `/tickets/sell`
      return post<TicketSaleRequest, TicketSaleResponse>(endpoint, payload)
    },
    ...options,
  })
}
