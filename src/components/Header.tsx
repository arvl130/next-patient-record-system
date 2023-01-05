import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useDateTime } from "../hooks/useDateTime"

export default function Header() {
  const { date, time } = useDateTime()
  const [isSignOutButtonDisabled, setSignOutButtonDisabled] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    try {
      setSignOutButtonDisabled(true)
      await signOut({ redirect: false })
      setSignOutButtonDisabled(false)
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error occured", e.message)
        return
      }

      console.log("Unknown error occured", e)
    }
  }

  const { data: session } = useSession()
  if (!session) return null

  return (
    <header className="font-[Poppins] text-sky-600 flex justify-between border-b">
      <div className="bg-teal-500 text-white font-bold pl-5 pr-10 py-1 text-right">
        {date}
        <br />
        {time}
      </div>
      <div className="flex items-center gap-8 pr-16">
        <Link
          href="/"
          className={
            router.pathname === "/"
              ? "border border-teal-500 bg-teal-500 text-white px-5 py-1 rounded-full"
              : "border border-teal-500 px-5 py-1 rounded-full"
          }
        >
          View Patients
        </Link>
        <Link
          href="/patients/create"
          className={
            router.pathname === "/patients/create"
              ? "border border-teal-500 bg-teal-500 text-white px-5 py-1 rounded-full"
              : "border border-teal-500 px-5 py-1 rounded-full"
          }
        >
          Add Patient
        </Link>
        <button
          onClick={handleSignOut}
          type="button"
          disabled={isSignOutButtonDisabled}
          className="disabled:text-white transition duration-200"
        >
          <Image
            src="/assets/nav-exit.png"
            alt="LFI Dental Clinic logo"
            width="16"
            height="16"
          />
        </button>
      </div>
    </header>
  )
}
