import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { SessionProvider } from "next-auth/react"
import { trpc } from "../utils/trpc"
import { Poppins } from "@next/font/google"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>LFI Dental Clinic</title>
        <meta
          name="description"
          content="LFI Dental Clinic - Don't let your agony set it for you."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <div
        className={`${poppins.variable} font-sans text-sky-600 min-h-screen`}
      >
        <Header />
        <Component {...pageProps} />
      </div>
      <Footer />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
