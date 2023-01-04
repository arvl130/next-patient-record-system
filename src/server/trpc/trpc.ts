import { initTRPC, TRPCError } from "@trpc/server"
import { type CreateContextType } from "./context"

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<CreateContextType>().create()

// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

const hasUser = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(hasUser)
