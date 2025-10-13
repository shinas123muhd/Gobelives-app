"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Section1 = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 600; // scroll distance per click
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="text-[#E4E4D7]">
      {/* Intro Section */}
      <div className="w-1/2 flex flex-col gap-6 p-14">
        <h1 className="font-raleway font-bold text-4xl">
          Exploring the Hidden Gems of the Amalfi Coast
        </h1>
        <p className="font-source-sans text-xl">
          Discover the breathtaking beauty and hidden treasures of Italy's Amalfi Coast.
          From picturesque villages to stunning beaches, this guide will take you through
          the must-see spots.
        </p>
      </div>

      {/* Banner Image */}
      <div className="h-screen w-full">
        <Image
        src="/images/BlogBanner.png"
        alt="banner"
        height={774}
        width={1440}
        className="h-full w-full object-cover"
      />
      </div>

      {/* Paragraph 1 */}
      <p className="font-source-sans p-14 w-1/2 text-xl text-[#E4E4D7]">
        The Amalfi Coast is a stunning stretch of coastline in Southern Italy, renowned
        for its picturesque landscapes, charming villages, and crystal-clear waters. As
        you travel along the winding roads, you'll be greeted with breathtaking views at
        every turn. This guide will take you through some of the hidden gems that make
        the Amalfi Coast a must-visit destination. From the bustling town of Positano to
        the serene beaches of Ravello, each stop offers a unique experience that captures
        the essence of Italian charm. Whether you're looking for adventure, relaxation,
        or a taste of local culture, the Amalfi Coast has something for everyone.
      </p>

      {/* Image Scroller Section */}
      <div className="relative my-10">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-5 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md p-3 transition-all duration-200 hover:scale-110"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex  overflow-x-auto gap-5 scrollbar-hide scroll-smooth"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src="/images/BlogImg1.png"
                alt="Blog"
                height={420}
                width={540}
                className="h-[420px] w-[540px] rounded-2xl object-cover shadow-md hover:scale-x-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md p-3 transition-all duration-200 hover:scale-110"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Paragraph 2 */}
      <p className="font-source-sans p-14 w-1/2 text-xl text-[#E4E4D7]">
        Beyond the popular tourist spots, the Amalfi Coast is home to lesser-known
        treasures that are waiting to be explored. Venture off the beaten path to
        discover quaint fishing villages, hidden coves, and historic sites that offer a
        glimpse into the region's rich history and culture. Whether you're hiking the
        scenic trails of the Path of the Gods or sampling the local cuisine at a
        family-run trattoria, you'll find that the Amalfi Coast is full of surprises.
        Embrace the slower pace of life and take the time to immerse yourself in the
        beauty and tranquility of this enchanting destination.
      </p>
    </div>
  );
};

export default Section1;
