import type { ScheduleSearchFormData } from '../types/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  CircularProgress, // For loading state
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material' // MUI Imports

import { Controller, useForm, useWatch } from 'react-hook-form' // Import Controller
import { useAgencies } from '../hooks/useAgencies'
import { ScheduleSearchSchema } from '../types/zodSchemas'

interface SearchFormProps {
  onSubmit: (data: ScheduleSearchFormData) => void
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleSearchFormData>({
    resolver: zodResolver(ScheduleSearchSchema),
    mode: 'onBlur',
    defaultValues: {
      fromId: '',
      toId: '',
      date: new Date().toISOString().substring(0, 10), // Default to today's date
    },
  })

  const {
    data: agencies,
    isLoading: isAgenciesLoading,
    isError: isAgenciesError,
  } = useAgencies()

  // Watch necessary values for dynamic filtering (e.g., cannot select same origin/dest)
  const fromId = useWatch({ control, name: 'fromId' })
  const toId = useWatch({ control, name: 'toId' })


  if (isAgenciesLoading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <CircularProgress size={24} className="mr-2" />
        <p className="text-gray-500">Kalkış/Varış verileri yükleniyor...</p>
      </div>
    )
  }
  if (isAgenciesError || !agencies) {
    return <p className="text-red-500 p-4 text-center">Acente verileri yüklenemedi. Lütfen API'yi kontrol edin.</p>
  }

  return (
  // 3. Form yapısı
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 items-start">

      {/* 3.1. Kalkış Yeri (From) - Controlled by RHF Controller */}
      <Controller
        name="fromId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.fromId}>
            <InputLabel id="fromId-label">Kalkış Yeri</InputLabel>
            <Select
              {...field} // RHF takes control here (value, onChange)
              labelId="fromId-label"
              label="Kalkış Yeri"
              displayEmpty // Allows the placeholder option to be displayed
              disabled={isSubmitting}
            >
              {/* Placeholder/Disabled option */}
              <MenuItem value="" disabled>
                Kalkış Seçin
              </MenuItem>
              {/* Render agency options, excluding the selected destination */}
              {agencies.filter(a => a.id !== toId).map(agency => (
                <MenuItem key={agency.id} value={agency.id}>
                  {agency.name}
                </MenuItem>
              ))}
            </Select>
            {errors.fromId && <p className="mt-1 text-xs text-red-500">{errors.fromId.message}</p>}
          </FormControl>
        )}
      />

      {/* 3.2. Varış Yeri (To) - Controlled by RHF Controller */}
      <Controller
        name="toId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.toId}>
            <InputLabel id="toId-label">Varış Yeri</InputLabel>
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
              {/* Render agency options, excluding the selected origin */}
              {agencies.filter(a => a.id !== fromId).map(agency => (
                <MenuItem key={agency.id} value={agency.id}>
                  {agency.name}
                </MenuItem>
              ))}
            </Select>
            {errors.toId && <p className="mt-1 text-xs text-red-500">{errors.toId.message}</p>}
          </FormControl>
        )}
      />

      {/* 3.3. Tarih Seçimi (Date) - Using MUI TextField with register */}
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tarih"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }} // Ensures the label floats correctly for date type
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        )}
      />

      {/* 3.4. Arama Butonu */}
      <div className="md:mt-0 pt-0 flex items-end">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Aranıyor...' : 'Seferleri Bul'}
        </Button>
      </div>
    </form>
  )
}
