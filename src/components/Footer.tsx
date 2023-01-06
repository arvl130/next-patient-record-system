import { useSession } from "next-auth/react"

export default function Footer() {
  const { data: session } = useSession()
  if (!session) return null

  return (
    <footer className="font-[Poppins] font-medium flex justify-center bg-teal-500 text-white py-4">
      Angelo Geulin &copy; 2022
    </footer>
  )
}
