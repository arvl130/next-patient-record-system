import Image from "next/image"
import { ZodError } from "zod"
import { FormEvent, FormEventHandler, useRef, useState } from "react"
import { useUnauthenticatedUser } from "../hooks/useUser"
import Loading from "../components/Loading"
import { SignInSchema, SignInType } from "../models/patient"
import { signIn } from "next-auth/react"
import { ErrorDialog } from "../components/Dialog"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function Login() {
  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false)
  const [errorDialogMessage, setErrorDialogMessage] = useState({
    title: "",
    body: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
  })
  const onSubmit: SubmitHandler<SignInType> = async (formData) => {
    try {
      const { username, password } = SignInSchema.parse(formData)

      const signInResponse = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (signInResponse && signInResponse.ok) return

      // If response is not OK, show an error.
      setErrorDialogVisible(true)
      setErrorDialogMessage({
        title: "Incorrect username or password",
        body: "The username or password you entered is incorrect. Please try again.",
      })
    } catch (e) {
      if (e instanceof Error) {
        console.log("Generic error occured:", e.message)
        setErrorDialogVisible(true)
        setErrorDialogMessage({
          title: "An error occured",
          body: e.message,
        })
        return
      }

      console.log("Unknown error occured:", e)
    }
  }

  const { status } = useUnauthenticatedUser()
  if (status !== "unauthenticated") return <Loading />

  return (
    <>
      <main className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center pt-24 mb-3">
          <Image
            src="/assets/lfi-logo.png"
            alt="LFI Dental Clinic logo"
            width="80"
            height="80"
          />
        </div>
        <h1 className="text-center text-2xl mb-8">
          Welcome to LFI Dental Clinic!
        </h1>
        <form
          className="border border-teal-400 max-w-md mx-auto rounded-lg px-8 py-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-[6rem_1fr] items-center mb-6">
            <label>Username:</label>
            <input
              type="text"
              {...register("username")}
              className="w-full border border-teal-400 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-teal-300/40"
            />
            <div></div>
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </div>
          <div className="grid grid-cols-[6rem_1fr] items-center mb-6">
            <label>Password:</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-teal-400 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-teal-300/40"
            />
            <div></div>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 border border-teal-400 rounded-full font-medium hover:bg-teal-400 hover:text-white transition duration-200 focus:bg-teal-400 focus:text-white focus:outline-none focus:ring focus:ring-teal-300/40"
            >
              Login
            </button>
          </div>
        </form>
      </main>

      {/* Dialog for showing errors. */}
      {isErrorDialogVisible && (
        <ErrorDialog
          title={errorDialogMessage.title}
          body={errorDialogMessage.body}
          okFn={() => {
            setErrorDialogVisible(false)
          }}
        />
      )}
    </>
  )
}
