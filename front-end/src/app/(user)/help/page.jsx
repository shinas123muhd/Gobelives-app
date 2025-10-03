import React from 'react'
import PageTitle from '../components/PageTitle'
import FAQSection from './FAQSection'
import TravelAssistant from './TravelAssistant'
import ContactFormSection from './ContactForm'

const page = () => {
  return (
    <div>
        <PageTitle title={"Help Center"} path={"/help"} pathname={"home/help"}/>
        <div className='p-14'>
        <p className='w-1/2 text-lg text-[#E4E4D7]'>Welcome to the Gobelieve Help Page! <br /> Here you’ll find answers to common questions and helpful guides to make your experience smooth and enjoyable.</p>
        <FAQSection/>
        <TravelAssistant/>
        <ContactFormSection/>
        
    </div>
    </div>
  )
}

export default page