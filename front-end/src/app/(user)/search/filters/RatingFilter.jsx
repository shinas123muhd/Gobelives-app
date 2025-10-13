import React from 'react';
import { Star } from 'lucide-react';

const RatingFilter = ({ options, selectedRating, setSelectedRating }) => (
  <div className="mb-6 bg-[#0F1B17] py-2 rounded-xl">
    <h3 className="text-lg font-semibold mb-4 border-b px-4 py-1 border-white/20">Rating</h3>
    <div className='px-4 py-1'>
      <div className="text-sm text-gray-400 mb-3">Show only ratings more than</div>
      <div className="grid grid-cols-5 gap-2">
        {options.map((rating) => (
          <button
            key={rating}
            onClick={() => setSelectedRating(rating)}
            className={`px-3 py-1 rounded border ${
              selectedRating === rating 
                ? 'bg-yellow-500 text-black border-yellow-500' 
                : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-1 ">
              <Star className={`w-3 h-3 ${selectedRating === rating ? 'fill-current' : ''}`} />
              <span className="text-xs">{rating}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default RatingFilter;