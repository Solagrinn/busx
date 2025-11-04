import { Alert, Box, Typography } from '@mui/material'

interface SelectionSummaryProps {
  unitPrice: number
  totalPrice: number
  selectedSeats: number[]
}
export default function SelectionSummary({ unitPrice, totalPrice, selectedSeats }: SelectionSummaryProps) {
  return (

    <>
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
            {unitPrice}
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

    </>

  )
}
