import {
  GetAllTreatmentsSchema,
  CreateTreatmentSchema,
  EditTreatmentSchema,
  DeleteTreatmentSchema,
} from "../../../models/treatment"
import { publicProcedure, router } from "../trpc"

export const treatmentsRouter = router({
  getAll: publicProcedure
    .input(GetAllTreatmentsSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.treatments.findMany({
        where: input,
      })
    }),
  createOne: publicProcedure
    .input(CreateTreatmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.treatments.create({
        data: input,
      })
    }),
  editOne: publicProcedure
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
  deleteOne: publicProcedure
    .input(DeleteTreatmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.treatments.delete({
        where: input,
      })
    }),
})
