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
      return ctx.prisma.treatment.findMany({
        where: input,
      })
    }),
  createOne: protectedProcedure
    .input(CreateTreatmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.treatment.create({
        data: input,
      })
    }),
  editOne: protectedProcedure
    .input(EditTreatmentSchema)
    .mutation(({ ctx, input: { id, service, procedure } }) => {
      return ctx.prisma.treatment.update({
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
      return ctx.prisma.treatment.delete({
        where: input,
      })
    }),
})
