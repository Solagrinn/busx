import type { ScheduleSearchFormData } from '../types/schedules.ts'
import { CircularProgress, Grid, Paper, Typography } from '@mui/material'
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
    <div>

      <Typography variant="h4" component="h1" sx={{ color: 'white' }} fontWeight={600} gutterBottom>
        BusX Sefer Arama
      </Typography>
      <SearchForm onSubmit={handleSearchSubmit} isAgenciesError={isAgenciesError} isAgenciesLoading={isAgenciesLoading} agencies={agencies} />

      {(isSchedulesLoading || isSchedulesError || statusMessage) && (
        <div>
          {statusMessage}
        </div>
      )}

      {isSchedulesLoading && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: '#efefef',

          }}
        >
          <Grid container justifyContent="center">
            <Grid sx={{ pr: 2 }}><CircularProgress size={42} sx={{ color: 'text.disabled' }} /></Grid>
            <Grid>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: 'text.disabled' }}
              >
                Yükleniyor..
              </Typography>
            </Grid>
          </Grid>

        </Paper>
      )}

      {hasSearched && schedules && schedules.length > 0 && (
        <ScheduleList schedules={schedules} />
      )}

    </div>
  )
}
