"use client";

import React from "react";

export default function MapLocation({ location }) {
  // Extract latitude and longitude from the map URL
  const match = location?.match(/@([-.\d]+),([-.\d]+)/);
  const latitude = match ? parseFloat(match[1]) : 0;
  const longitude = match ? parseFloat(match[2]) : 0;

  // Function to open the original Google Maps link
  const openInMaps = () => {
    window.open(location, "_blank");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Open in Google Maps Button */}
      <button
        onClick={openInMaps}
        className="text-[#7BBCB0] font-raleway underline font-bold px-4 py-2 flex items-center gap-2 hover:text-[#62a99c] transition-colors"
      >
        Open in Google Maps
      </button>

      {/* Embedded Map */}
      <div className="relative w-[420px] h-[420px]">
        <iframe
          className="w-full h-full rounded-2xl shadow-2xl border border-gray-600"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map Location"
        ></iframe>
      </div>
    </div>
  );
}
