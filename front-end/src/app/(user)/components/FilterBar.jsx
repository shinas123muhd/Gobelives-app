"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 

export default function FilterBar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTourDropdown, setShowTourDropdown] = useState(false);
  const [destination, setDestination] = useState("");
  const [selectedDate,  setSelectedDate] = useState("")
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [tourType, setTourType] = useState("All tour");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Refs to detect outside clicks
  const whereRef = useRef(null);
  const calendarRef = useRef(null);
  const tourRef = useRef(null);

  const destinations = [
    "Paris, France",
    "London, UK",
    "Dubai, UAE",
    "Tokyo, Japan",
    "Bali, Indonesia",
  ];

  const filtered = destinations.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  const handleDateChange = (item) => {
    const selection = item.selection;
    setDateRange([selection]);
    const start = selection.startDate;
    const end = selection.endDate;
    const formatted = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    setSelectedDate(formatted);
    // Close after end date is chosen (different from start)
    if (start && end && start.getTime() !== end.getTime()) {
      // small UX delay so users can see selection land
      setTimeout(() => setShowCalendar(false), 250);
    }
  };

  // Outside click handler to close any open overlay
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (
        whereRef.current && !whereRef.current.contains(target) &&
        calendarRef.current && !calendarRef.current.contains(target) &&
        tourRef.current && !tourRef.current.contains(target)
      ) {
        setOpen(false);
        setShowCalendar(false);
        setShowTourDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex items-center justify-between font-source-sans bg-[#FFD700] rounded-2xl shadow-lg px-6 py-4 gap-10 mx-auto mt-10"
    >
      {/* Where */}
      <div ref={whereRef} className="relative flex items-center space-x-3 border-r border-black/10 pr-6 cursor-pointer">
      <Image src="/svgs/Mappin.svg" alt="Where" width={40} height={40} className="text-black w-10 h-10 border border-black p-3 rounded-full" />
      <div onClick={() => setOpen(!open)}>
        <p className="text-sm text-black font-raleway font-semibold">Where</p>
        <p className="text-xs text-black/70">
          {query ? query : "Search Destinations"}
        </p>
      </div>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 bg-white text-black  rounded-xl shadow-lg w-64 p-4 z-50"
          >
            {/* Search Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />

            {/* Suggestions */}
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((d) => (
                  <div
                    key={d}
                    onClick={() => {
                      setQuery(d);
                      setOpen(false);
                    }}
                    className="px-3 py-2 text-sm hover:bg-yellow-100 hover:text-black rounded-md cursor-pointer"
                  >
                    {d}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No results</p>
              )}
            </div>
          </motion.div>
          )}
      </AnimatePresence>
    </div>

      {/* When */}
      <div
        className="relative flex items-center space-x-3 border-r border-black/10 px-6 cursor-pointer"
        onClick={() => {
          // open calendar, close others
          setShowCalendar((prev) => !prev);
          setOpen(false);
          setShowTourDropdown(false);
        }}
      >
        <div  className="border border-black rounded-full">
        <Image src="/svgs/Calender.svg" alt="Calendar" width={40} height={40} className="text-black w-10 h-10  p-3 " />
        </div>
        <div>
          <p className="text-sm text-black font-raleway font-semibold">When</p>
          <p className="text-xs text-black/70">
            {selectedDate || "Select Date"}
          </p>
        </div>

        {/* Calendar Popup */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-0 bg-white p-4 rounded-xl shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
              ref={calendarRef}
            >
              <DateRange
                ranges={dateRange}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                rangeColors={["#facc15"]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tour Type */}
      <div
        className="relative flex items-center space-x-3 px-6 cursor-pointer"
        onClick={() => {
          setShowTourDropdown((prev) => !prev);
          setOpen(false);
          setShowCalendar(false);
        }}
      >
        <Image src="/svgs/DownArrow.svg" alt="Tour Type" width={40} height={40} className="text-black w-10 h-10 border border-black  p-3 rounded-full " />
        <div>
          <p className="text-sm font-semibold font-raleway text-black">Tour Type</p>
          <p className="text-xs text-black/70">{tourType}</p>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showTourDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-0 bg-white text-black  rounded-xl shadow-lg p-2 w-40 z-50"
              ref={tourRef}
            >
              {["All tour", "Adventure", "City", "Beach", "Cultural"].map(
                (type) => (
                  <div
                    key={type}
                    className="px-3 py-2 text-sm hover:bg-yellow-100 rounded-md cursor-pointer"
                    onClick={() => {
                      setTourType(type);
                      setShowTourDropdown(false);
                    }}
                  >
                    {type}
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gray-800 text-white rounded-full p-2 ml-4 shadow-lg"
        onClick={() =>
          alert(
            `Searching for ${destination || "Anywhere"} | ${dateRange[0].startDate.toDateString()} to ${dateRange[0].endDate.toDateString()} | ${tourType}`
          )
        }
      >
        <Image src="/svgs/GoIcon.svg" alt="Search" width={40} height={40} className="text-black w-10 h-10  p-2 " />
      </motion.button>
    </motion.div>
  );
}
