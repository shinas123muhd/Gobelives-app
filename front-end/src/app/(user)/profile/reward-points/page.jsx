import { Sparkles } from 'lucide-react'
import React from 'react'

const RewardPointsPage = () => {
  const activities = [
    { date: 'Apr 25, 2025', description: 'Booked City Hotel', points: '+300' },
    { date: 'Apr 26, 2025', description: 'Redeemed', points: '-200' },
    { date: 'Apr 26, 2025', description: 'Booked Beach Resort', points: '+450' },
    { date: 'Apr 27, 2025', description: 'Cancelled Mountain Lodge', points: '-120' },
    { date: 'Apr 28, 2025', description: 'Booked River Side Inn', points: '+350' },
    { date: 'Apr 29, 2025', description: 'Redeemed', points: '-250' },
    { date: 'Apr 30, 2025', description: 'Booked Luxury Spa', points: '+500' }
  ]
  return (
    <div className="text-white bg-[#0B0B0B] rounded-2xl p-6 md:p-8 ">
      <h1 className="text-2xl font-semibold mb-6">Reward Points</h1>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="bg-[#1B2B22]/80 border border-white/10 rounded-xl px-5 py-4 w-fit min-w-[260px] shadow-md">
          <p className="text-sm text-white/80">Reward Points Summary Card</p>
          <p className="mt-2 text-2xl font-semibold">2000.00 <span className="text-white/70 text-base align-middle">Points</span></p>
        </div>

        <button className="ml-auto bg-[#FFDD1A] hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-xl ring-2 ring-[#362B0040] ring-inset transition-colors duration-200 inline-flex items-center gap-2">
          Redeem Now
          <Sparkles className="w-5 h-5 text-black transition-colors duration-200" />
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Rewards Activity</h2>

        <div className="grid grid-cols-12 text-sm text-white/80 mb-2 px-2 w-1/2">
          <div className="col-span-3">Date</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-right">Points</div>
        </div>

        <div className="space-y-2">
          {activities.map((a, idx) => (
            <div key={idx} className="grid grid-cols-12 items-center bg-[#1B2B22]/70 border border-[#2C4A3D] w-1/2 rounded-sm px-3 py-2">
              <div className="col-span-3 text-white/80">{a.date}</div>
              <div className="col-span-5">{a.description}</div>
              <div className={`col-span-2 text-right font-medium ${a.points.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>{a.points}</div>
            </div>
          ))}
           <div className="flex justify-end mt-2">
          <button className="text-[#FFDD1A] text-sm hover:underline">View More</button>
        </div>
        </div>

       
      </div>
    </div>
  )
}

export default RewardPointsPage


