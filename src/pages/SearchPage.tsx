import type { ScheduleSearchParams } from '../types/schedules.ts'
import type { ScheduleSearchFormData } from '../types/zodSchemas.ts'
import { useCallback, useState } from 'react'
import SearchForm from '../components/SearchForm.tsx'
import { useAgencies } from '../hooks/useAgencies.ts'
import { useSchedules } from '../hooks/useSchedules.ts'

const INITIAL_SEARCH_PARAMS: ScheduleSearchParams = {
  fromId: '',
  toId: '',
  date: '',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<ScheduleSearchParams>(INITIAL_SEARCH_PARAMS)

  const {
    data: agencies,
    isLoading: isAgenciesLoading,
    isError: isAgenciesError,
    error: agenciesError,
  } = useAgencies()

  const {
    data: schedules,
    isLoading: isSchedulesLoading, // Renamed 'isLoading'
    isError: isSchedulesError, // Renamed 'isError'
    error: schedulesError, // Renamed 'error'
    isFetching: isSchedulesFetching,
  } = useSchedules(searchParams)

  const handleSearchSubmit = useCallback((data: ScheduleSearchFormData) => {
    setSearchParams({
      fromId: data.fromId,
      toId: data.toId,
      date: data.date,
    })
  }, [])

  const hasSearched = !!(searchParams.fromId && searchParams.toId && searchParams.date)

  const statusMessage = (() => {
    if (isSchedulesLoading || isSchedulesFetching)
      return 'Seferler yükleniyor...'
    if (isSchedulesError)
      return `Hata oluştu: ${schedulesError?.message || 'Bilinmeyen Hata'}`
    if (hasSearched && schedules && schedules.length === 0)
      return 'Bu kriterlere uygun sefer bulunamadı.'
    if (!hasSearched)
      return 'Lütfen kalkış, varış ve tarihi seçerek arama yapınız.'
    return ''
  })()

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      asdasdsa
      <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700">Sefer Ara</h1>
        <SearchForm onSubmit={handleSearchSubmit} />
        <button
          type="button"
          onClick={() => {
            const data = { fromId: 'ist-alibeykoy', toId: 'ank-astim', date: '2025-11-02' }
            handleSearchSubmit(data)
          }}
        >
          asd
        </button>
      </div>

      <div className="mt-8">
        {(isSchedulesLoading || isSchedulesError || statusMessage) && (
          <div className={`p-4 text-center rounded-lg ${isSchedulesError ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            {statusMessage}
          </div>
        )}

        {/* {hasSearched && schedules && schedules.length > 0 && (
          <ScheduleList schedules={schedules} />
        )} */}
      </div>
    </div>
  )
}
