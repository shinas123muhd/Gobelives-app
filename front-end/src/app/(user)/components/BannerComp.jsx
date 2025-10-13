import Image from 'next/image'
import React from 'react'

const BannerComp = ({image, title, mainTitle}) => {
  return (
    <div className="min-h-screen w-full relative ">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        height={1080}
        width={1920}
        quality={100}
        priority

        className="object-cover object-center"
      />
      <div className='absolute inset-0  bg-white/20'></div>
      {/* Bottom Fill Image */}
      <div className="absolute -bottom-5 w-full z-10">
  <Image
    src="/images/BottomFill.png"
    alt="Bottom Zigzag Decoration"
    width={1920}   // real width of the image
    height={200}   // real height of the image
    className="w-full h-auto"
  />
</div>
{mainTitle && <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 '>
    <h1 className='text-9xl font-raleway whitespace-nowrap font-bold '>{mainTitle}</h1>
</div>}
</div>
  )
}

export default BannerComp