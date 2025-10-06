import React, { useState, useEffect } from "react";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { IoPersonOutline } from "react-icons/io5";
import {
  useUpdateUser,
  useUpdateUserRole,
  useToggleUserStatus,
} from "../hooks/useUser";
import { toast } from "react-hot-toast";

const EditUserDrawer = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "user",
    isActive: "true",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUserMutation = useUpdateUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const toggleUserStatusMutation = useToggleUserStatus();

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
  ];

  // Populate form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "user",
        isActive:
          user.isActive !== undefined ? user.isActive.toString() : "true",
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.phone && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive === "true",
      };

      // Update user info (including role and status)
      await updateUserMutation.mutateAsync({
        id: user._id,
        userData: updateData,
      });

      toast.success("User updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Edit User">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
              {user.firstName && user.lastName ? (
                <span className="text-2xl font-semibold text-gray-600">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              ) : (
                <IoPersonOutline className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
              required
            />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            required
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
          />

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <Select
                options={roleOptions}
                value={formData.role}
                onChange={(value) => handleInputChange("role", value)}
                placeholder="Select role"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                options={statusOptions}
                value={formData.isActive}
                onChange={(value) => handleInputChange("isActive", value)}
                placeholder="Select status"
              />
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Account Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">User ID:</span>
                <span className="ml-2 font-mono text-xs">{user._id}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Email Verified:</span>
                <span className="ml-2">
                  {user.isEmailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
              disabled={
                updateUserMutation.isPending ||
                updateUserRoleMutation.isPending ||
                toggleUserStatusMutation.isPending
              }
            >
              {isSubmitting ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default EditUserDrawer;
