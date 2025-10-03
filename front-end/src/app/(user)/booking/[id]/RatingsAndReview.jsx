"use client"
import React, { useState } from 'react'
import ReviewCard from './ReviewCard';
import ReviewFilter from './ReviewFilter';
import ProgressBar from '../../components/ProgressBar';
import StarRating from '../../components/StarRating';

const RatingsAndReview = () => {
    const [showAll, setShowAll] = useState(false);
    // Main Customer Review Component
    const reviewData = {
      averageRating: 4.4,
      totalReviews: 854,
      categories: [
        { label: 'Guide', value: 4.3 },
        { label: 'Transportation', value: 5.0 },
        { label: 'Value for money', value: 4.1 },
        { label: 'Safety', value: 4.3 }
      ]
    };


    
    const reviews = [
      {
        id: 1,
        name: 'Vinnie McCoy',
        avatar: null,
        date: '6 months ago',
        rating: 4,
        title: 'Good tour, really well organized',
        content: 'It was a good tour. Our guide Steve was so kind that you got completely bamboozled with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn\'t enjoy it if we had to ask the organizer please.',
        helpful: true
      },
      {
        id: 2,
        name: 'Vinnie McCoy',
        avatar: null,
        date: '6 months ago',
        rating: 4,
        title: 'Good tour, really well organized',
        content: 'It was a good tour. Our guide Steve was so kind that you got completely bamboozled with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn\'t enjoy it if we had to ask the organizer please.',
        helpful: true
      },
      {
        id: 2,
        name: 'Vinnie McCoy',
        avatar: null,
        date: '6 months ago',
        rating: 4,
        title: 'Good tour, really well organized',
        content: 'It was a good tour. Our guide Steve was so kind that you got completely bamboozled with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn\'t enjoy it if we had to ask the organizer please.',
        helpful: true
      },{
        id: 3,
        name: 'Vinnie McCoy',
        avatar: null,
        date: '6 months ago',
        rating: 4,
        title: 'Good tour, really well organized',
        content: 'It was a good tour. Our guide Steve was so kind that you got completely bamboozled with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn\'t enjoy it if we had to ask the organizer please.',
        helpful: true
      },
      {
        id: 4,
        name: 'Vinnie McCoy',
        avatar: null,
        date: '6 months ago',
        rating: 4,
        title: 'Good tour, really well organized',
        content: 'It was a good tour. Our guide Steve was so kind that you got completely bamboozled with information. You also have to stand up for too long at the private entrance to the Tower of London, which leads to a lack of time later. Lunch was the same, too stress, the quality was great but you couldn\'t enjoy it if we had to ask the organizer please.',
        helpful: true
      },
    ];

    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    return (
        <div className="  py-5">
          <div className=" mx-auto">
            {/* Header Section */}
            <div className=" rounded-2xl  mb-6  font-raleway ">
              <h1 className="text-white text-2xl font-semibold mb-6">Customer Review</h1>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Rating Overview */}
                <div>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-6xl font-bold text-white">{reviewData.averageRating}</span>
                    <span className="text-gray-400 text-lg mb-2">{reviewData.totalReviews} Reviews</span>
                  </div>
                  <StarRating rating={Math.round(reviewData.averageRating)} size="lg" />
                </div>
                
                {/* Right: Category Ratings */}
                <div className="space-y-3">
                  {reviewData.categories.map((category) => (
                    <ProgressBar
                      key={category.label}
                      label={category.label}
                      value={category.value}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filter Section */}
            <ReviewFilter />
            
            {/* Reviews List */}
            <div className="mt-6">
    <div className="space-y-4">
      {displayedReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
    
    {/* View More Button */}
    {reviews.length > 3 && (
      <div className="mt-6 flex justify-center font-raleway font-bold text-[#C4CDCA]">
        <button
          onClick={() => setShowAll(!showAll)}
          className=" text-white px-6 py-3  flex items-center gap-2"
        >
          {showAll ? 'Show Less' : `View More Comments`}
          <svg
            className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    )}
  </div>
            {/* View More Button */}
    
          </div>
        </div>
      );
}

export default RatingsAndReview