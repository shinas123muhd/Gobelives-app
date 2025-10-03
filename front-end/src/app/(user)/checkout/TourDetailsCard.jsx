import { Star } from "lucide-react";
import Image from "next/image";
import StarRating from "../components/StarRating";

export function TourDetailsCard({ 
    imageUrl = "/images/Booking1.png",
    title = "Majestic Agra Getaway",
    rating = 4.5,
    reviewCount = 1240,
    cancellationText = "Free Cancellation Available",
    tripStart = "Sunday, December 16, 2025",
    tripEnd = "Tuesday, December 20, 2025",
    duration = "2 night stay"
  }) {
    return (
      <div className="bg-black rounded-2xl overflow-hidden shadow-xl max-w-sm font-source-sans">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
  
        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-white text-xl font-bold font-raleway">{title}</h3>
  
          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={4.5}/>
            <span className="text-white text-sm font-semibold">{rating}</span>
            <span className="text-gray-400 text-sm">({reviewCount} Reviews)</span>
          </div>
  
          {/* Cancellation */}
          <div className=" ">
            <p className="text-[#34C759]  font-medium">{cancellationText}</p>
          </div>
  
          {/* Trip Details */}
          <div className="space-y-2 text-sm text-[#F9F9F9]">
            <div className="flex ">
              <span className="t">Trip Start:</span>
              <span className="">{tripStart}</span>
            </div>
            <div className="flex ">
              <span className="">End:</span>
              <span className="">{tripEnd}</span>
            </div>
            <div className="flex ">
              <span className=""></span>
              <span className="">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }