import type { RawSeatMap, Seat } from '../types/seats.ts'
import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const SEAT_STATUS = {
  EMPTY: 'empty',
  TAKEN: 'taken',
  SELECTED: 'selected',
  UNAVAILABLE: 'unavailable',
}

function createSeatLookup(seats: Seat[]) {
  return seats.reduce((acc, seat) => {
    acc[`r${seat.row}c${seat.col}`] = seat
    return acc
  }, {} as Record<string, Seat>)
}

interface SeatMapProps {
  seatMapData: RawSeatMap
  onSeatSelect: (selectedSeats: number[]) => void
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
        <Box
          sx={{
            ...defaultSeatStyles,
            'backgroundColor': color,
            'width': 25,
            'height': 25,
            '@media (min-width: 500px)': {
              width: 25,
              height: 25,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 'auto' }} alignContent="center">
        <Typography>{children}</Typography>
      </Grid>
    </Grid>
  )
}

export default function SeatMap({ seatMapData, onSeatSelect }: SeatMapProps) {
  const { t } = useTranslation(['common', 'seats'])
  const [selectedSeatNos, setSelectedSeatNos] = useState<number[]>([])

  const { layout, seats, unitPrice } = seatMapData
  const { cols, cells } = layout

  const seatLookup = useMemo(() => createSeatLookup(seats), [seats])

  const handleSeatClick = (seat: Seat) => {
    const MAX_SEATS = 4

    if (seat.status === SEAT_STATUS.TAKEN || seat.status === SEAT_STATUS.UNAVAILABLE)
      return

    const seatNo = seat.no
    let newSelection: number[]

    if (selectedSeatNos.includes(seatNo)) {
      newSelection = selectedSeatNos.filter(no => no !== seatNo)
    }
    else {
      if (selectedSeatNos.length >= MAX_SEATS)
        return
      newSelection = [...selectedSeatNos, seatNo]
    }

    setSelectedSeatNos(newSelection)
    onSeatSelect(newSelection)
  }

  const getCellColor = (row: number, col: number, cellType: number) => {
    const lookupKey = `r${row + 1}c${col + 1}`
    const seat = seatLookup[lookupKey]

    switch (cellType) {
      case 2:
        return cellColors.corridor
      case 3:
        return cellColors.door
      case 0:
      default:
        if (seat) {
          const isSelected = selectedSeatNos.includes(seat.no)
          if (seat.status === SEAT_STATUS.TAKEN || seat.status === SEAT_STATUS.UNAVAILABLE) {
            return cellColors.taken
          }
          else if (isSelected) {
            return cellColors.selected
          }
          else {
            return cellColors.empty
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
              <Typography
                fontWeight={500}
                sx={{ color: 'white' }}
                fontSize={{ xs: '12px', sm: '14px' }}
              >
                {t('driver')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {cells.map((rowArr, rowIndex) =>
          rowArr.map((cellType, colIndex) => {
            const lookupKey = `r${rowIndex + 1}c${colIndex + 1}`
            const seat = seatLookup[lookupKey]
            const isClickableSeat = seat && seat.status === SEAT_STATUS.EMPTY
            const cellColor = getCellColor(rowIndex, colIndex, cellType)

            return (
              <Grid size={{ xs: 1 }} key={lookupKey} justifyItems="center">
                <Button
                  variant="contained"
                  onClick={isClickableSeat ? () => handleSeatClick(seat) : undefined}
                  disabled={!isClickableSeat}
                  sx={{
                    ...defaultSeatStyles,
                    'backgroundColor': cellColor,
                    'minWidth': 0,
                    '&.Mui-disabled': {
                      color: cellType === 3 ? 'primary.main' : 'white',
                      backgroundColor: cellColor,
                    },
                  }}
                  aria-label={seat ? `seat ${seat.no}, ${seat.status}` : ''}
                  title={seat ? `${seat.no} - ${seat.status}` : ''}
                >
                  <Typography>{seat ? seat.no : cellType === 3 ? t('seats:door') : ''}</Typography>
                </Button>
              </Grid>
            )
          }),
        )}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="textSecondary" fontWeight={600}>
          {t('selectedSeats')}
          :
          {selectedSeatNos.length}
        </Typography>
        <Typography variant="body1" color="textSecondary" fontWeight={600} sx={{ mb: 2 }}>
          {t('totalAmount')}
          :
          {calculateTotal.toFixed(2)}
          {' '}
          TRY
        </Typography>
      </Box>

      <Grid container spacing={1}>
        <LegendCell color={cellColors.empty}>{t('seats:empty')}</LegendCell>
        <LegendCell color={cellColors.taken}>{t('seats:taken')}</LegendCell>
        <LegendCell color={cellColors.selected}>{t('seats:selected')}</LegendCell>
      </Grid>
    </Box>
  )
}
