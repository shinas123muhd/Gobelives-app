import React, { useState } from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
} from "react-icons/io5";

const UserTable = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Sample user data matching the image
  const users = [
    {
      id: 1,
      name: "Robert Fox",
      email: "robert@gmail.com",
      phone: "050 4531231",
      created: "12 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "050 4531232",
      created: "13 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "050 4531233",
      created: "14 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "050 4531234",
      created: "15 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "050 4531235",
      created: "16 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "050 4531236",
      created: "17 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "James Taylor",
      email: "james.taylor@email.com",
      phone: "050 4531237",
      created: "18 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "050 4531238",
      created: "19 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 9,
      name: "John Martinez",
      email: "john.martinez@email.com",
      phone: "050 4531239",
      created: "20 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
    {
      id: 10,
      name: "Anna Thompson",
      email: "anna.thompson@email.com",
      phone: "050 4531240",
      created: "21 Mar 2025",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
    // Add your edit logic here
  };

  const handleLock = (userId) => {
    console.log("Lock/unlock user:", userId);
    // Add your lock logic here
  };

  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
    // Add your delete logic here
  };

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
          <div>NAME</div>
          <div>PHONE NUMBER</div>
          <div>CREATED</div>
          <div className="text-right">ACTION</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              {/* Name Column */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="text-sm text-gray-900">{user.phone}</div>

              {/* Created Date */}
              <div className="text-sm text-gray-900">{user.created}</div>

              {/* Action Icons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit user"
                >
                  <IoCreateOutline className="text-lg" />
                </button>
                <button
                  onClick={() => handleLock(user.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Lock/Unlock user"
                >
                  <IoLockClosedOutline className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete user"
                >
                  <IoTrashOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
