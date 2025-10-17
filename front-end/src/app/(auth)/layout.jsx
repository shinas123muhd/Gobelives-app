import React from 'react'
import { Source_Sans_3 } from "next/font/google"


const sourceSansPro = Source_Sans_3({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const AuthLayout = ({ children }) => {
  return (
    <div className={` min-h-screen  bg-[#2E4346] ${sourceSansPro.variable} font-sans`}> 

      {children}
    </div>
  )
}

export default AuthLayout