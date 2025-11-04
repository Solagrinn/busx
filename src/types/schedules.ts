import i18next from 'i18next' // ✅ direct import for schema-level i18n
import { z } from 'zod'

export const ScheduleSearchSchema = z
  .object({
    fromId: z
      .string()
      .min(1, i18next.t('schedule.fromId', { ns: 'validation' })),
    toId: z
      .string()
      .min(1, i18next.t('schedule.toId', { ns: 'validation' })),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, i18next.t('schedule.date', { ns: 'validation' })),
  })
  .refine(data => data.fromId !== data.toId, {
    message: i18next.t('schedule.sameRoute', { ns: 'validation' }),
    path: ['toId'],
  })
export const AgencySchema = z.object({
  id: z.string().min(1, 'Ajans ID gereklidir.'),
  name: z.string().min(2, 'Ajans adı gereklidir.'),
})

export const RawScheduleSchema = z.object({
  id: z.string().min(1, 'Sefer ID gereklidir.'),
  company: z.string().min(1, 'Şirket adı gereklidir.'),
  from: z.string().min(1, 'Kalkış şehri/yeri gereklidir.'),
  to: z.string().min(1, 'Varış şehri/yeri gereklidir.'),

  departure: z.string().min(1, 'Kalkış saati string olarak gereklidir.'),
  arrival: z.string().min(1, 'Varış saati string olarak gereklidir.'),

  price: z.number().positive('Fiyat pozitif bir sayı olmalıdır.'),
  availableSeats: z.number().int().min(0, 'Mevcut koltuk sayısı geçersiz.'),
})

/**
 * Type used for raw API list response validation.
 */
export type RawSchedule = z.infer<typeof RawScheduleSchema>

/**
 * Type used for Agency/Terminal list.
 */
export type Agency = z.infer<typeof AgencySchema>

/**
 * The final processed schedule type used in the application.
 * Dates are converted from string (RawSchedule) to Date objects.
 */
export type Schedule = Omit<RawSchedule, 'departure' | 'arrival'> & {
  departure: Date
  arrival: Date
}

/**
 * Type for schedule search form data, used for validation and type inference.
 */
export type ScheduleSearchFormData = z.infer<typeof ScheduleSearchSchema>
