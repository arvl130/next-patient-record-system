import {
  GetAllTreatmentsSchema,
  CreateTreatmentSchema,
  EditTreatmentSchema,
  DeleteTreatmentSchema,
} from "../../../models/treatment"
import { protectedProcedure, router } from "../trpc"

export const treatmentsRouter = router({
  getAll: protectedProcedure
    .input(GetAllTreatmentsSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.treatments.findMany({
        where: input,
      })
    }),
  createOne: protectedProcedure
    .input(CreateTreatmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.treatments.create({
        data: input,
      })
    }),
  editOne: protectedProcedure
    .input(EditTreatmentSchema)
    .mutation(({ ctx, input: { id, service, procedure } }) => {
      return ctx.prisma.treatments.update({
        where: {
          id,
        },
        data: {
          service,
          procedure,
        },
      })
    }),
  deleteOne: protectedProcedure
    .input(DeleteTreatmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.treatments.delete({
        where: input,
      })
    }),
})
