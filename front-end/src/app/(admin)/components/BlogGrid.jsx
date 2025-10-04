import React, { useState } from "react";
import Image from "next/image";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoStarOutline,
  IoStar,
  IoCloseOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddBlogDrawer from "./AddBlogDrawer";
import {
  useBlogs,
  useDeleteBlog,
  useToggleFeaturedBlog,
} from "../hooks/useBlogs";
import BlogListShimmer from "./BlogListShimmer";

const BlogGrid = ({ filters }) => {
  // Fetch blogs with filters
  const { data: blogsData, isLoading, error, refetch } = useBlogs(filters);

  // Mutations
  const deleteBlog = useDeleteBlog();
  const toggleFeatured = useToggleFeaturedBlog();

  const blogs = blogsData?.data || [];

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isBlogViewerOpen, setIsBlogViewerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Use real API data
  const displayBlogs = blogs;

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog.mutateAsync(blogId);
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete blog");
      }
    }
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setIsBlogViewerOpen(true);
  };

  const handleEdit = (blogId) => {
    const blogToEdit = displayBlogs.find(
      (blog) => blog.id === blogId || blog._id === blogId
    );
    if (blogToEdit) {
      setEditingBlog(blogToEdit);
      setIsEditDrawerOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDrawerOpen(false);
    setEditingBlog(null);
    toast.success("Blog updated successfully!");
  };

  const handleEditClose = () => {
    setIsEditDrawerOpen(false);
    setEditingBlog(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "unpublished":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "public":
        return "bg-blue-100 text-blue-800";
      case "users_only":
        return "bg-purple-100 text-purple-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (isLoading) {
    return <BlogListShimmer count={6} />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 mb-4">Failed to load blogs</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (displayBlogs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center justify-center h-64">
          <IoDocumentTextOutline className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Blogs Found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters?.search || filters?.status || filters?.visibility
              ? "No blogs match your current filters."
              : "Get started by creating your first blog post."}
          </p>
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
              Blog Posts ({displayBlogs.length})
            </h3>
            <div className="text-sm text-gray-500">
              {filters?.search && `Search: "${filters.search}"`}
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayBlogs.map((blog) => (
              <div
                key={blog._id || blog.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Blog Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={
                      blog.image?.url ||
                      blog.imageUrl ||
                      "/images/placeholder.jpg"
                    }
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {blog.status.charAt(0).toUpperCase() +
                        blog.status.slice(1)}
                    </span>
                  </div>

                  {/* Visibility Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(
                        blog.visibility
                      )}`}
                    >
                      {blog.visibility
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        blog.visibility.replace("_", " ").slice(1)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleViewBlog(blog)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                        title="View"
                      >
                        <IoEyeOutline className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleEdit(blog._id || blog.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id || blog.id)}
                        disabled={deleteBlog.isPending}
                        className={`p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-sm transition-colors ${
                          deleteBlog.isPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title="Delete"
                      >
                        <IoTrashOutline className="w-4 h-4 text-gray-700 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Blog Info */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 truncate mb-2">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                    {blog.content.replace(/<[^>]*>/g, "").length > 150 && "..."}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{blog.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    {blog.scheduleDate && (
                      <span className="text-blue-600">
                        Scheduled:{" "}
                        {new Date(blog.scheduleDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Viewer Modal */}
      {isBlogViewerOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-4xl max-h-full bg-white rounded-xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsBlogViewerOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-gray-700 transition-colors backdrop-blur-sm"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>

            {/* Blog Content */}
            <div className="h-full overflow-y-auto">
              {/* Header Image */}
              <div className="relative h-64">
                <Image
                  src={
                    selectedBlog.image?.url ||
                    selectedBlog.imageUrl ||
                    "/images/placeholder.jpg"
                  }
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedBlog.status
                    )}`}
                  >
                    {selectedBlog.status.charAt(0).toUpperCase() +
                      selectedBlog.status.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getVisibilityColor(
                      selectedBlog.visibility
                    )}`}
                  >
                    {selectedBlog.visibility
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedBlog.visibility.replace("_", " ").slice(1)}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedBlog.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Created:{" "}
                      {new Date(selectedBlog.createdAt).toLocaleDateString()}
                    </span>
                    {selectedBlog.scheduleDate && (
                      <span className="text-blue-600">
                        Scheduled:{" "}
                        {new Date(
                          selectedBlog.scheduleDate
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Drawer */}
      <AddBlogDrawer
        isOpen={isEditDrawerOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
        editData={editingBlog}
        isEditMode={true}
      />
    </>
  );
};

export default BlogGrid;

// [
//   {
//     id: 1,
//     title: "Adventure Tourism in Summer",
//     content:
//       "Explore the best adventure destinations for your summer vacation. From mountain climbing to beach activities, discover amazing places to visit.",
//     tags: ["Adventure Tourism", "Summer slam"],
//     visibility: "public",
//     status: "published",
//     imageUrl: "/images/Mountain.jpg",
//     createdAt: "2024-01-15",
//     scheduleDate: null,
//   },
//   {
//     id: 2,
//     title: "Top Beach Destinations",
//     content:
//       "Discover the most beautiful beaches around the world. Perfect for relaxation and water sports activities.",
//     tags: ["Beaches", "Travel"],
//     visibility: "users_only",
//     status: "published",
//     imageUrl: "/images/Beaches.png",
//     createdAt: "2024-01-14",
//     scheduleDate: null,
//   },
//   {
//     id: 3,
//     title: "City Tours Guide",
//     content:
//       "Complete guide to city tours and urban exploration. Find the best attractions and hidden gems in major cities.",
//     tags: ["City Tours", "Urban"],
//     visibility: "private",
//     status: "unpublished",
//     imageUrl: "/images/CityBased.png",
//     createdAt: "2024-01-13",
//     scheduleDate: "2024-02-01T10:00",
//   },
//   {
//     id: 4,
//     title: "Mountain Adventures",
//     content:
//       "Everything you need to know about mountain climbing and hiking adventures. Safety tips and equipment guides.",
//     tags: ["Mountains", "Hiking"],
//     visibility: "public",
//     status: "published",
//     imageUrl: "/images/Mountain.jpg",
//     createdAt: "2024-01-12",
//     scheduleDate: null,
//   },
//   {
//     id: 5,
//     title: "Hotel Reviews",
//     content:
//       "Comprehensive reviews of top hotels and accommodations. Find the perfect place to stay for your next trip.",
//     tags: ["Hotels", "Reviews"],
//     visibility: "public",
//     status: "draft",
//     imageUrl: "/images/Hotel1.jpg",
//     createdAt: "2024-01-11",
//     scheduleDate: null,
//   },
//   {
//     id: 6,
//     title: "Travel Photography Tips",
//     content:
//       "Learn professional photography techniques for travel. Capture amazing moments and create lasting memories.",
//     tags: ["Photography", "Travel"],
//     visibility: "public",
//     status: "published",
//     imageUrl: "/images/Gallery1.jpg",
//     createdAt: "2024-01-10",
//     scheduleDate: null,
//   },
// ]
