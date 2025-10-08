import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='p-14 bg-[#162721] relative font-mulish'>
        {/* <div>
            <Image src={}
        </div> */}
        <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5'>
        <div className='h-[103px] w-[180px]'>
                <Image src={"/images/FooterLogo.png"}  height={103} width={180} className='h-full w-full'/>
            </div>
            <div>
                <h1 className=''>
                    Hyy
                </h1>
            </div>
        </div>
    </div>
  )
}

export default Footer