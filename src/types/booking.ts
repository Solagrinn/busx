import i18next from 'i18next'
import { z } from 'zod'

// 📧 Contact info validation
export const ContactInfoSchema = z.object({
  email: z
    .email(i18next.t('email.invalid', { ns: 'validation' })),
  phone: z
    .string()
    .regex(/^\d{10}$/, i18next.t('phone.invalid', { ns: 'validation' })),
})

// 🧍 Passenger info validation
export const PassengerSchema = z.object({
  seat: z
    .number()
    .int()
    .positive(i18next.t('seat.invalid', { ns: 'validation' })),
  firstName: z
    .string()
    .min(2, i18next.t('firstname.short', { ns: 'validation' })),
  lastName: z
    .string()
    .min(2, i18next.t('lastname.short', { ns: 'validation' })),
  idNo: z
    .string()
    .regex(/^\d{11}$/, i18next.t('id.invalid', { ns: 'validation' })),
  gender: z.enum(['male', 'female']),
})

// 🎫 Full passenger form validation
export const PassengerFormSchema = z.object({
  contact: ContactInfoSchema,
  passengers: z
    .array(PassengerSchema)
    .min(1, i18next.t('passenger.min', { ns: 'validation' }))
    .refine(data => data.length <= 5, {
      message: i18next.t('passenger.max', { ns: 'validation' }),
    }),
})

// 🧾 Ticket sale request validation
export const TicketSaleRequestSchema = z
  .object({
    tripId: z
      .string()
      .min(1, i18next.t('tripId.required', { ns: 'validation' })),
    seats: z
      .array(
        z
          .number()
          .int()
          .positive(i18next.t('seat.invalid', { ns: 'validation' })),
      )
      .min(1, i18next.t('seat.min', { ns: 'validation' })),
  })
  .extend(PassengerFormSchema.shape)

// 📬 Ticket sale response validation
export const TicketSaleResponseSchema = z.object({
  ok: z.boolean(),
  pnr: z.string().optional(),
  message: z.string(),
})

// ✅ Type inference exports
export type ContactInfo = z.infer<typeof ContactInfoSchema>
export type Passenger = z.infer<typeof PassengerSchema>
export type PassengerFormData = z.infer<typeof PassengerFormSchema>
export type TicketSaleRequest = z.infer<typeof TicketSaleRequestSchema>
export type TicketSaleResponse = z.infer<typeof TicketSaleResponseSchema>
