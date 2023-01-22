import { type DefaultSession } from "next-auth"

// Overwrite Session interface so that we can
// include in it the user ID.
declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}
