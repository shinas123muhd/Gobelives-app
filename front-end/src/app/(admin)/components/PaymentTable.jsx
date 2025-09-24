import React, { useState } from "react";
import { IoChevronDownOutline, IoEyeOutline } from "react-icons/io5";

const PaymentTable = () => {
  const [selectedPayments, setSelectedPayments] = useState([]);

  // Sample payment data matching the image
  const payments = [
    {
      id: "6549",
      package: "Goa",
      guestName: "Emily Carter",
      price: "$2500",
      reason: "Flight Canceled",
      status: "pending",
    },
    {
      id: "6549",
      package: "Kerala",
      guestName: "Afatb zali",
      price: "$3000",
      reason: "Personal Issue",
      status: "pending",
    },
    {
      id: "6549",
      package: "Rajasthan",
      guestName: "Liam Smith",
      price: "$2800",
      reason: "Weather Conditions",
      status: "pending",
    },
    {
      id: "6549",
      package: "Maharashtra",
      guestName: "Sophia Brown",
      price: "$3200",
      reason: "Health Emergency",
      status: "pending",
    },
    {
      id: "6549",
      package: "Punjab",
      guestName: "Ava Wilson",
      price: "$2900",
      reason: "Visa Issues",
      status: "pending",
    },
    {
      id: "6549",
      package: "Himachal Pradesh",
      guestName: "Noah Johnson",
      price: "$3500",
      reason: "Travel Restrictions",
      status: "pending",
    },
    {
      id: "6549",
      package: "Tamil Nadu",
      guestName: "Isabella Davis",
      price: "$2600",
      reason: "Family Emergency",
      status: "pending",
    },
    {
      id: "6549",
      package: "Uttarakhand",
      guestName: "Oliver Garcia",
      price: "$3100",
      reason: "Job Conflict",
      status: "pending",
    },
    {
      id: "6549",
      package: "West Bengal",
      guestName: "Mia Martinez",
      price: "$2700",
      reason: "Flight Canceled",
      status: "pending",
    },
  ];

  const handleAccept = (paymentId) => {
    console.log("Accept payment:", paymentId);
    // Add your accept logic here
  };

  const handleReject = (paymentId) => {
    console.log("Reject payment:", paymentId);
    // Add your reject logic here
  };

  const handleView = (paymentId) => {
    console.log("View payment details:", paymentId);
    // Add your view logic here
  };

  const getRefundRequestActions = (payment) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleReject(payment.id)}
          className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={() => handleAccept(payment.id)}
          className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={() => handleView(payment.id)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="View details"
        >
          <IoEyeOutline className="text-lg" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600">
          <div>Booking id</div>
          <div>Package</div>
          <div>Guest Name</div>
          <div>Price</div>
          <div>Reason</div>
          <div>Refund Request</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* Booking ID */}
              <div className="text-sm font-medium text-gray-900">
                #{payment.id}
              </div>

              {/* Package */}
              <div className="text-sm text-gray-900">{payment.package}</div>

              {/* Guest Name */}
              <div className="text-sm text-gray-900">{payment.guestName}</div>

              {/* Price */}
              <div className="text-sm font-medium text-gray-900">
                {payment.price}
              </div>

              {/* Reason */}
              <div className="text-sm text-gray-600">{payment.reason}</div>

              {/* Refund Request Actions */}
              <div className="flex items-center justify-between">
                {getRefundRequestActions(payment)}
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <IoChevronDownOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentTable;
