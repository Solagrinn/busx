import type { Agency, ScheduleSearchFormData } from '../types/schedules.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScheduleSearchSchema } from '../types/schedules.ts'

interface SearchFormProps {
  onSubmit: (data: ScheduleSearchFormData) => void
  agencies: Agency[] | undefined
  isAgenciesLoading: boolean
  isAgenciesError: boolean
}

export default function SearchForm({
  onSubmit,
  agencies,
  isAgenciesLoading,
  isAgenciesError,
}: SearchFormProps) {
  const { t } = useTranslation('search')
  const { t: v } = useTranslation('validation')

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleSearchFormData>({
    resolver: zodResolver(ScheduleSearchSchema),
    mode: 'onSubmit',
    defaultValues: {
      fromId: '',
      toId: '',
      date: new Date().toISOString().substring(0, 10),
    },
  })

  const fromId = useWatch({ control, name: 'fromId' })
  const toId = useWatch({ control, name: 'toId' })

  if (isAgenciesLoading) {
    return (
      <div>
        <CircularProgress size={24} className="mr-2" />
        <p>{t('searchBar.loading')}</p>
      </div>
    )
  }

  if (isAgenciesError || !agencies) {
    return <p>{t('searchBar.error')}</p>
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 8 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* FROM */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Controller
              name="fromId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fromId}>
                  <InputLabel id="fromId-label" shrink>
                    {t('fromLabel')}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="fromId-label"
                    label={t('fromLabel')}
                    displayEmpty
                    disabled={isSubmitting}
                  >
                    <MenuItem value="" disabled>
                      {t('selectFrom')}
                    </MenuItem>
                    {agencies
                      .filter(a => a.id !== toId)
                      .map(agency => (
                        <MenuItem key={agency.id} value={agency.id}>
                          {agency.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.fromId?.message && (
                    <FormHelperText>{v(`schedule.fromId`)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* TO */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Controller
              name="toId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.toId}>
                  <InputLabel id="toId-label" shrink>
                    {t('toLabel')}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="toId-label"
                    label={t('toLabel')}
                    displayEmpty
                    disabled={isSubmitting}
                  >
                    <MenuItem value="" disabled>
                      {t('selectTo')}
                    </MenuItem>
                    {agencies
                      .filter(a => a.id !== fromId)
                      .map(agency => (
                        <MenuItem key={agency.id} value={agency.id}>
                          {agency.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.toId?.message && (
                    <FormHelperText>{v(`schedule.toId`)}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* DATE + SUBMIT */}
          <Grid container size={{ xs: 12, lg: 4 }}>
            <Grid size={{ xs: 12, sm: 8, lg: 6 }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('dateLabel')}
                    type="date"
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: minDate },
                    }}
                    error={!!errors.date}
                    helperText={errors.date?.message && v('schedule.date')}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, lg: 6 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={isSubmitting}
                sx={{ height: '100%', borderRadius: 4, p: 2 }}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                }
              >
                {isSubmitting ? t('searching') : t('findTrips')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
