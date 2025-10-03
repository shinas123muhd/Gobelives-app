import Image from 'next/image'
import React from 'react'
import { NAV_LINKS } from '../constants'
import Link from 'next/link'
import ShadowButton from './ShadowButton'

const Navbar = () => {
  return (
    <div className='bg-[#2E4346] py-5 w-full border-b border-[#B3BEBA] px-12 flex justify-between z-50'>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 h-8 w-36 ">
                <Image src="/svgs/LogoText.svg" alt="logo" width={100} height={100} className='h-full w-auto object-contain' />
            </div>
        </div>
        <div className="flex items-center gap-12">
  <div className="flex gap-8">
    {NAV_LINKS.map((link) => (
      <Link 
        key={link.path} 
        href={link.path} 
        className="text-white whitespace-nowrap hover:text-primary transition-colors"
      >
        {link.title}
      </Link>
    ))}
  </div>
  <div className='flex items-center gap-5'>
  <div>
    <ShadowButton
    text='Login'
    textColor='#000000'
    borderColor='#000000'
    bgColor='#FFD700'
    shadowBg='black'
    width={36}

    />
  </div>
  <div>
    <ShadowButton
    text='Register'
    textColor='#FFD700'
    borderColor='#FFD700'
    bgColor='#0F1B17'
    shadowBg='black'
    width={40}
    />
  </div>
  </div>
</div>
    </div>
  )
}

export default Navbar