import { z } from "zod"
import { CANNOT_BE_EMPTY, UP_TO_191_CHARS_ONLY } from "./validation-messages"

export const SignInSchema = z.object({
  username: z.string().min(1, { message: CANNOT_BE_EMPTY }),
  password: z.string().min(1, { message: CANNOT_BE_EMPTY }),
})

export type SignInType = z.infer<typeof SignInSchema>

export const GetAllPatientSchema = z.object({
  nameFilter: z.string(),
})

export type GetAllPatientType = z.infer<typeof GetAllPatientSchema>

export const DeletePatientSchema = z.object({
  id: z.string(),
})

export type DeletePatientType = z.infer<typeof DeletePatientSchema>

export const CreatePatientSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: CANNOT_BE_EMPTY })
    .max(191, { message: UP_TO_191_CHARS_ONLY }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date",
  }),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  maritalStatus: z.union([
    z.literal("SINGLE"),
    z.literal("MARRIED"),
    z.literal("WIDOWED"),
  ]),
  email: z.string().email().max(191, { message: UP_TO_191_CHARS_ONLY }),
  mobileNumber: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  telephoneNumber: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  palate: z.boolean(),
  badBreath: z.boolean(),
  bleedingInMouth: z.boolean(),
  gumsColorChange: z.boolean(),
  lumpsInMouth: z.boolean(),
  teethColorChange: z.boolean(),
  sensitiveTeeth: z.boolean(),
  clickingSound: z.boolean(),
  pastDentalCareOrTreatments: z
    .string()
    .max(191, { message: UP_TO_191_CHARS_ONLY }),
  heartAilmentOrDisease: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  hospitalAdmission: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  selfMedication: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  allergies: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  operations: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  tumorsOrGrowth: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  diabetes: z.boolean(),
  sinusitis: z.boolean(),
  bleedingGums: z.boolean(),
  hypertension: z.boolean(),
  stomachDisease: z.boolean(),
  bloodDisease: z.boolean(),
  headache: z.boolean(),
  liverDisease: z.boolean(),
  pregnant: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  cold: z.boolean(),
  kidney: z.boolean(),
  familyHistoryOnAny: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
})

export type CreatePatientType = z.infer<typeof CreatePatientSchema>

export const GetPatientSchema = z.object({
  id: z.string().optional(),
})

export type GetPatientType = z.infer<typeof GetPatientSchema>

export const EditPatientSchema = z.object({
  id: z.string(),
  fullName: z
    .string()
    .min(1, { message: CANNOT_BE_EMPTY })
    .max(191, { message: UP_TO_191_CHARS_ONLY }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date",
  }),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  maritalStatus: z.union([
    z.literal("SINGLE"),
    z.literal("MARRIED"),
    z.literal("WIDOWED"),
    z.literal("SEPARATED"),
  ]),
  email: z.string().email().max(191, { message: UP_TO_191_CHARS_ONLY }),
  mobileNumber: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  telephoneNumber: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  palate: z.boolean(),
  badBreath: z.boolean(),
  bleedingInMouth: z.boolean(),
  gumsColorChange: z.boolean(),
  lumpsInMouth: z.boolean(),
  teethColorChange: z.boolean(),
  sensitiveTeeth: z.boolean(),
  clickingSound: z.boolean(),
  pastDentalCareOrTreatments: z
    .string()
    .max(191, { message: UP_TO_191_CHARS_ONLY }),
  heartAilmentOrDisease: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  hospitalAdmission: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  selfMedication: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  allergies: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  operations: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  tumorsOrGrowth: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  diabetes: z.boolean(),
  sinusitis: z.boolean(),
  bleedingGums: z.boolean(),
  hypertension: z.boolean(),
  stomachDisease: z.boolean(),
  bloodDisease: z.boolean(),
  headache: z.boolean(),
  liverDisease: z.boolean(),
  pregnant: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
  cold: z.boolean(),
  kidney: z.boolean(),
  familyHistoryOnAny: z.string().max(191, { message: UP_TO_191_CHARS_ONLY }),
})

export type EditPatientType = z.infer<typeof EditPatientSchema>
