import type { RawSeatMap, Seat } from '../types/seats.ts'
import { Box, Grid, Typography } from '@mui/material'
/**
 * src/components/SeatMap.tsx
 * Renders the interactive bus seat layout based on API data.
 */
import React, { useMemo, useState } from 'react'

// Zod Enum'larını kullanmak için bir sabit oluşturalım (daha kolay erişim için)
const SEAT_STATUS = {
  EMPTY: 'empty',
  TAKEN: 'taken',
  SELECTED: 'selected',
  UNAVAILABLE: 'unavailable',
}

// Helper function to map seat objects to a quick lookup map (row-col key)
function createSeatLookup(seats: Seat[]) {
  // 💡 PERFORMANS: Bu harita, O(1) hızında koltuğu bulmak için gereklidir.
  return seats.reduce((acc, seat) => {
    // Key format: "r1c2"
    acc[`r${seat.row}c${seat.col}`] = seat
    return acc
  }, {} as Record<string, Seat>)
}

interface SeatMapProps {
  // The full validated seat map data from the useSeatMap hook
  seatMapData: RawSeatMap
  // Handler for when a seat is selected or deselected
  onSeatSelect: (selectedSeats: number[]) => void
  // The unit price for display (alınan verinin tekrar gönderilmesi)
  unitPrice: number
}

const cellColors = {
  empty: '#9fcaf4',
  taken: '#4c6278',
  corridor: 'transparent',
  door: 'transparent',
  selected: '#007df8',
}

const defaultSeatStyles = {
  'width': 35,
  'height': 35,

  '@media (min-width: 500px)': {
    width: 50,
    height: 50,
  },
  'borderRadius': 1,
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'userSelect': 'none',
}

function LegendCell({ color, children }: { color: string, children?: React.ReactNode }) {
  return (
    <Grid container size={{ xs: 12, sm: 4 }} spacing={1}>
      <Grid>
        <Box sx={{ ...defaultSeatStyles, 'backgroundColor': color, 'width': 25, 'height': 25, '@media (min-width: 500px)': {
          width: 25,
          height: 25,
        } }}
        >
        </Box>
      </Grid>
      <Grid size={{ xs: 'auto' }} alignContent="center">
        <Typography>{children}</Typography>
      </Grid>
    </Grid>

  )
}

export default function SeatMap({ seatMapData, onSeatSelect, unitPrice }: SeatMapProps) {
  const [selectedSeatNos, setSelectedSeatNos] = useState<number[]>([])

  const { layout, seats } = seatMapData
  const { cols, cells } = layout

  // Memoize the seat data lookup for performance.
  const seatLookup = useMemo(() => createSeatLookup(seats), [seats])

  // Handler for seat clicks
  const handleSeatClick = (seat: Seat) => {
    // Maksimum 5 koltuk kuralı
    const MAX_SEATS = 5

    // Ignore taken, unavailable, or non-seat elements
    if (seat.status === SEAT_STATUS.TAKEN || seat.status === SEAT_STATUS.UNAVAILABLE) {
      return
    }

    const seatNo = seat.no
    let newSelection: number[]

    if (selectedSeatNos.includes(seatNo)) {
      // Deselect seat
      newSelection = selectedSeatNos.filter(no => no !== seatNo)
    }
    else {
      if (selectedSeatNos.length >= MAX_SEATS) {
        return
      }
      newSelection = [...selectedSeatNos, seatNo]
    }

    setSelectedSeatNos(newSelection)
    onSeatSelect(newSelection)
  }

  const getCellClasses = (row: number, col: number, cellType: number) => {
    const lookupKey = `r${row + 1}c${col + 1}`
    const seat = seatLookup[lookupKey]

    switch (cellType) {
      case 2:
        return { backgroundColor: cellColors.corridor }
      case 3:
        return { backgroundColor: cellColors.door }

      case 0:
      default:
        if (seat) {
          const isSelected = selectedSeatNos.includes(seat.no)

          if (seat.status === SEAT_STATUS.TAKEN || seat.status === SEAT_STATUS.UNAVAILABLE) {
            // Dolu veya Kullanılamaz
            return { backgroundColor: cellColors.taken }
          }
          else if (isSelected) {
            // Seçili
            return { backgroundColor: cellColors.selected, cursor: 'pointer' }
          }
          else {
            // Boş
            return { backgroundColor: cellColors.empty, cursor: 'pointer' }
          }
        }
        return 'transparent'
    }
  }

  const calculateTotal = useMemo(() => {
    return selectedSeatNos.length * unitPrice
  }, [selectedSeatNos, unitPrice])

  return (
    <Box>
      <Grid container spacing={2} columns={cols}>
        <Grid container size={{ xs: 12 }}>
          <Grid size={{ xs: 1 }} justifyItems="center">
            <Box sx={{ backgroundColor: 'primary.main', ...defaultSeatStyles }}>
              <Typography fontWeight={500} sx={{ color: 'white' }}>Şoför</Typography>
            </Box>
          </Grid>
        </Grid>

        {cells.map((rowArr, rowIndex) =>
          rowArr.map((cellType, colIndex) => {
            const lookupKey = `r${rowIndex + 1}c${colIndex + 1}`
            const seat = seatLookup[lookupKey]

            const isClickableSeat = seat && (seat.status === SEAT_STATUS.EMPTY)

            return (
              <Grid size={{ xs: 1 }} key={lookupKey} justifyItems="center">
                <Box
                  key={lookupKey}

                  sx={{ backgroundColor: getCellClasses(rowIndex, colIndex, cellType), ...defaultSeatStyles }}
                  onClick={isClickableSeat ? () => handleSeatClick(seat) : undefined}
                  title={seat ? `${seat.no} - ${seat.status}` : ''}
                >
                  <Typography>{seat ? seat.no : (cellType === 3 ? 'Kapı' : '')}</Typography>

                  {seat && selectedSeatNos.includes(seat.no) && (
                    <span>✓</span>
                  )}
                </Box>
              </Grid>
            )
          }),
        )}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="textSecondary" fontWeight={600}>
          Seçilen Koltuk Sayısı:
          {' '}
          {selectedSeatNos.length}
        </Typography>
        <Typography variant="body1" color="textSecondary" fontWeight={600} sx={{ mb: 2 }}>
          Toplam Tutar:
          {' '}
          {calculateTotal.toFixed(2)}
          {' '}
          TL

        </Typography>
      </Box>

      <Grid container spacing={1}>
        <LegendCell color={cellColors.empty}>Boş</LegendCell>
        <LegendCell color={cellColors.taken}>Dolu</LegendCell>
        <LegendCell color={cellColors.selected}>Seçili</LegendCell>
      </Grid>
    </Box>
  )
}
