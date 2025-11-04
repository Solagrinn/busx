// src/types/booking.ts
import i18next from 'i18next'
import { z } from 'zod'

export function getPassengerFormSchema() {
  const t = (key: string) => i18next.t(`validation:${key}`)

  const ContactInfoSchema = z.object({
    email: z.string().email(t('email.invalid')),
    phone: z.string().regex(/^\d{10}$/, t('phone.invalid')),
  })

  const PassengerSchema = z.object({
    seat: z.number().int().positive(t('seat.invalid')),
    firstName: z.string().min(2, t('firstname.short')),
    lastName: z.string().min(2, t('lastname.short')),
    idNo: z.string().regex(/^\d{11}$/, t('id.invalid')),
    gender: z.enum(['male', 'female']),
  })

  const PassengerFormSchema = z.object({
    contact: ContactInfoSchema,
    passengers: z.array(PassengerSchema)
      .min(1, t('passenger.min'))
      .refine(data => data.length <= 5, { message: t('passenger.max') }),
  })

  const TicketSaleRequestSchema = z.object({
    tripId: z.string().min(1, t('tripId.required')),
    seats: z.array(z.number().int().positive(t('seat.invalid')))
      .min(1, t('seat.min')),
  }).extend(PassengerFormSchema.shape)

  const TicketSaleResponseSchema = z.object({
    ok: z.boolean(),
    pnr: z.string().optional(),
    message: z.string(),
  })

  return {
    ContactInfoSchema,
    PassengerSchema,
    PassengerFormSchema,
    TicketSaleRequestSchema,
    TicketSaleResponseSchema,
  }
}

// ✅ Type inference exports
export type ContactInfo = z.infer<ReturnType<typeof getPassengerFormSchema>['ContactInfoSchema']>
export type Passenger = z.infer<ReturnType<typeof getPassengerFormSchema>['PassengerSchema']>
export type PassengerFormData = z.infer<ReturnType<typeof getPassengerFormSchema>['PassengerFormSchema']>
export type TicketSaleRequest = z.infer<ReturnType<typeof getPassengerFormSchema>['TicketSaleRequestSchema']>
export type TicketSaleResponse = z.infer<ReturnType<typeof getPassengerFormSchema>['TicketSaleResponseSchema']>
