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
    <div className='p-6 sm:p-10 lg:p-14 bg-[#162721] relative font-mulish overflow-hidden'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-5 font-mulish relative z-10'>
            {/* Logo */}
            <div className='flex items-center justify-center sm:justify-start h-full'>
                <div className='h-[80px] w-[140px] sm:h-[90px] sm:w-[160px] lg:h-[103px] lg:w-[180px] flex items-center'>
                    <Image src={"/images/FooterLogo.png"} alt='FooterLogo' height={200} width={200} className='h-full w-full'/>
                </div>
            </div>

            {/* Language Currency Selector */}
            <div className='flex justify-center sm:justify-start'>
                <LanguageCurrencySelector/>
            </div>

            {/* Company Links */}
            <div className='flex justify-start md:justify-center'>
                <div>
                    <h1 className='font-bold text-white/80 text-sm sm:text-base'>
                        Company
                    </h1>
                    <div className='flex flex-col gap-2 font-light mt-2 text-white/60 text-sm'>
                        {companyLinks.map((item)=>(<Link key={item.name} href={item.href} className='hover:text-white/80 transition-colors'>
                            {item.name}
                        </Link>))}
                    </div>
                </div>
            </div>

            {/* Help Links */}
            <div className='flex justify-start md:justify-center'>
                <div>
                    <h1 className='font-bold text-white/80 text-sm sm:text-base'>
                        Help
                    </h1>
                    <div className='flex flex-col gap-2 font-light mt-2 text-white/60 text-sm'>
                        {helpList.map((item)=>(<Link key={item.name} href={item.href} className='hover:text-white/80 transition-colors'>
                            {item.name}
                        </Link>))}
                    </div>
                </div>
            </div>
            
            {/* Payment & Company Info */}
            <div className='flex flex-col gap-5 z-50'>
                <div>
                    <h2 className='text-white/80 font-bold text-sm sm:text-base'>Payment methods possible</h2>
                    <div className='z-10'>
                        <Image src={"/images/payments1.png"} alt='PaymentMethods' height={500} width={800} className='mt-2 h-6 sm:h-8 w-full'/>
                        <Image src={"/images/payments2.png"} alt='PaymentMethods' height={500} width={800} className='mt-2 h-6 sm:h-8 w-full'/>
                    </div>
                </div>
                <div>
                    <h2 className='text-white/80 font-bold text-sm sm:text-base'>Company</h2>
                    <p className='text-white/60 font-light mt-2 text-sm'>Become a Tour guide for Us</p>
                </div>
            </div>
        </div>

        {/* Background Map - Hidden on mobile/tablet, visible on xl+ */}
        <div className='hidden xl:block absolute top-1/2 -translate-y-1/2 right-10 2xl:right-20 pointer-events-none opacity-30 2xl:opacity-50'>
            <div className='h-[300px] w-[300px] 2xl:h-[400px] 2xl:w-[400px]'>
                <Image src={"/images/FooterMap.png"} alt='FooterMap' height={300} width={300} quality={100} className='h-full w-full object-cover'/>
            </div>
        </div>
    </div>
  )
}

export default Footer