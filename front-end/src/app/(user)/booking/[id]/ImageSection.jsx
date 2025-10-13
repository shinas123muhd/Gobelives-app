"use client"
import Image from "next/image";
import React, { useState } from "react";

const ImageSection = ({ images = [] }) => {

  // active image state, default to first image
  const [activeImage, setActiveImage] = useState(images[0]?.url || null);

  return (
    <div>
      <div>
        {/* Main active image */}
        {activeImage && (
          <div className="relative w-full h-[420px] rounded-t-2xl overflow-hidden">
          <Image
            src={activeImage}
            alt="Main image"
            fill
            priority
            className="object-cover"

            quality={100} // <-- make sure image quality is max
          />
        </div>
        )}

        {/* Thumbnails */}
        <div className="flex justify-center mt-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2">
          {images?.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(img.url)}
              className={`flex-shrink-0 rounded-t-2xl overflow-hidden border-2 ${
                activeImage === img.url ? "border-blue-500" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                height={100}
                width={140}
                className="object-cover h-[80px] w-[120px] rounded-t-2xl"
                quality={90}
              />
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ImageSection;
