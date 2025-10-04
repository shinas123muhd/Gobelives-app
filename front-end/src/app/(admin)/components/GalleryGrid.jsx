import React, { useState } from "react";
import Image from "next/image";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoStarOutline,
  IoStar,
  IoCloseOutline,
  IoImageOutline,
} from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddImageDrawer from "./AddImageDrawer";
import GalleryListShimmer from "./GalleryListShimmer";
import {
  useGallery,
  useDeleteImage,
  useToggleFeaturedImage,
} from "@/app/(admin)/hooks/useGallery";

const GalleryGrid = ({ filters }) => {
  // Fetch images using the hook
  const { data, isLoading, error } = useGallery(filters);

  // Mutation hooks
  const deleteMutation = useDeleteImage();
  const toggleFeaturedMutation = useToggleFeaturedImage();

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);

  // Get images from API response
  const images = data?.data || [];
  const totalImages = data?.pagination?.total || 0;

  const handleDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteMutation.mutateAsync(imageId);
        toast.success("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error(error.response?.data?.message || "Failed to delete image");
      }
    }
  };

  const handleToggleFeatured = async (imageId) => {
    try {
      await toggleFeaturedMutation.mutateAsync(imageId);
      toast.success("Featured status updated");
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update featured status"
      );
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setIsImageViewerOpen(true);
  };

  const handleEdit = (imageId) => {
    const imageToEdit = images.find((img) => img._id === imageId);
    if (imageToEdit) {
      setEditingImage(imageToEdit);
      setIsEditDrawerOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDrawerOpen(false);
    setEditingImage(null);
  };

  const handleEditClose = () => {
    setIsEditDrawerOpen(false);
    setEditingImage(null);
  };

  // Loading state
  if (isLoading) {
    return <GalleryListShimmer />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center h-64">
          <IoImageOutline className="w-16 h-16 text-red-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Images
          </h3>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.message ||
              "Failed to load images. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center h-64">
          <IoImageOutline className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Images Found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.featured
              ? "No images match your current filters."
              : "Get started by adding your first image to the gallery."}
          </p>
          {!filters.search && !filters.featured && (
            <button
              onClick={() => {
                /* Trigger add image drawer */
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Image
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border h-full flex flex-col border-gray-100 overflow-hidden">
        {/* Grid Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Gallery Images ({totalImages})
            </h3>
            <div className="text-sm text-gray-500">
              {filters.search && `Search: "${filters.search}"`}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2">
            {images.map((image) => (
              <div
                key={image._id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.image?.url || "/images/placeholder.jpg"}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                  {/* Featured Badge */}
                  {image.featured && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <IoStar className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleViewImage(image)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                        title="View"
                      >
                        <IoEyeOutline className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleEdit(image._id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-sm transition-colors"
                        title="Delete"
                      >
                        <IoTrashOutline className="w-4 h-4 text-gray-700 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 truncate mb-1">
                    {image.title}
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-2">
                    {image.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleToggleFeatured(image._id)}
                      className={`p-1 rounded transition-colors ${
                        image.featured
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-300 hover:text-yellow-500"
                      }`}
                      title={
                        image.featured
                          ? "Remove from featured"
                          : "Add to featured"
                      }
                    >
                      {image.featured ? (
                        <IoStar className="w-4 h-4 fill-current" />
                      ) : (
                        <IoStarOutline className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isImageViewerOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors backdrop-blur-sm"
            >
              <IoCloseOutline className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full h-full max-w-5xl max-h-[80vh] bg-white rounded-xl overflow-hidden shadow-2xl">
                {/* Main Image */}
                <div className="relative w-full h-full min-h-[60vh]">
                  <Image
                    src={selectedImage.image?.url || "/images/placeholder.jpg"}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Image Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {selectedImage.title}
                    </h3>
                    {selectedImage.description && (
                      <p className="text-white/80 mb-3 text-lg">
                        {selectedImage.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-base">
                        Added:{" "}
                        {new Date(selectedImage.createdAt).toLocaleDateString()}
                      </span>
                      {selectedImage.featured && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <IoStar className="w-5 h-5 fill-current" />
                          <span className="font-medium text-lg">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Drawer */}
      <AddImageDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
        editData={editingImage}
        isEditMode={true}
      />
    </>
  );
};

export default GalleryGrid;
