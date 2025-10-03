import React from 'react'
import PageTitle from '../components/PageTitle'
import Section1 from './Section1'
import Section2 from './Section2'

const page = () => {
  return (
    <div>
        <PageTitle title={"Blogs"} path={"/blogs"} pathname={"home/Blogs"}/>
        <Section1/>
        <Section2/>
    </div>
  )
}

export default page