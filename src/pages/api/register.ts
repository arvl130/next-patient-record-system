import { randomBytes, scryptSync } from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { z, ZodError } from "zod"
import { prisma } from "../../server/db"

const userCredentials = z.object({
  username: z.string(),
  password: z.string(),
})

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string
    error?: unknown
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

    if (user) {
      res.status(400).json({
        message: "User exists",
      })
      return
    }

    const salt = randomBytes(16).toString("hex")
    const hashedPassword = scryptSync(password, salt, 64).toString("hex")

    await prisma.user.create({
      data: {
        username,
        password: `${salt}:${hashedPassword}`,
      },
    })

    res.status(201).json({
      message: `New user created`,
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
