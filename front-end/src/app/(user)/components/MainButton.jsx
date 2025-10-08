import Image from 'next/image'

import React from 'react' 
const MainButton = ({text}) => {
   return (
     <button className={`relative cursor-pointer bg-[#FFD700] whitespace-nowrap text-black tracking-wider hover:bg-yellow-500 font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg overflow-hidden`} 
     style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}>
       {text} 
       <div> 
        <Image src={"/svgs/ButtonStar.svg"} alt='Star' width={24} height={24} className='h-8 w-8 object-contain'/> 
       </div> 
      </button>
       ) 
      } 
       export default MainButton