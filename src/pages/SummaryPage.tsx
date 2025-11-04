import type { TicketSaleRequest } from '../types/booking.ts'
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useTicketPurchase } from '../hooks/useTicketPurchase.ts'

interface PurchaseRouterState {
  ticket: TicketSaleRequest
  totalPrice: number
}
export default function SummaryPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as PurchaseRouterState

  if (!state || !state.ticket) {
    navigate('/')
  }

  const ticket = state.ticket
  const totalPrice = state.totalPrice

  const {
    mutateAsync: finalizePurchase,
    data: purchaseResponse,
    isPending: isPurchaseLoading,
    isError: isPurchaseError,
    error: purchaseError,
  } = useTicketPurchase()

  const handlePurchase = useCallback(async () => {
    if (!ticket.tripId || !ticket.seats.length || !ticket.contact || !ticket.passengers.length) {
      console.error('Purchase pre-requisites missing.')
      return
    }

    try {
      await finalizePurchase(ticket)
    }
    catch (error) {
      console.error('❌ Ticket Sale Mutation Failed.', error)
    }
  }, [finalizePurchase, ticket])

  const purchaseSuccess = !!purchaseResponse && purchaseResponse.ok

  return (
    <Box sx={{ mt: 8 }}>
      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, md: 8, lg: 6 }}>
          <Paper sx={{
            px: { xs: 1, md: 4 },
            py: 4,
            borderRadius: 3,
            bgcolor: '#fff',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="primary.main" fontWeight={700}>
              Bilet Onayı ve Ödeme
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Lütfen bilgileri kontrol edin ve satın alma işlemini tamamlayın.
            </Typography>

            <Card variant="outlined" sx={{ mb: 3, borderLeft: '5px solid', borderColor: 'primary.main' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">Sefer Bilgileri</Typography>
                <Typography>
                  Sefer ID:
                  {ticket.tripId}

                </Typography>
                <Typography>
                  Seçilen Koltuklar:
                  {ticket.seats.join(', ')}

                </Typography>

                <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed #ccc' }}>
                  <Grid container justifyContent="space-between">
                    <Grid size={{ xs: 12, sm: 'auto' }}><Typography variant="h5" fontWeight="bold">Toplam Tutar:</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        {totalPrice.toFixed(2)}
                        {' '}
                        TL
                      </Typography>
                    </Grid>

                  </Grid>

                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">Yolcu ve İletişim</Typography>

                {ticket.passengers.map(p => (
                  <Box key={p.idNo} sx={{ mb: 1.5, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body1">
                      Koltuk
                      {' '}
                      {p.seat}

                    </Typography>
                    <Typography variant="body1">

                      {p.firstName}
                      {' '}
                      {p.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      TCKN:
                      {' '}
                      {p.idNo}
                      {' '}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cinsiyet:
                      {p.gender === 'male' ? 'Erkek' : 'Kadın'}
                    </Typography>
                  </Box>
                ))}

                <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #eee' }}>
                  <Typography variant="body2">
                    E-posta:
                    {ticket.contact.email}
                  </Typography>
                  <Typography variant="body2">
                    Telefon:
                    {ticket.contact.phone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {purchaseSuccess && (
              <Alert severity="success" sx={{ mb: 2, justifyContent: 'center' }}>

                <Typography variant="body1" fontWeight="bold">Bilet Başarıyla Satın Alındı!</Typography>
                <Typography variant="body2">{purchaseResponse?.message}</Typography>
                <Typography variant="body2">
                  PNR:
                  {' '}
                  {purchaseResponse?.pnr}
                </Typography>

              </Alert>
            )}

            {isPurchaseError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">Satın Alma Hatası:</Typography>
                <Typography variant="body2">{purchaseError?.message || 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.'}</Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              sx={{ height: 56, mb: 1 }}
              onClick={handlePurchase}
              disabled={isPurchaseLoading || purchaseSuccess}
            >
              {isPurchaseLoading
                ? <CircularProgress size={24} color="inherit" />
                : 'ÖDEMEYİ ONAYLA VE BİLETİ AL'}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate(-1)}
              disabled={isPurchaseLoading || purchaseSuccess}
            >
              Bilgileri Düzenle
            </Button>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
