import { type inferAsyncReturnType } from "@trpc/server"
import prisma from "../db/prisma"

export async function createContext() {
  return {
    prisma,
  }
}

export type CreateContextType = inferAsyncReturnType<typeof createContext>
