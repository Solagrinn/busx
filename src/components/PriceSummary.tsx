import type { TicketSaleRequest } from '../types/booking.ts'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface PriceSummaryProps {
  ticket: TicketSaleRequest
  totalPrice: number
}

export default function PriceSummary({ ticket, totalPrice }: PriceSummaryProps) {
  const { t } = useTranslation('price')

  return (
    <Box>
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom color="primary.main" fontWeight={700}>
        {t('title')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {t('subtitle')}
      </Typography>

      {/* Trip Info */}
      <Card variant="outlined" sx={{ mb: 3, borderLeft: '5px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {t('trip.title')}
          </Typography>
          <Typography>
            {t('trip.id')}
            :
            {ticket.tripId}
          </Typography>
          <Typography>
            {t('trip.seats')}
            :
            {ticket.seats.join(', ')}
          </Typography>

          <Box sx={{ mt: 2, pt: 1, borderTop: '1px dashed #ccc' }}>
            <Grid container justifyContent="space-between">
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <Typography variant="h5" fontWeight="bold">
                  {t('total.label')}
                  :
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }}>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {totalPrice.toFixed(2)}
                  {' '}
                  {t('total.currency')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Passenger Info */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {t('passenger.title')}
          </Typography>

          {ticket.passengers.map(p => (
            <Box key={p.idNo} sx={{ mb: 1.5, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1">
                {t('passenger.seat')}
                {' '}
                {p.seat}
              </Typography>
              <Typography variant="body1">
                {p.firstName}
                {' '}
                {p.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('passenger.id')}
                :
                {p.idNo}
                {' '}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('passenger.gender.label')}
                :
                {' '}
                {p.gender === 'male' ? t('passenger.gender.male') : t('passenger.gender.female')}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #eee' }}>
            <Typography variant="body2">
              {t('contact.email')}
              :
              {ticket.contact.email}
            </Typography>
            <Typography variant="body2">
              {t('contact.phone')}
              :
              {ticket.contact.phone}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
