"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const links = [
  { href: '/profile', label: 'Manage Profile' },
  { href: '/profile/my-trips', label: 'My Trips' },
  { href: '/profile/reward-points', label: 'Reward Points' },
  { href: '/profile/payment-methods', label: 'Payment Methods' },
  { href: '/profile/wish-trip', label: 'Wish Trip' },
  { href: '/profile/help-center', label: 'Help Center' },
  { href: '/logout', label: 'Logout' },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <nav className="custom-scrollbar h-full bg-[#0D0D0D] py-6">
    {/* Profile Section */}
    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          <Image src={"/images/Profileimg.jpg"} alt="Profile" width={120} height={120} className="w-full h-full object-contain" />
        </div>
        {/* Yellow dot indicator */}
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFDD1A] flex justify-center items-center rounded-full border-2 border-white">
            <Image src={"/svgs/edit.svg"} alt="edit" width={10} height={10} />
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg">Jonathan Jacob</h3>
      <div className="flex items-center gap-3 text-gray-400 text-xs mt-1">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          New York
        </span>
        <span>|</span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          15th February
        </span>
      </div>
    </div>

    {/* Menu Links */}
    <ul className="space-y-1">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block w-full  p-4 text-sm transition-colors ${
                isActive
                  ? 'text-white font-medium bg-[#243F36]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
    
  </nav>
  )
}

export default Sidebar





