import React from 'react'
import TopSection from './TopSection'
import ResultsList from './ResultsList'
import TrendingNow from '../home/TrendingNow'

const page = () => {
  return (
    <div>
      <TopSection/>
      <ResultsList/>
      <TrendingNow/>
    </div>
  )
}

export default page