import type { PassengerFormData, TicketSaleRequest } from '../types/booking.ts'
import { Alert, Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import PassengerForm from '../components/PassengerForm.tsx'
import SeatMap from '../components/SeatMap.tsx'
import { useSeatSchema } from '../hooks/useSeatSchema.ts'

export default function SeatSelectionPage() {
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
    return (<Alert severity="error" sx={{ m: 4 }}>URL'den geçerli bir sefer ID'si alınamadı.</Alert>)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Koltuk bilgileri yükleniyor...</Typography>
      </Box>
    )
  }

  if (isError || !seatMap) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Koltuk haritası yüklenirken bir hata oluştu:
        {' '}
        {error?.message || 'Bilinmeyen Hata'}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ color: 'white' }} fontWeight={600} gutterBottom>
        Koltuk Seçimi
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
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
              Seçim Özeti
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Seçilen Koltuklar:
                <span>
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Seçim yapılmadı'}
                </span>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Koltuk Başı Fiyat:
                <span>
                  {seatMap.unitPrice}
                  {' '}
                  TL
                </span>
              </Typography>
            </Box>

            <Box sx={{ borderTop: '2px solid #ccc', pt: 2, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Toplam Tutar:
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {totalPrice.toFixed(2)}
                {' '}
                TL
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2, p: 1, textAlign: 'center' }}>
              Tek seferde maksimum 4 koltuk seçilebilir.
            </Alert>

            {selectedSeats.length > 0 && (
              <PassengerForm onSubmit={handleFormValidate} selectedSeats={selectedSeats} />
            )}

          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
