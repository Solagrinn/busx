import { QueryClient } from '@tanstack/react-query'

// Define the QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    },
  },
})
