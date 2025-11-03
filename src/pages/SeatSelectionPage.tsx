import { Paper, Typography } from '@mui/material'

export default function SeatSelectionPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">

      <Typography variant="h4" component="h1" sx={{ color: 'white' }} fontWeight={600} gutterBottom>
        BusX Sefer Araması
      </Typography>
      <Paper sx={{
        p: 2,
        mt: 2,
        borderRadius: 6,
        backgroundColor: '#fdfdfd',
      }}
      >
      </Paper>

    </div>
  )
}
