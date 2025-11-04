import { z } from 'zod'

export const ContactInfoSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi girin.'),
  phone: z.string()
    .regex(/^\d{10}$/, 'Telefon numarası 10 haneli olmalıdır (örn: 5xxxxxxxxx).'),
})

export const PassengerSchema = z.object({
  seat: z.number().int().positive('Koltuk numarası geçerli olmalıdır.'),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır.'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır.'),
  idNo: z.string()
    .regex(/^\d{11}$/, 'TC Kimlik No 11 haneli rakam olmalıdır.'),
  gender: z.enum(['male', 'female']),
})

export const PassengerFormSchema = z.object({
  contact: ContactInfoSchema,
  passengers: z.array(PassengerSchema)
    .min(1, 'En az bir yolcu bilgisi girilmelidir.')
    .refine(data => data.length <= 5, { // Opsiyonel: Maksimum 5 yolcu sınırı
      message: 'Maksimum 5 yolcuya izin verilir.',
    }),
})

export const TicketSaleRequestSchema = z.object({
  tripId: z.string().min(1, 'Sefer ID gereklidir.'),
  seats: z.array(z.number().int().positive('Koltuk numaraları geçerli olmalıdır.'))
    .min(1, 'En az bir koltuk seçilmelidir.'),
}).extend(PassengerFormSchema.shape)

export const TicketSaleResponseSchema = z.object({
  ok: z.boolean(),
  pnr: z.string().optional(),
  message: z.string(),
})

export type ContactInfo = z.infer<typeof ContactInfoSchema>
export type Passenger = z.infer<typeof PassengerSchema>
export type PassengerFormData = z.infer<typeof PassengerFormSchema>
export type TicketSaleRequest = z.infer<typeof TicketSaleRequestSchema>
export type TicketSaleResponse = z.infer<typeof TicketSaleResponseSchema>
