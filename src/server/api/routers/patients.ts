import { router, protectedProcedure } from "../trpc"
import {
  CreatePatientSchema,
  EditPatientSchema,
  DeletePatientSchema,
  GetPatientSchema,
  GetAllPatientSchema,
} from "../../../models/patient"
import { treatmentsRouter } from "./treatments"

export const patientsRouter = router({
  getAll: protectedProcedure
    .input(GetAllPatientSchema)
    .query(({ ctx, input }) => {
      if (input.nameFilter === "") return ctx.prisma.patient.findMany()
      return ctx.prisma.patient.findMany({
        where: {
          fullName: {
            contains: input.nameFilter,
          },
        },
      })
    }),
  deleteOne: protectedProcedure
    .input(DeletePatientSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.patient.delete({
        where: {
          id: input.id,
        },
      })
    }),
  createOne: protectedProcedure
    .input(CreatePatientSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.patient.create({
        data: {
          fullName: input.fullName,
          birthDate: new Date(input.birthDate),
          gender: input.gender,
          maritalStatus: input.maritalStatus,
          email: input.email,
          mobileNumber: input.mobileNumber,
          telephoneNumber: input.telephoneNumber,
          dentalHistory: {
            create: {
              palate: input.palate,
              badBreath: input.badBreath,
              bleedingInMouth: input.bleedingInMouth,
              gumsColorChange: input.gumsColorChange,
              lumpsInMouth: input.lumpsInMouth,
              teethColorChange: input.teethColorChange,
              sensitiveTeeth: input.sensitiveTeeth,
              clickingSound: input.clickingSound,
              pastDentalCareOrTreatments: input.pastDentalCareOrTreatments,
            },
          },
          medicalChart: {
            create: {
              heartAilmentOrDisease: input.heartAilmentOrDisease,
              hospitalAdmission: input.hospitalAdmission,
              selfMedication: input.selfMedication,
              allergies: input.allergies,
              operations: input.operations,
              tumorsOrGrowth: input.tumorsOrGrowth,
              diabetes: input.diabetes,
              sinusitis: input.sinusitis,
              bleedingGums: input.bleedingGums,
              hypertension: input.hypertension,
              stomachDisease: input.stomachDisease,
              bloodDisease: input.bloodDisease,
              headache: input.headache,
              liverDisease: input.liverDisease,
              pregnant: input.pregnant,
              cold: input.cold,
              kidney: input.kidney,
              familyHistoryOnAny: input.familyHistoryOnAny,
            },
          },
        },
        include: {
          dentalHistory: true,
          medicalChart: true,
        },
      })
    }),
  getOne: protectedProcedure.input(GetPatientSchema).query(({ ctx, input }) => {
    return ctx.prisma.patient.findFirst({
      where: {
        id: input.id,
      },
      include: {
        medicalChart: true,
        dentalHistory: true,
      },
    })
  }),
  editOne: protectedProcedure
    .input(EditPatientSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.patient.update({
        where: { id: input.id },
        data: {
          fullName: input.fullName,
          birthDate: new Date(input.birthDate),
          gender: input.gender,
          maritalStatus: input.maritalStatus,
          email: input.email,
          mobileNumber: input.mobileNumber,
          telephoneNumber: input.telephoneNumber,
          dentalHistory: {
            update: {
              palate: input.palate,
              badBreath: input.badBreath,
              bleedingInMouth: input.bleedingInMouth,
              gumsColorChange: input.gumsColorChange,
              lumpsInMouth: input.lumpsInMouth,
              teethColorChange: input.teethColorChange,
              sensitiveTeeth: input.sensitiveTeeth,
              clickingSound: input.clickingSound,
              pastDentalCareOrTreatments: input.pastDentalCareOrTreatments,
            },
          },
          medicalChart: {
            update: {
              heartAilmentOrDisease: input.heartAilmentOrDisease,
              hospitalAdmission: input.hospitalAdmission,
              selfMedication: input.selfMedication,
              allergies: input.allergies,
              operations: input.operations,
              tumorsOrGrowth: input.tumorsOrGrowth,
              diabetes: input.diabetes,
              sinusitis: input.sinusitis,
              bleedingGums: input.bleedingGums,
              hypertension: input.hypertension,
              stomachDisease: input.stomachDisease,
              bloodDisease: input.bloodDisease,
              headache: input.headache,
              liverDisease: input.liverDisease,
              pregnant: input.pregnant,
              cold: input.cold,
              kidney: input.kidney,
              familyHistoryOnAny: input.familyHistoryOnAny,
            },
          },
        },
        include: { medicalChart: true, dentalHistory: true },
      })
    }),
  treatments: treatmentsRouter,
})
