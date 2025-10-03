import React from 'react'
import { MessageCircle } from 'lucide-react'

const HelpCenterPage = () => {
  const faqSections = [
    {
      id: 1,
      title: "Booking Help",
      questions: [
        {
          q: "How do I make a booking?",
          a: "To book a trip, go to the homepage or use the search bar. Select your destination, travel dates, and package, then click 'Book Now.'"
        },
        {
          q: "Can I cancel or change a booking?",
          a: "Yes. Go to Profile > Bookings, select your trip, and choose 'Modify' or 'Cancel.' Cancellation policies may apply."
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept credit/debit cards, UPI, PayPal, and selected wallets."
        }
      ]
    },
    {
      id: 2,
      title: "Rewards Program",
      questions: [
        {
          q: "How do I earn reward points?",
          a: "You earn points every time you book a trip. Points depend on the amount spent and your membership tier."
        },
        {
          q: "How can I redeem my points?",
          a: "Go to Profile > Rewards and click 'Redeem Now.' You can use points for discounts or free upgrades."
        },
        {
          q: "What are the membership tiers?",
          a: "Silver, Gold, and Platinum. Tiers are based on your total earned points."
        }
      ]
    },
    {
      id: 3,
      title: "Vote Trips",
      questions: [
        {
          q: "What is Vote Trip?",
          a: "Vote Trip lets you vote on future travel packages. Popular trips will be organized and made available for booking."
        },
        {
          q: "Where can I vote?",
          a: "Go to Profile > Vote Trips, view the current options, and click 'Vote Now.'"
        },
        {
          q: "Do I get points for voting?",
          a: "Yes! You earn bonus reward points when you vote and the trip wins."
        }
      ]
    },
    {
      id: 4,
      title: "Account & Settings",
      questions: [
        {
          q: "How do I change my email or password?",
          a: "Go to Profile > Settings and update your personal info."
        },
        {
          q: "How can I delete my account?",
          a: "Contact support using the form below and request account deletion."
        }
      ]
    },
    {
      id: 5,
      title: "Hotel Partners / Ventures",
      questions: [
        {
          q: "How do I register my hotel?",
          a: "Go to the Partner section and sign up as a venture. After approval, you can upload photos and manage bookings."
        },
        {
          q: "Can I edit my hotel listing?",
          a: "Yes. Log into your Venture Dashboard and go to Hotel Info."
        },
        {
          q: "Where do I see my hotel's bookings?",
          a: "Check My Bookings in your dashboard to view all guest reservations."
        }
      ]
    }
  ]

  return (
    <div className="text-white bg-[#0B0B0B] min-h-screen rounded-2xl p-6 md:p-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Help Center - GoBeLives</h1>
        <p className="text-white/80 text-lg leading-relaxed">
          Welcome to the GoBeLives Help Center. We're here to assist you with your travel experience, bookings, rewards, and more.
        </p>
      </div>

      <div className="space-y-8">
        {faqSections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-[#006ED2]">◆</span>
              {section.id}. {section.title}
            </h2>
            
            <div className="space-y-4 ml-6">
              {section.questions.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-white/90">{faq.q}</h3>
                  <p className="text-white/70 leading-relaxed ml-4">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      
    </div>
  )
}

export default HelpCenterPage


