import type { Schedule } from '../types/schedules.ts'

import {
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'
import ArrowIcon from '../assets/ArrowIcon.tsx'

interface ScheduleListProps {
  schedules: Schedule[]
}

export default function ScheduleList({ schedules }: ScheduleListProps) {
  const navigate = useNavigate()

  const handleSelectTrip = (id: string) => {
    navigate(`/trip/${id}`)
  }

  return (
    <Paper sx={{
      p: 2,
      mt: 2,
      borderRadius: 6,
      backgroundColor: '#fdfdfd',
    }}
    >

      {schedules?.length === 0 && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: '#efefef',

          }}
        >

          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: 'text.disabled' }}
          >
            Bu kriterlerde bir sefer yok
          </Typography>
        </Paper>
      )}

      {schedules?.map((schedule) => {
        return (
          <Paper
            key={schedule.id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: '#fff',
            }}
          >
            <Grid container>
              <Grid size="grow">
                <Grid container spacing={1} alignItems="center">
                  <Grid size={{ xs: 6, md: 3 }}>

                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {schedule.company}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="h4">
                      {format(schedule.arrival, 'HH:mm')}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {schedule.availableSeats}
                      {' '}
                      Koltuk
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="h6" color="success.main">
                      {schedule.price}
                      TL
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size="auto">
                <ArrowIcon onClick={() => { handleSelectTrip(schedule.id) }} size={40}></ArrowIcon>
              </Grid>

            </Grid>
          </Paper>
        )
      })}

    </Paper>
  )
}
