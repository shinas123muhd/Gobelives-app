import React from 'react'
import { Source_Sans_3 } from "next/font/google"
import Navbar from './components/Navbar'

const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const UserLayout = ({ children }) => {
  return (
    <div className={`font-sans`}> 
    <Navbar />
    <div
        className="bg-[url('/images/BgPattern.png')] bg-repeat bg-center min-h-screen"
        style={{ backgroundSize: 'auto' }}  // Adjust size as needed
      >
        {children}
      </div>
    </div>
  )
}

export default UserLayout