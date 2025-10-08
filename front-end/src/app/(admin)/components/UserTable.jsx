import React, { useState } from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
  IoClose,
} from "react-icons/io5";
import { useUsers, useToggleUserStatus, useDeleteUser } from "../hooks/useUser";
import { toast } from "react-hot-toast";
import EditUserDrawer from "./EditUserDrawer";

const UserTable = ({ filters }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Fetch users from API
  const { data: usersResponse, isLoading, error, refetch } = useUsers(filters);

  const toggleUserStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();

  const users = usersResponse?.data?.users || [];
  const pagination = usersResponse?.data?.pagination;

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await toggleUserStatusMutation.mutateAsync(userId);
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  const getStatusBadge = (user) => {
    if (user.isActive) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
        Inactive
      </span>
    );
  };

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
          <div>NAME</div>
          <div>PHONE NUMBER</div>
          <div>ROLE</div>
          <div>CREATED</div>
          <div className="text-right">ACTION</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="flex items-center justify-end gap-3">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          // Error state
          <div className="px-6 py-8 text-center">
            <div className="text-red-600 mb-2">Failed to load users</div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          // Empty state
          <div className="px-6 py-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          // Users data
          users.map((user) => (
            <div
              key={user._id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !user.isActive ? "opacity-60 bg-gray-50" : ""
              }`}
              onClick={() => handleViewDetails(user)}
            >
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Name Column */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`
                      : user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "No Name"}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="text-sm text-gray-900">
                  {user.phone || "N/A"}
                </div>

                {/* Role */}
                <div className="text-sm text-gray-900 capitalize">
                  {user.role === "super_admin" ? "Super Admin" : user.role}
                </div>

                {/* Created Date */}
                <div className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {/* Action Icons */}
                <div
                  className="flex items-center justify-end gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEdit(user)}
                    disabled={
                      toggleUserStatusMutation.isPending ||
                      deleteUserMutation.isPending
                    }
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    title="Edit user"
                  >
                    <IoCreateOutline className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    disabled={
                      toggleUserStatusMutation.isPending ||
                      deleteUserMutation.isPending
                    }
                    className={`p-1 transition-colors disabled:opacity-50 ${
                      user.isActive
                        ? "text-green-600 hover:text-green-700"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    title={user.isActive ? "Deactivate user" : "Activate user"}
                  >
                    <IoLockClosedOutline className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={
                      toggleUserStatusMutation.isPending ||
                      deleteUserMutation.isPending
                    }
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete user"
                  >
                    <IoTrashOutline className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#1D332C]">
                  User Details
                </h2>
                <p className="text-sm text-[#8B909A] mt-1">
                  {selectedUser.email}
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
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8B909A]">First Name</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedUser.firstName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Last Name</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedUser.lastName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Email</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Phone</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedUser.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Role</p>
                    <p className="text-sm font-medium text-[#1D332C] capitalize">
                      {selectedUser.role === "super_admin"
                        ? "Super Admin"
                        : selectedUser.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Status</p>
                    {getStatusBadge(selectedUser)}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#8B909A]">Email Verified</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {selectedUser.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8B909A]">Created At</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
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
                  <div>
                    <p className="text-sm text-[#8B909A]">Last Updated</p>
                    <p className="text-sm font-medium text-[#1D332C]">
                      {new Date(selectedUser.updatedAt).toLocaleDateString(
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

              {/* Rewards Information */}
              {selectedUser.rewards && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#1D332C] mb-4">
                    Rewards Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1D332C]">
                        {selectedUser.rewards.points || 0}
                      </p>
                      <p className="text-sm text-[#8B909A]">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1D332C] capitalize">
                        {selectedUser.rewards.tier || "Bronze"}
                      </p>
                      <p className="text-sm text-[#8B909A]">Tier</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#1D332C]">
                        {selectedUser.rewards.totalEarned || 0}
                      </p>
                      <p className="text-sm text-[#8B909A]">Total Earned</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Drawer */}
      <EditUserDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        user={editingUser}
      />
    </div>
  );
};

export default UserTable;
