import type { Schedule } from '../types/schedules.ts'
import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import { compareAsc, compareDesc, format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import ArrowIcon from '../assets/ArrowIcon.tsx'

interface ScheduleListProps {
  schedules: Schedule[]
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
  const { t } = useTranslation('schedule')
  const navigate = useNavigate()
  const [sortOption, setSortOption] = useState<'priceAsc' | 'priceDesc' | 'timeAsc' | 'timeDesc'>('priceAsc')

  const handleSelectTrip = (id: string) => {
    navigate(`/trip/${id}`)
  }

  const sortedSchedules = useMemo(() => {
    if (!schedules)
      return []

    const sorted = [...schedules]

    switch (sortOption) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'timeAsc':
        sorted.sort((a, b) => compareAsc(a.departure, b.departure))
        break
      case 'timeDesc':
        sorted.sort((a, b) => compareDesc(a.departure, b.departure))
        break
    }

    return sorted
  }, [schedules, sortOption])

  return (
    <Paper sx={{ p: 2, mt: 2, borderRadius: 6, backgroundColor: '#fdfdfd' }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid>
          <Typography variant="body1" fontWeight={600}>
            {t('sort')}
          </Typography>
        </Grid>

        <Grid>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t('select')}</InputLabel>
            <Select
              value={sortOption}
              label={t('sort')}
              onChange={e => setSortOption(e.target.value as typeof sortOption)}
            >
              <MenuItem value="priceAsc">{t('priceAsc')}</MenuItem>
              <MenuItem value="priceDesc">{t('priceDesc')}</MenuItem>
              <MenuItem value="timeAsc">{t('timeAsc')}</MenuItem>
              <MenuItem value="timeDesc">{t('timeDesc')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {sortedSchedules.length === 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: '#efefef' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.disabled' }}>
            {t('noTrips')}
          </Typography>
        </Paper>
      )}

      {sortedSchedules.map(schedule => (
        <Paper key={schedule.id} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#fff' }}>
          <Grid container>
            <Grid size="grow">
              <Grid container spacing={1} alignItems="center">
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {schedule.company}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="h4" fontSize={{ xs: 16, sm: 32 }} fontWeight={600}>
                    {format(schedule.departure, 'HH:mm')}
                    {' '}
                    -
                    {format(schedule.arrival, 'HH:mm')}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('availableSeats', { count: schedule.availableSeats })}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="h6" color="success.main">
                    {t('price', { price: schedule.price })}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid size="auto" alignContent="center">
              <ArrowIcon onClick={() => handleSelectTrip(schedule.id)} size={40} />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Paper>
  )
}
