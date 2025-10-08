import React from 'react'
import { Source_Sans_3, Mulish } from "next/font/google"
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Define fonts
const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const UserLayout = ({children}) => {
  return (
    <div className={`${sourceSansPro.variable} ${mulish.variable} font-sans`}>
      <Navbar />
      <div
        className="bg-[url('/images/BgPattern.png')] bg-repeat bg-center min-h-screen"
        style={{ backgroundSize: 'auto' }}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default UserLayout
