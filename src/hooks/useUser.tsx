import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function useAuthenticatedUser() {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Unauthenticated, redirecting to login page ...")
      router.push("/login")
    }
  }, [router, status])

  return {
    data,
    status,
  }
}

export function useUnauthenticatedUser() {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log("Authenticated, redirecting to dashboard ...")
      router.push("/")
    }
  }, [router, status])

  return {
    data,
    status,
  }
}
