import { User } from "lucide-react";
import StarRating from "../../components/StarRating";

const ReviewCard = ({ review }) => {
    return (
      <div className="py-6 border-b-2 border-dashed border-[#CEDADF] font-source-sans">
        {/* Use grid with 3 columns: avatar, user info, content */}
        <div className="grid grid-cols-[auto_200px_1fr] gap-4 items-start">
          
          {/* Column 1: Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            {review.avatar ? (
              <img src={review.avatar} alt={review.name} className="w-full h-full rounded-full" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          {/* Column 2: User Info */}
          <div>
            <StarRating rating={review.rating} size="sm" />
            <h3 className="text-white font-medium mt-1">{review.name}</h3>
            <p className="text-gray-500 text-sm">{review.date}</p>
          </div>
          
          {/* Column 3: Review Content */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h4 className="text-[#C4CDCA] font-bold mb-2">{review.title}</h4>
                <p className="text-[#91A19C]  leading-relaxed">{review.content}</p>
              </div>
              
              {review.helpful && (
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  <span className="text-gray-500">Helpful?</span>{' '}
                  <span className="text-green-500">Yes</span>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    );
};

export default ReviewCard