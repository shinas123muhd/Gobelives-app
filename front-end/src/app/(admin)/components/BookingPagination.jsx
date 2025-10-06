import React from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Select from "@/components/ui/Select";
import { useBookings } from "../hooks/useBooking";

const BookingPagination = ({ filters, onPageChange, onLimitChange }) => {
  const { data: bookingsResponse } = useBookings(filters);
  const pagination = bookingsResponse?.data?.pagination || {};

  const currentPage = pagination.page || filters.page;
  const totalPages = pagination.pages || 1;
  const totalItems = pagination.total || 0;
  const itemsPerPage = filters.limit;

  const itemsPerPageOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    onLimitChange(value);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-2 px-6 py-4 bg-white rounded-lg">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Showing</span>
        <div className="w-16">
          <Select
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="text-sm"
          />
        </div>
        <span className="text-sm text-gray-600">of {totalItems}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoChevronBackOutline className="text-lg" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                currentPage === page
                  ? "bg-[#1D332C] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoChevronForwardOutline className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default BookingPagination;
