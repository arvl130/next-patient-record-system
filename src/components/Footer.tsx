import { useSession } from "next-auth/react"

export default function Footer() {
  const { data: session } = useSession()
  if (!session) return null

  return (
    <footer className="font-[Poppins] flex justify-center bg-teal-500 text-white py-3">
      Angelo Geulin &copy; 2022
    </footer>
  )
}
