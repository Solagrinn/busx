import type { PassengerFormData } from '../types/booking.ts'
import { Alert, Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import PassengerForm from '../components/PassengerForm.tsx'
import SeatMap from '../components/SeatMap.tsx'
import { useSeatSchema } from '../hooks/useSeatSchema.ts'
/**
 * src/pages/TripDetailsPage.tsx
 * Bu bileşen, sefer detaylarını çeker, koltuk haritasını render eder ve seçilen koltukları yönetir.
 */

export default function SeatSelectionPage() {
  const { tripId } = useParams<string>()
  const { data: seatMap, isLoading, isError, error } = useSeatSchema(tripId)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])

  const handleSeatSelect = (newSelection: number[]) => {
    setSelectedSeats(newSelection)
  }
  const handleFormSubmit = useCallback((data: PassengerFormData) => {
    // 1. Update the local state with the valid form data

    // 2. Prepare the final payload (matching TicketSaleRequestSchema)
    // NOTE: In a real app, you would perform an API call here.
    const ticketRequestPayload = {
      tripId,
      seats: selectedSeats,
      contact: data.contact,
      passengers: data.passengers.map((p, index) => ({
        ...p,
        // Assign the selected seat number to the passenger object
        seat: selectedSeats[index] || p.seat,
      })),
    }

    console.log('✅ Form Submitted Successfully. Prepared Ticket Sale Payload:', ticketRequestPayload)

    // After setting the state/preparing payload, you would typically:
    // a) Call an API to initiate payment
    // b) Navigate to the payment confirmation page (e.g., router.push('/payment'))
  }, [tripId, selectedSeats])

  const totalPrice = useMemo(() => {
    if (!seatMap)
      return 0
    return selectedSeats.length * seatMap.unitPrice
  }, [selectedSeats, seatMap])

  if (!tripId) {
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
        {/* Koltuk Haritası Bölümü (Sol/Geniş Kısım) */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ maxWidth: 500 }}>
          <Paper elevation={4} sx={{ borderRadius: 3, p: 2 }}>
            <SeatMap
              seatMapData={seatMap}
              onSeatSelect={handleSeatSelect}
              unitPrice={seatMap.unitPrice}
            />
          </Paper>
        </Grid>

        {/* Özet ve Form Bölümü (Sağ Kısım) */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ maxWidth: 500 }}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
              Seçim Özeti
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="body1">
                Seçilen Koltuklar:
                <span className="font-bold ml-2 text-lg">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Seçim yapılmadı'}
                </span>
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Koltuk Başı Fiyat:
                <span className="font-bold ml-2 text-lg">
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
              Tek seferde maksimum 5 koltuk seçilebilir.
            </Alert>
            <PassengerForm onSubmit={handleFormSubmit} selectedSeats={selectedSeats}></PassengerForm>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
