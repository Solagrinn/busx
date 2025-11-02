import { z } from 'zod'

export const ScheduleSearchSchema = z.object({
  fromId: z.string().min(1, 'Kalkış yeri seçimi zorunludur.'),
  toId: z.string().min(1, 'Varış yeri seçimi zorunludur.'),
  date: z.string().min(1, 'Tarih seçimi zorunludur.'),
}).refine(data => data.fromId !== data.toId, {
  message: 'Kalkış ve varış yerleri aynı olamaz.',
  path: ['toId'],
})

export type ScheduleSearchFormData = z.infer<typeof ScheduleSearchSchema>
