import React from "react";
import {
  IoCreateOutline,
  IoLockClosedOutline,
  IoTrashOutline,
} from "react-icons/io5";

import category1 from "../assets/dummy/category1.png";
import category2 from "../assets/dummy/category2.png";
import category3 from "../assets/dummy/category3.jpg";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { MdLockOpen } from "react-icons/md";
const categories = [
  {
    id: 1,
    name: "Beach",
    packages: 188,
    image: category1,
    description: "Beach destinations and coastal getaways",
  },
  {
    id: 2,
    name: "Mountain",
    packages: 188,
    image: category2,
    description: "Mountain adventures and scenic landscapes",
  },
  {
    id: 3,
    name: "City",
    packages: 188,
    image: category3,
    description: "Urban experiences and city tours",
  },
];
const CategoryList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-xl cursor-pointer  border border-gray-100
           overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Category Image */}
          <div className="h-[148px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Image
              src={category.image}
              alt={category.name}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category Content */}
          <div className="p-3">
            <h3 className=" font-medium text-gray-800 mb-1">{category.name}</h3>
            <p className="text-sm text-[#A5B2BA] mb-2">Packages</p>
            <p className="text-lg font-bold text-gray-800 mb-4">
              {category.packages}
            </p>

            {/* Action Icons */}
            <div className="flex items-center gap-1">
              <button
                title="edit"
                className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FiEdit className="text-lg" />
              </button>
              <button
                title="lock"
                className="p-2 text-gray-400 cursor-pointer hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <MdLockOpen className="text-lg" />
              </button>
              <button
                title="delete"
                className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <IoTrashOutline className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
