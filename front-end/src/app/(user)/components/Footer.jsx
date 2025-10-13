import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

const Footer = () => {
    const companyLinks = [
        {name: 'Home', href: '/home'},
        { name: 'About Us', href: 'aboutus' },
        { name: 'Blogs', href: '/blogs' },
    ];
    const helpList = [
        
    ]
  return (
    <div className='p-14 bg-[#162721] relative font-mulish'>
        {/* <div>
            <Image src={}
        </div> */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 font-mulish '>
        <div className='h-[103px] w-[180px]'>
                <Image src={"/images/FooterLogo.png"} alt='FooterLogo'  height={103} width={180} className='h-full w-full'/>
            </div>
            <div>
                <h1 className='font-bold text-white/80'>
                    Company
                </h1>
                <div className='flex flex-col gap-2 font-light mt-2 text-white/60'>
                    {companyLinks.map((item)=>(<Link key={item.name} href={item.href}>
                    {item.name}
                </Link>))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer