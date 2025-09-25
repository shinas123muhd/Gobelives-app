import React, { useState } from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { MdLockOpen, MdLock } from "react-icons/md";
import EditCategoryDrawer from "./EditCategoryDrawer";
import {
  useCategories,
  useDeleteCategory,
  useToggleCategoryStatus,
} from "../hooks/useCategory";
import { toast } from "react-hot-toast";

const CategoryList = ({ filters = {} }) => {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories with filters
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useCategories(filters);

  // Mutations
  const deleteCategory = useDeleteCategory();
  const toggleStatus = useToggleCategoryStatus();

  const categories = categoriesData?.data?.categories || [];

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteClick = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory.mutateAsync(category._id);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete category"
        );
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await toggleStatus.mutateAsync(category._id);
      toast.success(
        `Category ${
          category.isActive ? "deactivated" : "activated"
        } successfully`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update category status"
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">Failed to load categories</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 mb-4">No categories found</p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl cursor-pointer  border border-gray-100
             overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Category Image */}
            <div className="h-[148px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Image
                src={category.image?.url || "/placeholder-category.jpg"}
                alt={category.name}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Content */}
            <div className="p-3">
              <h3 className=" font-medium text-gray-800 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-[#A5B2BA] mb-2">Packages</p>
              <p className="text-lg font-bold text-gray-800 mb-4">
                {category.packageCount || 0}
              </p>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  title="edit"
                  onClick={() => handleEditClick(category)}
                  className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit className="text-lg" />
                </button>
                <button
                  title={category.isActive ? "deactivate" : "activate"}
                  onClick={() => handleToggleStatus(category)}
                  disabled={toggleStatus.isPending}
                  className={`p-2 cursor-pointer rounded-lg transition-colors ${
                    category.isActive
                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                      : "text-red-600 hover:text-red-700 hover:bg-red-50"
                  } ${
                    toggleStatus.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {category.isActive ? (
                    <MdLockOpen className="text-lg" />
                  ) : (
                    <MdLock className="text-lg" />
                  )}
                </button>
                <button
                  title="delete"
                  onClick={() => handleDeleteClick(category)}
                  disabled={deleteCategory.isPending}
                  className={`p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
                    deleteCategory.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <IoTrashOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Drawer */}
      <EditCategoryDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleCloseEditDrawer}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryList;
