import { initTRPC, TRPCError, type inferAsyncReturnType } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { unstable_getServerSession } from "next-auth"
import { prisma } from "../db"
import { authOptions } from "../../pages/api/auth/[...nextauth]"

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await unstable_getServerSession(req, res, authOptions)
  return {
    prisma,
    user: session?.user,
  }
}

type CreateContextType = inferAsyncReturnType<typeof createContext>

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
