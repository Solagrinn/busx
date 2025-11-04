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
import { useTranslation } from 'react-i18next'
import { PassengerFormSchema } from '../types/booking.ts'

interface PassengerFormProps {
  onSubmit: (data: PassengerFormData) => void
  selectedSeats: number[]
}

export default function PassengerForm({ onSubmit, selectedSeats }: PassengerFormProps) {
  const { t } = useTranslation('passenger')

  const {
    handleSubmit,
    control,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(PassengerFormSchema),
    mode: 'onSubmit',
    defaultValues: { contact: { email: '', phone: '' }, passengers: [] },
  })

  const { fields, replace } = useFieldArray({ control, name: 'passengers' })

  useEffect(() => {
    const currentCount = fields.length
    const targetCount = selectedSeats.length
    const currentValues = getValues('passengers')

    if (currentCount !== targetCount) {
      const newPassengers = selectedSeats.map((seatNumber, index) => {
        const existingData = currentValues?.[index]
        return {
          seat: seatNumber,
          firstName: existingData?.firstName || '',
          lastName: existingData?.lastName || '',
          idNo: existingData?.idNo || '',
          gender: existingData?.gender || 'male',
        }
      })
      replace(newPassengers)
    }
    else {
      selectedSeats.forEach((seatNumber, index) => {
        if (getValues(`passengers.${index}.seat`) !== seatNumber) {
          setValue(`passengers.${index}.seat`, seatNumber, { shouldDirty: true })
        }
      })
    }
  }, [selectedSeats, fields.length, getValues, replace, setValue])

  return (
    <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, m: -2, mt: 2, borderRadius: 2, bgcolor: '#fff' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t('contact.title')}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label={t('contact.email')}
                  fullWidth
                  {...register('contact.email')}
                  error={!!errors.contact?.email}
                  helperText={errors.contact?.email?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label={t('contact.phone')}
                  fullWidth
                  {...register('contact.phone')}
                  error={!!errors.contact?.phone}
                  helperText={errors.contact?.phone?.message}
                  placeholder={t('contact.phonePlaceholder')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          {/* Passenger Info */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t('passenger.title')}
            </Typography>
            {selectedSeats.length === 0 && (
              <Box sx={{ p: 2, my: 2 }}>
                <Typography color="textDisabled">{t('passenger.empty')}</Typography>
              </Box>
            )}

            <Grid container spacing={3}>
              {fields.map((field, index) => (
                <Grid size={12} key={field.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('passenger.label')}
                      {' '}
                      {index + 1}
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                      {t('passenger.seat')}
                      :
                      {selectedSeats[index]}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField
                        label={t('passenger.firstName')}
                        fullWidth
                        {...register(`passengers.${index}.firstName`)}
                        error={!!errors.passengers?.[index]?.firstName}
                        helperText={errors.passengers?.[index]?.firstName?.message}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        label={t('passenger.lastName')}
                        fullWidth
                        {...register(`passengers.${index}.lastName`)}
                        error={!!errors.passengers?.[index]?.lastName}
                        helperText={errors.passengers?.[index]?.lastName?.message}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        label={t('passenger.idNo')}
                        fullWidth
                        {...register(`passengers.${index}.idNo`)}
                        error={!!errors.passengers?.[index]?.idNo}
                        helperText={errors.passengers?.[index]?.idNo?.message}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name={`passengers.${index}.gender`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.passengers?.[index]?.gender}>
                            <InputLabel>{t('passenger.gender.label')}</InputLabel>
                            <Select {...field} label={t('passenger.gender.label')}>
                              <MenuItem value="male">{t('passenger.gender.male')}</MenuItem>
                              <MenuItem value="female">{t('passenger.gender.female')}</MenuItem>
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

          {/* Submit */}
          <Grid size={12} sx={{ pt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting || selectedSeats.length === 0}
            >
              {isSubmitting ? t('form.submit.loading') : t('form.submit.next')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
