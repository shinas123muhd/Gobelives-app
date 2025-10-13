"use client"
import React, { useState } from 'react';
import { Heart, Share2, Star, MapPin, Users, Calendar, Filter, ChevronDown, Search } from 'lucide-react';
import LocationCard from '../components/LocationCard';
import HotelCard from './HotelCard';
import BudgetFilter from '../search/filters/BudgetFilter';
import PopularFilters from '../search/filters/PopularFilters';
import ActivitiesFilter from '../search/filters/ActivitiesFilter';
import RatingFilter from '../search/filters/RatingFilter';
import { useGetHotels } from '../api/hooks';

const HotelList = () => {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const { data: hotels, isLoading, isError, error } = useGetHotels(1, 20, "createdAt", "desc", "");
  console.log(hotels)

  // Sample product data
  const products = [
    {
      id: 1,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.5,
      reviews: 125,
      location: "London, UK",
      duration: "2 hours",
      groupSize: "Small group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: false
    },
    {
      id: 2,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.8,
      reviews: 89,
      location: "London, UK",
      duration: "3 hours",
      groupSize: "Small group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: true
    },
    {
      id: 3,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.6,
      reviews: 156,
      location: "London, UK",
      duration: "2.5 hours",
      groupSize: "Medium group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: false
    },
    {
      id: 4,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.7,
      reviews: 203,
      location: "London, UK",
      duration: "4 hours",
      groupSize: "Large group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: true
    },
    {
      id: 5,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.4,
      reviews: 78,
      location: "London, UK",
      duration: "1.5 hours",
      groupSize: "Small group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: false
    },
    {
      id: 6,
      title: "Westminster to Greenwich River Thames",
      image: "/api/placeholder/280/200",
      price: 349.00,
      rating: 4.9,
      reviews: 234,
      location: "London, UK",
      duration: "3.5 hours",
      groupSize: "Medium group",
      features: ["Transport Facility", "Family Plan"],
      isFavorite: false
    }
  ];

  const budgetOptions = [
    { range: "₹0 - ₹500", count: 200 },
    { range: "₹500 - ₹1000", count: 150 },
    { range: "₹1000 - ₹2000", count: 89 },
    { range: "₹2000 - ₹5000", count: 67 },
    { range: "₹5000+", count: 23 }
  ];

  const ratingOptions = [5, 4, 3, 2, 1];

  const popularFilters = [
    { name: "Free cancellation", count: 200 },
    { name: "Skip the line", count: 150 },
    { name: "Beach tours", count: 98 },
    { name: "Private groups", count: 76 },
    { name: "Book without credit card", count: 235 },
    { name: "Pay on arrival", count: 89 }
  ];

  const activities = [
    { name: "Fishing", count: 200 },
    { name: "Hiking", count: 300 },
    { name: "Beach", count: 98 },
    { name: "Cycling", count: 175 },
    { name: "Diving", count: 230 },
    { name: "City tours", count: 187 }
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="  ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-end justify-between pt-10">
            {/* Search */}
            <div className=" bg-[#0F1B17] p-4 rounded-2xl flex flex-col gap-3">
              <h2>Search by property name</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by property name"
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
            <h1 className="text-2xl font-medium text-white">India • 2,582 search results found</h1>
             {/* Category Tabs */}
          <div className="flex  mt-4 border border-[#FFD7003D] text-white bg-[#0F1B17] rounded-xl">
            <button className="px-4 py-2 border-r border-[#FFD7003D] font-medium text-center ">Packages</button>
            <button className=" px-4 py-1 border-r border-[#FFD7003D] text-center">Hotels and Packages</button>
            <button className=" px-4 py-1 border-r border-[#FFD7003D] ">Events and Parks</button>
            <button className=" px-4 py-1 border-r border-[#FFD7003D]">Cruises</button>
            <button className=" px-4 py-1">Travel Guides</button>
          </div>
          </div>
          <div className="flex flex-col items-start gap-2 px-4 py-2 border border-[#BDBDBD3D] bg-[#0F1B17] rounded-lg focus:outline-none ">
  <label 
    htmlFor="sortBy" 
    className="text-sm font-medium text-white"
  >
    Sort by
  </label>
  <select 
    id="sortBy"
    value={sortBy} 
    onChange={(e) => setSortBy(e.target.value)}
    className=""
  >
    <option value="recommended">Recommended</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="rating">Highest Rated</option>
  </select>
</div>
            
          </div>
          
         
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-80  text-white pr-5 rounded-lg h-full sticky top-8 self-start">
            <BudgetFilter
              options={budgetOptions}
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
            />

            {/* Rating Filter */}
            <RatingFilter
                options={ratingOptions}
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
              />
              <PopularFilters filters={popularFilters} />
              <ActivitiesFilter activities={activities} />
            </div>


          {/* Product Grid */}
          <div
            className="flex-1 h-full overflow-y-auto scrollbar-hide"
            style={{ minHeight: 0 }}
          >
            <div className="grid grid-cols-1  ">
              {hotels?.hotels.map((item) => (
                <div key={item.id} className='pb-3 '>
                  <HotelCard
                    name={item.name} 
                    image={item.primaryImage.url}
                    altText={item.primaryImage.alt}
                    averageRating={item.averageRating}
                    features = {item.features}
                    amenities={item.amenities}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {/* <div className="flex justify-center mt-8">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Load More Results
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;