import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getBaseUrl } from "../../../utils/base-url"

export const authOptions: NextAuthOptions = {
  callbacks: {
    // On the first run of this callback, the parameter "user"
    // here will be defined and populated using the return value
    // of the authorize callback.
    //
    // Use that opportunity to obtain the role and id of the user
    // from the authorize callback, and save it to our token as
    // custom claims.
    jwt: async ({ token, user: userFromAuthorizeCallback }) => {
      // This branch will only fire on the first call of this callback.
      if (userFromAuthorizeCallback) {
        const { id, role } = userFromAuthorizeCallback as any
        token.id = id
        token.role = role
      }

      return token
    },
    // The third parameter "user" here will not be defined,
    // because we are not using a database session strategy
    // (this parameter is populated using the database).
    //
    // For this reason, we need to obtain our session information
    // using the custom claims from our token.
    session({ session, token: { id, role } }) {
      if (session.user) {
        if (typeof id === "string") session.user.id = id
        if (typeof role === "string") session.user.role = role
      }

      return session
    },
    // This solution to the issue is documented here:
    // https://github.com/nextauthjs/next-auth/discussions/536#discussioncomment-1863534
  },
  session: {
    strategy: "jwt",
  },
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
            role: "ADMIN",
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
