import React, { useState } from "react";
import {
  IoChevronDownOutline,
  IoClose,
  IoCalendarOutline,
  IoPeopleOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { useBookings, useUpdateBookingStatus } from "../hooks/useBooking";
import { toast } from "react-hot-toast";

const BookingTable = ({ filters }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings from API
  const {
    data: bookingsResponse,
    isLoading,
    error,
    refetch,
  } = useBookings(filters);
  const updateBookingStatusMutation = useUpdateBookingStatus();

  const bookings = bookingsResponse?.data?.bookings || [];
  const pagination = bookingsResponse?.data?.pagination;

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatusMutation.mutateAsync({
        id: bookingId,
        status: "confirmed",
        reason: "Booking accepted by admin",
      });
      toast.success("Booking accepted successfully!");
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to accept booking. Please try again.");
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatusMutation.mutateAsync({
        id: bookingId,
        status: "cancelled",
        reason: "Booking rejected by admin",
      });
      toast.success("Booking rejected successfully!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking. Please try again.");
    }
  };

  const getStatusButton = (booking) => {
    const isUpdating = updateBookingStatusMutation.isPending;

    switch (booking.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleReject(booking._id)}
              disabled={isUpdating}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Processing..." : "Reject"}
            </button>
            <button
              onClick={() => handleAccept(booking._id)}
              disabled={isUpdating}
              className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Processing..." : "Accept"}
            </button>
          </div>
        );
      case "confirmed":
        return (
          <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-md">
            Confirmed
          </button>
        );
      case "cancelled":
        return (
          <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md">
            Cancelled
          </button>
        );
      case "checked_in":
        return (
          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md">
            Checked In
          </button>
        );
      case "checked_out":
        return (
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            Checked Out
          </button>
        );
      case "completed":
        return (
          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-md">
            Completed
          </button>
        );
      case "no_show":
        return (
          <button className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-md">
            No Show
          </button>
        );
      default:
        return (
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            {booking.status}
          </button>
        );
    }
  };

  return (
    <div className="bg-white  h-full overflow-y-auto flex flex-col rounded-lg ">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-600">
          <div>Booking ID</div>
          <div>Guest Name</div>
          <div>Type</div>
          <div>Check In</div>
          <div>Guests</div>
          <div>Price</div>
          <div>Status</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="px-6 py-8 text-center">
            <div className="text-red-600 mb-2">Failed to load bookings</div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          // Empty state
          <div className="px-6 py-8 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          // Bookings data
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleViewDetails(booking)}
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* Booking ID */}
                <div className="text-sm font-medium text-[#1D332C]">
                  {booking.bookingReference?.split("-")[1] ||
                    booking._id?.slice(-6).toUpperCase()}
                </div>

                {/* Guest Name */}
                <div className="text-sm text-[#1D332C]">
                  {booking.guestDetails?.firstName}{" "}
                  {booking.guestDetails?.lastName}
                </div>

                {/* Booking Type */}
                <div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                    {booking.bookingType}
                  </span>
                </div>

                {/* Check In Date */}
                <div className="text-sm text-[#8B909A]">
                  {new Date(booking.checkIn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Number of Guests */}
                <div className="text-sm text-[#1D332C]">
                  {booking.guests?.total || 0}
                </div>

                {/* Price */}
                <div className="text-sm font-medium text-[#1D332C]">
                  {booking.pricing?.currency}{" "}
                  {booking.pricing?.totalPrice?.toLocaleString() || 0}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div onClick={(e) => e.stopPropagation()}>
                    {getStatusButton(booking)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#1D332C]">
                  Booking Details
                </h2>
                <p className="text-sm text-[#8B909A] mt-1">
                  Ref: {selectedBooking.bookingReference}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="text-2xl text-[#8B909A]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4 flex items-center gap-2">
                  <IoPeopleOutline className="text-xl" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8B909A]">Name</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.guestDetails?.firstName}{" "}
                      {selectedBooking.guestDetails?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Email</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.guestDetails?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Phone</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.guestDetails?.phone?.code}{" "}
                      {selectedBooking.guestDetails?.phone?.number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Country</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.guestDetails?.country}
                    </p>
                  </div>
                  {selectedBooking.guestDetails?.specialRequests && (
                    <div className="col-span-2">
                      <p className="text-sm text-[#8B909A]">Special Requests</p>
                      <p className="text-sm font-medium text-[#1D332C]">
                        {selectedBooking.guestDetails.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4 flex items-center gap-2">
                  <IoCalendarOutline className="text-xl" />
                  Booking Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8B909A]">Booking Type</p>
                    <p className="text-sm font-medium text-[#1D332C] capitalize">
                      {selectedBooking.bookingType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Status</p>
                    {getStatusButton(selectedBooking)}
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Check-in Date</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {new Date(selectedBooking.checkIn).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Check-out Date</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {new Date(selectedBooking.checkOut).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Duration</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.duration} nights
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Created On</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                  Guest Count
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1D332C]">
                      {selectedBooking.guests?.adults || 0}
                    </p>
                    <p className="text-sm text-[#8B909A]">Adults</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1D332C]">
                      {selectedBooking.guests?.children || 0}
                    </p>
                    <p className="text-sm text-[#8B909A]">Children</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1D332C]">
                      {selectedBooking.guests?.infants || 0}
                    </p>
                    <p className="text-sm text-[#8B909A]">Infants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1D332C]">
                      {selectedBooking.guests?.total || 0}
                    </p>
                    <p className="text-sm text-[#8B909A]">Total</p>
                  </div>
                </div>
              </div>

              {/* Package/Property Details */}
              {selectedBooking.package && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#1D332C] mb-4 flex items-center gap-2">
                    <IoLocationOutline className="text-xl" />
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#8B909A]">Package Name</p>
                      <p className="text-sm font-medium text-[#1D332C]">
                        {selectedBooking.package.title}
                      </p>
                    </div>
                    {selectedBooking.package.location && (
                      <div>
                        <p className="text-sm text-[#8B909A]">Location</p>
                        <p className="text-sm font-medium text-[#1D332C]">
                          {selectedBooking.package.location.address},{" "}
                          {selectedBooking.package.location.city},{" "}
                          {selectedBooking.package.location.state}
                        </p>
                      </div>
                    )}
                    {selectedBooking.packageDetails && (
                      <>
                        {selectedBooking.packageDetails.startTime && (
                          <div>
                            <p className="text-sm text-[#8B909A]">Start Time</p>
                            <p className="text-sm font-medium text-[#1D332C]">
                              {selectedBooking.packageDetails.startTime}
                            </p>
                          </div>
                        )}
                        {selectedBooking.packageDetails.pickupLocation && (
                          <div>
                            <p className="text-sm text-[#8B909A]">
                              Pickup Location
                            </p>
                            <p className="text-sm font-medium text-[#1D332C]">
                              {selectedBooking.packageDetails.pickupLocation}
                            </p>
                          </div>
                        )}
                        {selectedBooking.packageDetails.language && (
                          <div>
                            <p className="text-sm text-[#8B909A]">Language</p>
                            <p className="text-sm font-medium text-[#1D332C]">
                              {selectedBooking.packageDetails.language}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                  Pricing Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-[#8B909A]">Base Price</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedBooking.pricing?.currency}{" "}
                      {selectedBooking.pricing?.basePrice?.toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.pricing?.taxes > 0 && (
                    <div className="flex justify-between">
                      <p className="text-sm text-[#8B909A]">Taxes</p>
                      <p className="text-sm font-medium text-[#1D332C]">
                        {selectedBooking.pricing?.currency}{" "}
                        {selectedBooking.pricing?.taxes?.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedBooking.pricing?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p className="text-sm">Discount</p>
                      <p className="text-sm font-medium">
                        - {selectedBooking.pricing?.currency}{" "}
                        {selectedBooking.pricing?.discount?.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <p className="text-base font-semibold text-[#1D332C]">
                      Total Price
                    </p>
                    <p className="text-base font-bold text-[#1D332C]">
                      {selectedBooking.pricing?.currency}{" "}
                      {selectedBooking.pricing?.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[#8B909A]">Paid Amount</p>
                    <p className="text-sm font-medium text-green-600">
                      {selectedBooking.pricing?.currency}{" "}
                      {selectedBooking.pricing?.paidAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[#8B909A]">Remaining Amount</p>
                    <p className="text-sm font-medium text-red-600">
                      {selectedBooking.pricing?.currency}{" "}
                      {selectedBooking.pricing?.remainingAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                  Payment Information
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[#8B909A]">Payment Status:</p>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      selectedBooking.payment?.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : selectedBooking.payment?.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedBooking.payment?.status || "N/A"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedBooking.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(selectedBooking._id);
                      handleCloseModal();
                    }}
                    disabled={updateBookingStatusMutation.isPending}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Reject Booking
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(selectedBooking._id);
                      handleCloseModal();
                    }}
                    disabled={updateBookingStatusMutation.isPending}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Accept Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
