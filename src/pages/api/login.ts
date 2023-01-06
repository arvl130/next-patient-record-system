import { scryptSync, timingSafeEqual } from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { z, ZodError } from "zod"
import { prisma } from "../../server/db"

const userCredentials = z.object({
  username: z.string(),
  password: z.string(),
})

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string
    error?: unknown
    user?: {
      id: string
    }
  }>
) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method not allowed",
      })
      return
    }

    const { username, password } = userCredentials.parse({
      username: req.body.username,
      password: req.body.password,
    })

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      res.status(400).json({
        message: "No such user",
      })
      return
    }

    const { password: savedPassword } = user

    const [salt, hashedPasswordFromDb] = savedPassword.split(":")

    const hashedPasswordFromUserBuffer = scryptSync(password, salt, 64)
    const hashedPasswordFromDbBuffer = Buffer.from(hashedPasswordFromDb, "hex")

    if (
      !timingSafeEqual(hashedPasswordFromDbBuffer, hashedPasswordFromUserBuffer)
    ) {
      res.status(401).json({
        message: "Unauthorized",
      })
      return
    }

    res.json({
      message: "Success",
      user: {
        id: username,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({
        message: "Validation error occured",
        error: e,
      })
      return
    }

    if (e instanceof Error) {
      res.status(500).json({
        message: "Generic error occured",
        error: e,
      })
      return
    }

    res.status(500).json({
      message: "Unknown error occured",
      error: e,
    })
  }
}
