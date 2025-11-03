import type { ScheduleSearchFormData } from '../types/schedules.ts'
import { Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import ScheduleList from '../components/ScheduleList.tsx'
import SearchForm from '../components/SearchForm.tsx'
import { useAgencies } from '../hooks/useAgencies.ts'
import { useSchedules } from '../hooks/useSchedules.ts'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState<ScheduleSearchFormData>({ fromId: '', toId: '', date: '' })

  const {
    data: agencies,
    isLoading: isAgenciesLoading,
    isError: isAgenciesError,
  } = useAgencies()

  const {
    data: schedules,
    isLoading: isSchedulesLoading,
    isError: isSchedulesError,
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
      return `Hata oluştu`
    if (hasSearched && schedules && schedules.length === 0)
      return 'Bu kriterlere uygun sefer bulunamadı.'
    if (!hasSearched)
      return 'Lütfen kalkış, varış ve tarihi seçerek arama yapınız.'
    return ''
  })()

  return (
    <div className="container mx-auto p-4 max-w-4xl">

      <Typography variant="h4" component="h1" sx={{ color: 'white' }} fontWeight={600} gutterBottom>
        BusX Sefer Arama
      </Typography>
      <SearchForm onSubmit={handleSearchSubmit} isAgenciesError={isAgenciesError} isAgenciesLoading={isAgenciesLoading} agencies={agencies} />

      <div className="mt-8">
        {(isSchedulesLoading || isSchedulesError || statusMessage) && (
          <div className={`p-4 text-center rounded-lg ${isSchedulesError ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            {statusMessage}
          </div>
        )}

        {hasSearched && schedules && schedules.length > 0 && (
          <ScheduleList schedules={schedules} isSchedulesError={isSchedulesError} isSchedulesLoading={isSchedulesLoading} isSchedulesFetching={isSchedulesFetching} />
        )}
      </div>
    </div>
  )
}
