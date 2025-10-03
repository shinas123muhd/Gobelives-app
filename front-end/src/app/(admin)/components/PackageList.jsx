import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PackageCard from "./PackageCard";
import PackageListShimmer from "./PackageListShimmer";
import {
  usePackages,
  useDeletePackage,
  useToggleFeaturedPackage,
} from "../hooks/usePackages";

const PackageList = ({ filters }) => {
  const router = useRouter();
  const deletePackage = useDeletePackage();
  const toggleFeatured = useToggleFeaturedPackage();

  // Fetch packages with filters
  const {
    data: packagesData,
    isLoading,
    error,
  } = usePackages({
    search: filters.searchTerm,
    status: filters.statusFilter,
    category: filters.categoryFilter,
    featured:
      filters.featuredFilter === "true"
        ? true
        : filters.featuredFilter === "false"
        ? false
        : undefined,
    city: filters.cityFilter,
    country: filters.countryFilter,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  const handleEdit = (packageData) => {
    router.push(`/dashboard/destinations/packages/edit/${packageData._id}`);
  };

  const handleDelete = async (packageData) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage.mutateAsync(packageData._id);
        toast.success("Package deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete package");
      }
    }
  };

  const handleToggleFeatured = async (packageData) => {
    try {
      await toggleFeatured.mutateAsync(packageData._id);
      toast.success(
        `Package ${packageData.featured ? "removed from" : "added to"} featured`
      );
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  if (isLoading) {
    return <PackageListShimmer count={8} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading packages</p>
          <p className="text-gray-600">{error?.message}</p>
        </div>
      </div>
    );
  }

  const packages = packagesData?.data?.packages || [];

  if (packages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No packages found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or create a new package
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto h-full lg:grid-cols-4 gap-3">
      {packages.map((packageData) => (
        <PackageCard
          key={packageData._id}
          package={packageData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
          isDeleting={deletePackage.isPending}
          isToggling={toggleFeatured.isPending}
        />
      ))}
    </div>
  );
};

export default PackageList;
