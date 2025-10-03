"use client"
export default function MapLocation() {
    // Replace with your actual coordinates
    const latitude = 27.1751;
    const longitude = 78.0421;
    const locationName = "Taj Mahal, Agra";
  
    // Google Maps URL
    const openInMaps = () => {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    };
  
    return (
      <div className=" flex flex-col   ">
        
        <button
            onClick={openInMaps}
            className="  text-[#7BBCB0] font-raleway underline font-bold px-4 py-2   flex items-center gap-2"
          >

            Open in Google Maps
          </button>
         {/* Open in Maps Button */}
        
        <div className="relative w-[420px] h-[420px]">
          
         
  
          {/* Map iframe */}
          <iframe
            className="w-full h-full rounded-2xl shadow-2xl border-4 border-gray-700"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={locationName}
          ></iframe>
        </div>
      </div>
    );
  }