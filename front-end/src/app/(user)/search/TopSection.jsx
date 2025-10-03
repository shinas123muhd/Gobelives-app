import React from 'react'
import PageTitle from '../components/PageTitle'
import FilterBar from '../components/FilterBar'

const TopSection = () => {
  return (
    <div className='w-full bg-black'>
        <div className='relative  w-full px-14'>
            <PageTitle title={"Search Results"} path={"home/search"} pathname={"Home/Search"}/>
            <div className='absolute -translate-x-1/2 left-1/2 -bottom-6'>
                <FilterBar/>
            </div>
        </div>
    </div>
  )
}

export default TopSection