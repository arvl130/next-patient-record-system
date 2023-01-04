import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin"
        )
          return {
            id: "1234",
            name: "J Smith",
            email: "jsmith@example.com",
            some: "a",
            custom: "b",
            properties: "c",
          }

        return null
      },
    }),
  ],
}

export default NextAuth(authOptions)
