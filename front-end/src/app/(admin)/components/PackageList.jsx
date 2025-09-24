import React, { useState } from "react";
import PackageCard from "./PackageCard";
import package1 from "../assets/dummy/package/package1.jpg";
import package2 from "../assets/dummy/package/package2.jpg";
import package3 from "../assets/dummy/package/package3.jpg";
import package4 from "../assets/dummy/package/package4.jpg";
import package5 from "../assets/dummy/package/package5.jpg";
import package6 from "../assets/dummy/package/package3.jpg";

// Sample package data
const packages = [
  {
    id: 1,
    title: "Westminster to Greenwich River Thames",
    location: "AUS",
    duration: "4 days Stay",
    transport: "Transport Facility",
    plan: "Family Plan",
    rating: 4,
    reviews: 584,
    price: "349.00",
    image: package1, // You can replace with actual images
    active: true,
  },
  {
    id: 2,
    title: "Sydney Harbour Bridge Climb",
    location: "AUS",
    duration: "2 days Stay",
    transport: "Transport Included",
    plan: "Adventure Plan",
    rating: 5,
    reviews: 324,
    price: "299.00",
    image: package2,
    active: true,
  },
  {
    id: 3,
    title: "Great Barrier Reef Diving",
    location: "AUS",
    duration: "3 days Stay",
    transport: "Boat Transfer",
    plan: "Diving Plan",
    rating: 4,
    reviews: 456,
    price: "499.00",
    image: package3,
    active: false,
  },
  {
    id: 4,
    title: "Melbourne City Tour",
    location: "AUS",
    duration: "1 day Stay",
    transport: "City Transport",
    plan: "City Explorer",
    rating: 3,
    reviews: 189,
    price: "149.00",
    image: package4,
    active: true,
  },
  {
    id: 5,
    title: "Uluru Sunset Experience",
    location: "AUS",
    duration: "5 days Stay",
    transport: "4WD Vehicle",
    plan: "Desert Adventure",
    rating: 5,
    reviews: 267,
    price: "799.00",
    image: package5,
    active: true,
  },
  {
    id: 6,
    title: "Kangaroo Island Wildlife",
    location: "AUS",
    duration: "2 days Stay",
    transport: "Ferry & Bus",
    plan: "Wildlife Plan",
    rating: 4,
    reviews: 198,
    price: "399.00",
    image: package3,
    active: false,
  },
];

const PackageList = () => {
  const [packageList, setPackageList] = useState(packages);

  const handleEdit = (packageData) => {
    console.log("Edit package:", packageData);
    // Navigate to edit page or open edit modal
  };

  const handleDelete = (packageData) => {
    console.log("Delete package:", packageData);
    // Show confirmation dialog and delete package
    setPackageList((prev) => prev.filter((pkg) => pkg.id !== packageData.id));
  };

  const handleToggleStatus = (packageData) => {
    console.log("Toggle status:", packageData);
    setPackageList((prev) =>
      prev.map((pkg) =>
        pkg.id === packageData.id ? { ...pkg, active: !pkg.active } : pkg
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto h-full lg:grid-cols-4 gap-3">
      {packageList.map((packageData) => (
        <PackageCard
          key={packageData.id}
          package={packageData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </div>
  );
};

export default PackageList;
