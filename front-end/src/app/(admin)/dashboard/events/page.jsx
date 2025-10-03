"use client";
import React from "react";
import EventFilter from "@/app/(admin)/components/EventFilter";
import EventCalendar from "@/app/(admin)/components/EventCalendar";

const Events = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <EventFilter />

      {/* Calendar Section */}
      <EventCalendar />
    </section>
  );
};

export default Events;
