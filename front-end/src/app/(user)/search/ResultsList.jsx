"use client"
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import LocationCard from '../components/LocationCard';
import BudgetFilter from './filters/BudgetFilter';
import RatingFilter from './filters/RatingFilter';
import PopularFilters from './filters/PopularFilters';
import ActivitiesFilter from './filters/ActivitiesFilter';
import LocationCardSkeleton from '../components/LocationCardSkeleton';
import { useGetPackages } from '../api/hooks';


const ResultsList = () => {
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const { data: packages, isLoading, isError, error } = useGetPackages(1, 20, "createdAt", "desc", "");

  console.log(packages, "packagesss")

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="">
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
        <div className="flex gap-6 " >
          {/* Sidebar Filters */}
          <div className="w-80  text-white pr-5 rounded-lg h-full sticky top-8 self-start">
            <BudgetFilter
              options={budgetOptions}
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
            />
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
            <div className='grid grid-cols-3 gap-6 py-4'>
            {isLoading
            ? [...Array(3)].map((_, idx) => (
                <LocationCardSkeleton key={idx} />
              ))
            : packages?.packages.map((item) => (
                <LocationCard
                  key={item.id}
                  id={item.id}
                  image={item.coverImage}
                  title={item.title}
                  price={item.price.sellingPrice}
                  features={item.featureHighlights}
                />
              ))}
              </div>
            {/* Load More Button (commented out) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsList;