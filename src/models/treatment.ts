import { z } from "zod"
import { CANNOT_BE_EMPTY, UP_TO_191_CHARS_ONLY } from "./validation-messages"

export const GetAllTreatmentsSchema = z.object({
  patientId: z.string(),
})

export type GetAllTreatmentsType = z.infer<typeof GetAllTreatmentsSchema>

export const CreateTreatmentSchema = z.object({
  patientId: z.string(),
  service: z
    .string()
    .min(1, {
      message: CANNOT_BE_EMPTY,
    })
    .max(191, {
      message: UP_TO_191_CHARS_ONLY,
    }),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date",
  }),
  procedure: z.string().min(1, {
    message: CANNOT_BE_EMPTY,
  }),
})

export type CreateTreatmentType = z.infer<typeof CreateTreatmentSchema>

export const EditTreatmentSchema = z.object({
  id: z.string().uuid(),
  service: z.string(),
  serviceDate: z.date(),
  procedure: z.string(),
})

export type EditTreatmentType = z.infer<typeof EditTreatmentSchema>

export const DeleteTreatmentSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteTreatmentType = z.infer<typeof DeleteTreatmentSchema>
