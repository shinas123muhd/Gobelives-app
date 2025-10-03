"use client"
import { Filter, Search } from "lucide-react";
import Dropdown from "../../components/Dropdown";
import { useState } from "react";

const ReviewFilter = ({ onFilterChange }) => {
    const [recommended, setRecommended] = useState('Recommended');
    const [transferType, setTransferType] = useState('Transfer type');
    const [rating, setRating] = useState('Rating');
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
      <div className="bg-[#121212] rounded-lg p-4 flex flex-wrap items-center gap-3 font-source-sans">
        <button className="flex items-center gap-2  text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="">Filtering:</span>
        </button>
        
        <div className="w-48 bg-[#FFFFFF1F] rounded-md">
        <Dropdown
          label="Recommended"
          options={['Recommended', 'Most Recent', 'Highest Rated', 'Lowest Rated']}
          value={recommended}
          onChange={setRecommended}
        />
        </div>
        
        <div className="w-48 bg-[#FFFFFF1F] rounded-md">
        <Dropdown
          label="Transfer type"
          options={['Transfer type', 'Airport Transfer', 'City Tour', 'Private Transfer']}
          value={transferType}
          onChange={setTransferType}
        />
        </div>
        
        <div className="w-48 bg-[#FFFFFF1F] rounded-md">
        <Dropdown
          label="Rating"
          options={['Rating', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star']}
          value={rating}
          onChange={setRating}
        />
        </div>
        
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFFFF1F] rounded-md text-gray-300 pl-10 pr-4 py-3  focus:outline-none focus:ring-2 focus:ring-yellow-500/50 "
          />
        </div>
      </div>
    );
  };
export default ReviewFilter