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
} from '@mui/material' // MUI Imports
import { Controller, useForm, useWatch } from 'react-hook-form' // Import Controller
import { ScheduleSearchSchema } from '../types/schedules.ts'

interface SearchFormProps {
  onSubmit: (data: ScheduleSearchFormData) => void
  agencies: Agency[] | undefined
  isAgenciesLoading: boolean
  isAgenciesError: boolean
}

export default function SearchForm({ onSubmit, agencies, isAgenciesLoading, isAgenciesError }: SearchFormProps) {
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
      date: new Date().toISOString().substring(0, 10), // Todo: cant select lower than today
    },
  })

  const fromId = useWatch({ control, name: 'fromId' })
  const toId = useWatch({ control, name: 'toId' })

  if (isAgenciesLoading) {
    return (
      <div>
        <CircularProgress size={24} className="mr-2" />
        <p>Kalkış/Varış verileri yükleniyor...</p>
      </div>
    )
  }
  if (isAgenciesError || !agencies) {
    return <p>Acente verileri yüklenemedi. Lütfen API'yi kontrol edin.</p>
  }

  return (
    <Paper sx={{
      p: 2,
      borderRadius: 8,
      bgcolor: '#fff',
    }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Controller
              name="fromId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fromId}>
                  <InputLabel id="fromId-label" shrink>Kalkış Yeri</InputLabel>
                  <Select
                    {...field}
                    labelId="fromId-label"
                    label="Kalkış Yeri"
                    displayEmpty
                    disabled={isSubmitting}
                  >
                    <MenuItem value="" disabled>
                      Kalkış Seçin
                    </MenuItem>
                    {agencies.filter(a => a.id !== toId).map(agency => (
                      <MenuItem key={agency.id} value={agency.id}>
                        {agency.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.fromId?.message && (
                    <FormHelperText>
                      {errors.fromId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Controller
              name="toId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.toId}>
                  <InputLabel id="toId-label" shrink>Varış Yeri</InputLabel>
                  <Select
                    {...field}
                    labelId="toId-label"
                    label="Varış Yeri"
                    displayEmpty
                    disabled={isSubmitting}
                  >
                    <MenuItem value="" disabled>
                      Varış Seçin
                    </MenuItem>
                    {agencies.filter(a => a.id !== fromId).map(agency => (
                      <MenuItem key={agency.id} value={agency.id}>
                        {agency.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.toId?.message && (
                    <FormHelperText>
                      {errors.toId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid container size={{ xs: 12, lg: 4 }}>
            <Grid size={{ xs: 12, sm: 8, lg: 6 }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tarih"
                    type="date"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
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
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Aranıyor...' : 'Seferleri Bul'}
              </Button>
            </Grid>

          </Grid>

        </Grid>

      </form>
    </Paper>
  )
}
