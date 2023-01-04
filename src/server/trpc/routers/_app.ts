import { router } from "../trpc"
import { patientsRouter } from "./patients"

export const appRouter = router({
  patients: patientsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
