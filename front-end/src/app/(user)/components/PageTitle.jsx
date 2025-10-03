import Link from 'next/link'
import React from 'react'

const PageTitle = ({title, path, pathname}) => {
  return (
    <div className=' flex flex-col gap-2 bg-black px-14 py-10 w-full'>
        <h2 className='font-raleway text-2xl'>{title}</h2>
        <Link className='text-sm text-[#6F857D]' href={path}>{pathname}</Link>
    </div>
  )
}

export default PageTitle