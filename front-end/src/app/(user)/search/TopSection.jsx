import React from 'react'
import PageTitle from '../components/PageTitle'
import FilterBar from '../components/FilterBar'

const TopSection = () => {
  return (
    
        <div className='relative  w-full bg-white '>
            <PageTitle title={"Search Results"} path={"home/search"} pathname={"Home/Search"}/>
            <div className='absolute -bottom-6 left-0 right-0 mx-auto w-fit'>
                <FilterBar/>
            </div>
        </div>
   
  )
}

export default TopSection