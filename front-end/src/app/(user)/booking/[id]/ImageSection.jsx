"use client"
import Image from "next/image";
import React, { useState } from "react";

const ImageSection = ({ images = [] }) => {

  // active image state, default to first image
  const [activeImage, setActiveImage] = useState(images[0] || null);

  return (
    <div>
      <div>
        {/* Main active image */}
        {activeImage && (
          <Image
            src={activeImage}
            height={420}
            width={720}
            alt="Main image"
            className="h-[420px] w-full object-cover rounded-t-3xl"
          />
        )}

        {/* Thumbnails */}
        <div className="grid grid-cols-6 gap-2 mt-3 ">
        {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={` roundedt-t-2xl overflow-hidden ${
                activeImage === img ? "border-blue-500" : "border-transparent"
              }`}
            >
              <Image
                src={img}
                height={100}
                width={120}
                alt={`Thumbnail ${index + 1}`}
                className="h-[100px] w-[120px] object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
