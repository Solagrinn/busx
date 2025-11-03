import type { PassengerFormData } from '../types/booking.ts'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { PassengerFormSchema } from '../types/booking.ts'

interface PassengerFormProps {
  onSubmit: (data: PassengerFormData) => void
  selectedSeats: number[] // Now receiving the selected seats from the parent
}

export default function PassengerForm({ onSubmit, selectedSeats }: PassengerFormProps) {
  const {
    handleSubmit,
    control,
    register,
    setValue, // 💡 Needed to programmatically set the seat number
    getValues, // 💡 Needed to read current form values for persistence
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(PassengerFormSchema),
    mode: 'onSubmit',
    // Use an empty array for passengers initially; useEffect will sync it
    defaultValues: { contact: { email: '', phone: '' }, passengers: [] },
  })

  // Hook to manage the dynamic list of passengers
  const { fields, replace } = useFieldArray({
    control,
    name: 'passengers' as const,
  })

  // 💡 EFFECT: Synchronize the number of fields with the number of selected seats
  useEffect(() => {
    const currentCount = fields.length
    const targetCount = selectedSeats.length
    const currentValues = getValues('passengers')

    if (currentCount !== targetCount) {
      // 1. Resize and apply seat numbers if counts mismatch
      const newPassengers = selectedSeats.map((seatNumber, index) => {
        const existingData = currentValues?.[index]
        return {
          // 💡 Assign the new seat number
          seat: seatNumber,
          // Preserve existing data or use defaults
          firstName: existingData?.firstName || '',
          lastName: existingData?.lastName || '',
          idNo: existingData?.idNo || '',
          gender: existingData?.gender || 'male',
        }
      })
      // Use replace to resize the array and update values, preserving existing input
      replace(newPassengers)
    }
    else {
      // 2. If count matches, just ensure seat numbers are updated
      selectedSeats.forEach((seatNumber, index) => {
        // Only update if the seat number is actually different to avoid unnecessary re-renders
        if (getValues(`passengers.${index}.seat`) !== seatNumber) {
          setValue(`passengers.${index}.seat`, seatNumber, { shouldDirty: true })
        }
      })
    }
  }, [selectedSeats, fields.length, getValues, replace, setValue])

  return (
    <Paper sx={{
      p: { xs: 1, sm: 2, md: 3 },
      m: -2,
      mt: 2,
      borderRadius: 2,
      bgcolor: '#fff',
    }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* --- 1. Contact Information Section --- */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              İletişim Bilgileri (Contact Information)
            </Typography>
            <Grid container spacing={2}>
              {/* Email Input */}
              <Grid size={12}>
                <TextField
                  label="E-posta"
                  fullWidth
                  {...register('contact.email')}
                  error={!!errors.contact?.email}
                  helperText={errors.contact?.email?.message}
                />
              </Grid>
              {/* Phone Input */}
              <Grid size={12}>
                <TextField
                  label="Telefon"
                  fullWidth
                  {...register('contact.phone')}
                  error={!!errors.contact?.phone}
                  helperText={errors.contact?.phone?.message}
                  placeholder="örn: 5xxxxxxxxx"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          {/* --- 2. Passenger Information Section (Dynamic Array) --- */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              Yolcu Bilgileri (Passenger Details)
            </Typography>
            {
              selectedSeats.length === 0 && (
                <Box sx={{ p: 2, my: 2 }}>
                  <Typography color="textDisabled">
                    Lütfen önce koltuk haritasından koltuk seçimi yapın.
                  </Typography>
                </Box>
              )
            }

            <Grid container spacing={3}>
              {/* Map over the fields managed by useFieldArray */}
              {fields.map((field, index) => (
                <Grid size={12} key={field.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Yolcu
                      {' '}
                      {index + 1}
                    </Typography>
                    {/* 💡 Display the assigned seat number */}
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                      Koltuk No:
                      {' '}
                      {selectedSeats[index]}
                    </Typography>
                  </Box>

                  {/* Seat Number (Hidden Input, kept in sync by useEffect) */}
                  <input type="hidden" {...register(`passengers.${index}.seat` as const, { valueAsNumber: true })} />

                  <Grid container spacing={2}>
                    {/* First Name */}
                    <Grid size={12}>
                      <TextField
                        label="Ad"
                        fullWidth
                        {...register(`passengers.${index}.firstName` as const)}
                        error={!!errors.passengers?.[index]?.firstName}
                        helperText={errors.passengers?.[index]?.firstName?.message}
                      />
                    </Grid>
                    {/* Last Name */}
                    <Grid size={12}>
                      <TextField
                        label="Soyad"
                        fullWidth
                        {...register(`passengers.${index}.lastName` as const)}
                        error={!!errors.passengers?.[index]?.lastName}
                        helperText={errors.passengers?.[index]?.lastName?.message}
                      />
                    </Grid>
                    {/* ID No */}
                    <Grid size={12}>
                      <TextField
                        label="TC Kimlik No"
                        fullWidth
                        {...register(`passengers.${index}.idNo` as const)}
                        error={!!errors.passengers?.[index]?.idNo}
                        helperText={errors.passengers?.[index]?.idNo?.message}
                      />
                    </Grid>
                    {/* Gender Select */}
                    <Grid size={12}>
                      <Controller
                        name={`passengers.${index}.gender` as const}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.passengers?.[index]?.gender}>
                            <InputLabel>Cinsiyet</InputLabel>
                            <Select
                              {...field}
                              label="Cinsiyet"
                            >
                              <MenuItem value="male">Erkek (Male)</MenuItem>
                              <MenuItem value="female">Kadın (Female)</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* --- 3. Submission Button --- */}
          <Grid size={12} sx={{ pt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting || selectedSeats.length === 0}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Yolcu Bilgilerini Onayla'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
