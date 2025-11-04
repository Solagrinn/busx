import type { TicketSaleRequest } from '../types/booking.ts'
import { Alert, Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import PriceSummary from '../components/PriceSummary.tsx'
import { useTicketPurchase } from '../hooks/useTicketPurchase.ts'

interface PurchaseRouterState {
  ticket: TicketSaleRequest
  totalPrice: number
}

export default function SummaryPage() {
  const { t } = useTranslation(['summary'])
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
          <Paper
            sx={{
              px: { xs: 1, md: 4 },
              py: 4,
              borderRadius: 3,
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            <PriceSummary ticket={ticket} totalPrice={totalPrice} />

            {purchaseSuccess && (
              <Alert severity="success" sx={{ mb: 2, justifyContent: 'center' }}>
                <Typography variant="body1" fontWeight="bold">
                  {t('successTitle', { ns: 'summary' })}
                </Typography>
                <Typography variant="body2">
                  {purchaseResponse?.message || t('successMessage', { ns: 'summary' })}
                </Typography>
                <Typography variant="body2">
                  {t('pnrLabel', { ns: 'summary' })}
                  :
                  {purchaseResponse?.pnr}
                </Typography>
              </Alert>
            )}

            {isPurchaseError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {t('errorTitle', { ns: 'summary' })}
                </Typography>
                <Typography variant="body2">
                  {purchaseError?.message || t('errorMessage', { ns: 'summary' })}
                </Typography>
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
                ? (
                    <>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      {t('loading', { ns: 'summary' })}
                    </>
                  )
                : t('confirmButton', { ns: 'summary' })}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate(-1)}
              disabled={isPurchaseLoading || purchaseSuccess}
            >
              {t('editButton', { ns: 'summary' })}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
