import type { PassengerFormData, TicketSaleRequest } from '../types/booking.ts'
import { Alert, Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import PassengerForm from '../components/PassengerForm.tsx'
import SeatMap from '../components/SeatMap.tsx'
import SelectionSummary from '../components/SelectionSummary.tsx'
import { useSeatSchema } from '../hooks/useSeatSchema.ts'

export default function SeatSelectionPage() {
  const { t } = useTranslation(['seatSelection'])
  const { tripId: routeTripId } = useParams<string>()
  const navigate = useNavigate()
  const { data: seatMap, isLoading, isError, error } = useSeatSchema(routeTripId)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  const handleSeatSelect = (newSelection: number[]) => {
    setSelectedSeats(newSelection)
  }

  const totalPrice = useMemo(() => {
    if (!seatMap)
      return 0
    return selectedSeats.length * seatMap.unitPrice
  }, [selectedSeats, seatMap])

  const handleFormValidate = useCallback((data: PassengerFormData) => {
    if (!routeTripId) {
      console.error('Trip ID is not defined for navigation.')
      return
    }

    const ticket: TicketSaleRequest = {
      tripId: routeTripId,
      seats: selectedSeats,
      contact: data.contact,
      passengers: data.passengers.map((p, index) => ({
        ...p,
        seat: selectedSeats[index] || 0,
      })),
    }

    navigate('/summary', {
      state: {
        ticket,
        totalPrice,
      },
    })
  }, [routeTripId, selectedSeats, totalPrice, navigate])

  if (!routeTripId) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {t('invalidTripId', { ns: 'seatSelection' })}
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {t('loading', { ns: 'seatSelection' })}
        </Typography>
      </Box>
    )
  }

  if (isError || !seatMap) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        <Typography variant="body1" fontWeight="bold">
          {t('errorTitle', { ns: 'seatSelection' })}
        </Typography>
        <Typography variant="body2">
          {error?.message || t('unknownError', { ns: 'seatSelection' })}
        </Typography>
      </Alert>
    )
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: 'white' }}
        fontWeight={600}
        gutterBottom
      >
        {t('title', { ns: 'seatSelection' })}
        {' '}
        -
        {' '}
        {seatMap.tripId}
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
        <Grid size={{ xs: 12, md: 7 }} sx={{ maxWidth: 500 }}>
          <Paper elevation={4} sx={{ borderRadius: 3, p: 2 }}>
            <SeatMap
              seatMapData={seatMap}
              onSeatSelect={handleSeatSelect}
              unitPrice={seatMap.unitPrice}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ maxWidth: 500 }}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#f5f5f5' }}>
            <SelectionSummary
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              unitPrice={seatMap.unitPrice}
            />

            {selectedSeats.length > 0 && (
              <PassengerForm
                onSubmit={handleFormValidate}
                selectedSeats={selectedSeats}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
