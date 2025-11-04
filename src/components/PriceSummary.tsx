import type { TicketSaleRequest } from '../types/booking.ts'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

interface PriceSummaryProps {
  ticket: TicketSaleRequest
  totalPrice: number
}

export default function PriceSummary({ ticket, totalPrice }: PriceSummaryProps) {
  return (

    <Box>
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
    </Box>
  )
}
