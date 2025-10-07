import React, { useState } from "react";
import {
  IoCheckmarkOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";
import { ReviewTableShimmer } from "./ReviewShimmer";

const ReviewTable = ({
  reviews = [],
  loading = false,
  error = null,
  onStatusUpdate,
  onAddResponse,
  onDelete,
  onRefresh,
  onClearError,
}) => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseContent, setResponseContent] = useState("");

  // Calculate rating distribution from reviews
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[Math.floor(review.rating)]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const handleStatusToggle = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === "approved" ? "pending" : "approved";
      await onStatusUpdate(reviewId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await onDelete(reviewId);
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const handleAddResponse = async () => {
    if (!responseContent.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await onAddResponse(selectedReview._id, responseContent);
      setShowResponseModal(false);
      setResponseContent("");
      setSelectedReview(null);
    } catch (error) {
      console.error("Failed to add response:", error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <ReviewTableShimmer />;
  }

  if (error) {
    return (
      <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#1D332C] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600">
          <div>REVIEW</div>
          <div>RATING</div>
          <div>STATUS</div>
          <div>AUTHOR</div>
          <div>DATE</div>
          <div className="text-right">ACTIONS</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {reviews.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No reviews found
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Review Content */}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {review.title || "No Title"}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {review.content}
                  </div>
                  {review.response && (
                    <div className="text-xs text-blue-600 mt-1">
                      Admin Response Available
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {review.rating}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      review.status
                    )}`}
                  >
                    {review.status}
                  </span>
                </div>

                {/* Author */}
                <div className="min-w-0">
                  <div className="text-sm text-gray-900 truncate">
                    {review.author?.name || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {review.author?.email}
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      handleStatusToggle(review._id, review.status)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      review.status === "approved"
                        ? "bg-[#1D332C]"
                        : "bg-gray-200"
                    }`}
                    title={`${
                      review.status === "approved" ? "Disapprove" : "Approve"
                    } Review`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        review.status === "approved"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    >
                      {review.status === "approved" && (
                        <IoCheckmarkOutline className="h-3 w-3 text-[#1D332C] m-0.5" />
                      )}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowResponseModal(true);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Add Response"
                  >
                    <IoChatbubbleOutline className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Review"
                  >
                    <IoTrashOutline className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Admin Response
            </h3>
            <textarea
              value={responseContent}
              onChange={(e) => setResponseContent(e.target.value)}
              placeholder="Enter your response..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D332C] resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setResponseContent("");
                  setSelectedReview(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResponse}
                className="px-4 py-2 bg-[#1D332C] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Add Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
