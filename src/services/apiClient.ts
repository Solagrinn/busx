/**
 * src/services/apiClient.ts
 * A simple, typed wrapper around the native fetch API for consistent handling
 * of API calls, responses, and errors.
 */

const API_BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * Custom error class for API responses that return a non-2xx status code.
 */
class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Standard GET request wrapper.
 * @template T The expected type of the JSON response body.
 * @param endpoint The path appended to the API_BASE_URL (e.g., '/schedules?from=...').
 * @returns A promise that resolves to the data of type T.
 */
export async function get<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError(
      `API GET request failed with status ${response.status}: ${errorBody.substring(0, 100)}`,
      response.status,
    )
  }

  if (response.status === 204) {
    return {} as T
  }

  return await response.json() as Promise<T>
}

/**
 * Standard POST request wrapper.
 * @template TRequest The type of the request body.
 * @template TResponse The expected type of the JSON response body.
 * @param endpoint The path appended to the API_BASE_URL (e.g., '/tickets/sell').
 * @param data The JSON body to send.
 * @returns A promise that resolves to the data of type TResponse.
 */
export async function post<TRequest, TResponse>(
  endpoint: string,
  data: TRequest,
): Promise<TResponse> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError(
      `API POST request failed with status ${response.status}: ${errorBody.substring(0, 100)}`,
      response.status,
    )
  }

  return await response.json() as Promise<TResponse>
}
