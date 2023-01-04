import { type inferAsyncReturnType } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { unstable_getServerSession } from "next-auth"
import prisma from "../db/prisma"
import { authOptions } from "../../pages/api/auth/[...nextauth]"

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await unstable_getServerSession(req, res, authOptions)
  return {
    prisma,
    user: session?.user,
  }
}

export type CreateContextType = inferAsyncReturnType<typeof createContext>
