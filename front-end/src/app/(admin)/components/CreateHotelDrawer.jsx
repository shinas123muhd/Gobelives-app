import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import {
  IoLocationOutline,
  IoAttachOutline,
  IoAddOutline,
} from "react-icons/io5";

const CreateHotelDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    hotelName: "",
    website: "",
    email: "",
    location: "",
    description: "",
    address: "",
    phoneCode: "+91",
    phoneNumber: "",
    images: [],
    status: "active",
    tags: ["Enter Hotel Tag"],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const countryCodeOptions = [
    { value: "+91", label: "+91" },
    { value: "+1", label: "+1" },
    { value: "+44", label: "+44" },
    { value: "+33", label: "+33" },
    { value: "+49", label: "+49" },
  ];

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleTagRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleTagAdd = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const handleTagChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = "Hotel name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (formData.images.length < 3) {
      newErrors.images = "At least 3 images are required";
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
      // TODO: Implement API call to create hotel
      console.log("Creating hotel:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and close drawer
      setFormData({
        hotelName: "",
        website: "",
        email: "",
        location: "",
        description: "",
        address: "",
        phoneCode: "+91",
        phoneNumber: "",
        images: [],
        status: "active",
        tags: ["Enter Hotel Tag"],
      });
      setErrors({});
      onClose();

      // TODO: Show success message
    } catch (error) {
      console.error("Error creating hotel:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        hotelName: "",
        website: "",
        email: "",
        location: "",
        description: "",
        address: "",
        phoneCode: "+91",
        phoneNumber: "",
        images: [],
        status: "active",
        tags: ["Enter Hotel Tag"],
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Hotel">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Name */}
          <Input
            label="Hotel Name"
            placeholder="Enter Name"
            value={formData.hotelName}
            onChange={(e) => handleInputChange("hotelName", e.target.value)}
            error={errors.hotelName}
            required
          />

          {/* Website */}
          <Input
            label="Website"
            placeholder="Enter Website URL"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            type="url"
          />

          {/* Email */}
          <Input
            label="Email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            type="email"
            required
          />

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Add Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full pl-3 pr-10 py-2 text-sm border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200
                  ${
                    errors.location
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
              />
              <IoLocationOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Hotel Tag"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors duration-200"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleTagAdd}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <IoAddOutline className="text-lg" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter Short Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200 resize-none"
            />
          </div>

          {/* Address */}
          <Input
            label="Address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={errors.address}
            required
          />

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="w-20">
                <Select
                  options={countryCodeOptions}
                  value={formData.phoneCode}
                  onChange={(value) => handleInputChange("phoneCode", value)}
                />
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder="Enter Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${
                      errors.phoneNumber
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                />
              </div>
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="hotel-images"
              />
              <label
                htmlFor="hotel-images"
                className="cursor-pointer flex flex-col items-center"
              >
                <IoAttachOutline className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Upload at least 3 photos
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB each
                </span>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {formData.images.length} image(s) selected
                </p>
              </div>
            )}
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              placeholder="Select status"
            />
          </div>

          {/* Action Button */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              <IoAddOutline className="text-lg" />
              {isSubmitting ? "Creating..." : "Create New Hotel"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default CreateHotelDrawer;
