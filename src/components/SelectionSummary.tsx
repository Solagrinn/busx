import { Alert, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface SelectionSummaryProps {
  unitPrice: number
  totalPrice: number
  selectedSeats: number[]
}

export default function SelectionSummary({ unitPrice, totalPrice, selectedSeats }: SelectionSummaryProps) {
  const { t } = useTranslation(['common', 'seats'])

  return (
    <>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
        {t('seats:selectionSummary')}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Typography variant="body1">
          {t('seats:selectedSeats')}
          :
          {' '}
          <span>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : t('seats:noSelection')}
          </span>
        </Typography>

        <Typography variant="body1" sx={{ mt: 1 }}>
          {t('seats:pricePerSeat')}
          :
          {' '}
          <span>
            {unitPrice}
            {' '}
            TL
          </span>
        </Typography>
      </Box>

      <Box
        sx={{
          borderTop: '2px solid #ccc',
          pt: 2,
          mt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {t('totalAmount')}
          :
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="error.main">
          {totalPrice.toFixed(2)}
          {' '}
          TL
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mt: 2, p: 1, textAlign: 'center' }}>
        {t('seats:maxSeatsInfo')}
      </Alert>
    </>
  )
}
