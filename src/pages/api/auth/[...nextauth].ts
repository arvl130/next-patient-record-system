import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getBaseUrl } from "../../../utils/base-url"

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: "KCya2OZ44napEDkNy6gkYhZJuSGze+zgK+kxtYw36RI=",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { username, password } = credentials

        try {
          const response = await fetch(`${getBaseUrl()}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
            }),
          })

          if (!response.ok) return null
          const { user } = await response.json()

          return {
            id: user.id,
            name: "Admin User",
            email: "admin@example.com",
          }
        } catch (e) {
          console.log("An error occured while authorizing:", e)
          return null
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
