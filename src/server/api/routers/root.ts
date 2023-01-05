import { router } from "../trpc"
import { patientsRouter } from "./patients"

export const rootRouter = router({
  patients: patientsRouter,
})

// export type definition of API
export type RootRouter = typeof rootRouter
