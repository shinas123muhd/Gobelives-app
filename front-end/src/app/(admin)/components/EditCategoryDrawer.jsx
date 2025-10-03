import React, { useState, useEffect } from "react";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { useUpdateCategory } from "../hooks/useCategory";
import { toast } from "react-hot-toast";

const EditCategoryDrawer = ({ isOpen, onClose, category }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
    currentImage: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Use the update category hook
  const updateCategory = useUpdateCategory();

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Populate form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: category.isActive ? "active" : "inactive",
        image: null,
        currentImage: category.image?.url || null,
      });
      setErrors({});
      setImagePreview(null);
    }
  }, [category]);

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
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        currentImage: null, // Clear current image when new one is selected
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("status", formData.status);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await updateCategory.mutateAsync({ id: category._id, data: submitData });

      // Close drawer
      onClose();

      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleClose = () => {
    if (!updateCategory.isPending) {
      setFormData({
        name: "",
        description: "",
        status: "active",
        image: null,
        currentImage: null,
      });
      setErrors({});
      setImagePreview(null);
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Edit Category">
      <div className="p-6  h-full overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`
                w-full px-3 py-2 text-sm border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200 resize-none
                ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>

            {imagePreview ? (
              <div className="space-y-3">
                {/* New Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="New category preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: null }));
                      // Reset file input
                      const fileInput = document.getElementById(
                        "edit-category-image"
                      );
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* File Info */}
                <div className="text-sm text-gray-600">
                  <p>New image: {formData.image?.name}</p>
                  <p className="text-xs text-gray-500">
                    Size: {(formData.image?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : formData.currentImage ? (
              <div className="space-y-3">
                {/* Current Image Display */}
                <div className="relative">
                  <img
                    src={formData.currentImage}
                    alt="Current category image"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Current Image</span>
                  </div>
                </div>

                {/* Upload New Image */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="edit-category-image"
                  />
                  <label
                    htmlFor="edit-category-image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <IoImageOutline className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-600">
                      Click to change image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="edit-category-image"
                />
                <label
                  htmlFor="edit-category-image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <IoImageOutline className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateCategory.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={updateCategory.isPending}
              className="flex-1"
            >
              {updateCategory.isPending ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default EditCategoryDrawer;
