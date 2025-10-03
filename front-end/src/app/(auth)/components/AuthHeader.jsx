import Image from 'next/image'
import React from 'react'

const AuthHeader = () => {
  return (
    <div className='bg-[#2E4346] py-5 w-full border-b border-[#B3BEBA] px-12 flex justify-between'>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 h-8 w-36 ">
                <Image src="/svgs/LogoText.svg" alt="logo" width={100} height={100} className='h-full w-auto object-contain' />
            </div>
        </div>
        <div className='flex items-center gap-12'>
            <div className='relative w-40  py-7 bg-black'>
                <div className='absolute bottom-2 left-2 w-full h-full border-2 border-primary bg-[#0F1B17] flex justify-center items-center gap-2'>
                  <h2 className='text-primary font-bold text-medium'>Profile</h2>
                  <div className='w-10 h-10 bg-[#0F1B17]  flex items-center justify-center p-1 overflow-hidden'>
                    <Image src="/images/Profile.jpg" alt="profile" width={20} height={20} className='rounded-full h-full w-full object-cover'/>
                  </div>
                  <div>
                    <Image src="/svgs/ArrowDown.svg" alt="arrow" width={20} height={20} />
                  </div>
                </div>
            </div>
            <div className='w-10 h-10 bg-[#0F1B17] rounded-full flex items-center justify-center p-1'>
              <Image src="/svgs/Home.svg" alt="user" width={20} height={20} />
            </div>
        </div>
    </div>
  )
}

export default AuthHeader