import * as trpcNext from "@trpc/server/adapters/next"
import { rootRouter } from "../../../server/api/routers/root"
import { createContext } from "../../../server/api/trpc"

// export API handler
export default trpcNext.createNextApiHandler({
  router: rootRouter,
  createContext,
})
