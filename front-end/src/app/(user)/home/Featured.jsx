import React from 'react'
import FeatureCard from '../components/FeatureCard';

const Featured = () => {
    const cardData = [
        {
          id: 1,
          title: "Beaches",
          description: "Wander Rivermoon's sandy shores, filled with sea salt, lazy days, and sunset memories.",
          image: "/images/Beaches.png",
          gradient: "from-blue-400/20 to-cyan-600/40"
        },
        {
          id: 2,
          title: "Mountain",
          description: "Venture into untamed peaks of lifts, breathtaking views and fresh mountain air.",
          image: "/images/Beaches.png",
          gradient: "from-orange-400/30 to-pink-500/40"
        },
        {
          id: 3,
          title: "Cities",
          description: "Explore Rivermoon's historic centers filled with cafés, vibrant culture, and urban adventures.",
          image: "/images/Beaches.png",
          gradient: "from-blue-500/20 to-purple-600/30"
        }
      ];

  return (
    <div className='py-10'>
        <h1 className='text-center text-white text-4xl font-bold font-raleway'>Featured Destinations</h1>
        <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {cardData.map((card, index) => (
          <FeatureCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>

    </div>
  )
}

export default Featured