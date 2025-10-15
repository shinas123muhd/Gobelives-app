import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import LanguageCurrencySelector from './LanguageCurrencySelector';

const Footer = () => {
    const companyLinks = [
        {name: 'Home', href: '/home'},
        { name: 'About Us', href: '/aboutus' },
        { name: 'Blogs', href: '/blogs' },
    ];
    const helpList = [
        {name: 'Contact Us', href: '/contactus'},
        { name: 'FAQs', href: '/faqs' },
        { name: 'Terms and Conditions', href: '/terms&conditions' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Site Map', href: '/sitemap' },
    ]
  return (
    <div className='p-14 bg-[#162721] relative font-mulish'>
        {/* <div>
            <Image src={}
        </div> */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 font-mulish '>
        <div className='flex items-center h-full '>
            <div className='h-[103px] w-[180px] flex items-center'>
                <Image src={"/images/FooterLogo.png"} alt='FooterLogo'  height={200} width={200} className='h-full w-full'/>
            </div>
        </div>
            <LanguageCurrencySelector/>
            <div className='flex justify-center'>
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
            <div className='flex justify-center'>
                <div>
                    <h1 className='font-bold text-white/80'>
                    Help
                </h1>
                <div className='flex flex-col gap-2 font-light mt-2 text-white/60'>
                    {helpList.map((item)=>(<Link key={item.name} href={item.href}>
                    {item.name}
                </Link>))}
                </div>
                </div>
            </div>
            
            <div className='flex flex-col gap-5 z-50'>
                <div>
                    <h2 className='text-white/80 font-bold'>Payment methods possible</h2>
                    <div className='z-10'>
                        <Image src={"/images/payments1.png"} alt='PaymentMethods' height={500} width={800} className='mt-2 h-8 w-full'/>
                        <Image src={"/images/payments2.png"} alt='PaymentMethods' height={500} width={800} className='mt-2 h-8 w-full'/>
                    </div>
                </div>
                <div>
                    <h2 className='text-white/80 font-bold'>Company</h2>
                    <p className='text-white/60 font-light mt-2'>Become a Tour guide for Us</p>
                </div>
            </div>
            <div className='absolute top-1/2 -translate-y-1/2 right-10'>
                <div className='h-[400px] w-[400px]'>
                    <Image src = {"/images/FooterMap.png"} alt='FooterMap' height={300} width={300} quality={100} className='h-full w-full object-cover'/>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Footer