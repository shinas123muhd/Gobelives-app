export default function TourDetailsSections({description,
      whatsInside=[],
      activities=[],
      priceDetails,
      precautions=[],
      languages=[],  
      duration,
      capacity,
      meetingPoint
    }) {
    // const description = {
    //   intro: "Get ready for an amazing trip to Agra, where you can check out the iconic Taj Mahal! It's not just a stunning sight, it's a symbol of love and one of the Seven Wonders of the World. This version includes the must-have history, cool architecture, local culture, and tasty food, giving you a fun and tasty travel experience.",
    //   subtitle: "Check out what's inside the package!",
    //   points: [
    //     "Visit the Taj Mahal: Enjoy the iconic white marble monument as sunrise or sunset for breathtaking views.",
    //     "Visit the Fort: A UNESCO World Heritage Site that highlights Mughal architecture and history.",
    //     "Check out Tomb: It's like a practice run for the Taj Mahal with gorgeous marble work!",
    //     "Optional Trip to Fatehpur Sikri: Explore this historic city known for its red sandstone buildings and Mughal demo.",
    //     "Savor Local Flavors: Try yummy sweets like petha and delicious Mughlai food!",
    //     "Guided Tour: Hear interesting stories and facts from a knowledgeable local guide."
    //   ]
    // };
  
    // const activities = [
    //   "Visit the iconic Taj Mahal with a guided tour",
    //   "Explore the majestic Agra Fort, a UNESCO World Heritage Site",
    //   "Enjoy panoramic views of the Taj Mahal from Mehtab Bagh (optional)",
    //   "Savor an authentic Mughlai lunch at a local restaurant",
    //   "Take an optional excursion to Fatehpur Sikri, the red sandstone ghost city",
    //   "Discover stunning photographic opportunities on the Yamuna River for a unique perspective of the Taj Mahal"
    // ];
  
    // const included = [
    //   "Comfortable AC transport with pickup & drop (hotel or airport)",
    //   "Entry tickets to monuments (optional)",
    //   "Local English speaking guide",
    //   "Bottled water and refreshments",
    //   "Fuel/ Parking/ taxes/ tolls"
    // ];
  
    // const notIncluded = [
    //   "Double-decker Boat/ Rikshaw tour",
    //   "Entry tickets to monuments (optional)",
    //   "Short trip along the River Thames",
    //   "Changing of the Guard",
    //   "Gratuities",
    //   "Meals"
    // ];

    // const precautions = [
    //     "All required protective equipment is provided",
    //     "All areas that customers touch are frequently cleaned",
    //     "You must keep social distance while in vehicles",
    //     "The number of visitors is limited to reduce crowds"
    // ]

    const details = {
        languages: ["English", "Hindi"],
        duration: "2 Days",
        numberOfPeople: "5 People",
        meetingPoint: {
          title: "Shilpgram Parking Lot (East Gate)",
          address: [
            "Address:",
            "Shilpgram, Near Eastern Gate of Taj Mahal,",
            "Forest Colony, Tajganj,",
            "Agra, Uttar Pradesh 282001, India"
          ]
        }
      };
  
    return (
      <div className="  py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Description Section */}
          <section className="space-y-4 py-2  border-b-4 [border-image:repeating-linear-gradient(to_right,#CEDADF_0,#CEDADF_10px,transparent_10px,transparent_20px)_1]">
            <h2 className="text-[#C4CDCA] font-raleway text-2xl font-bold">Description</h2>
            <div className="space-y-4 font-source-sans text-[#B3BEBA]">
              <p className="text-lg  leading-relaxed">
                {description}
              </p>
              <p className="font-source-sans text-[#B3BEBA] text-2xl font-semibold">Check out what's inside the package!</p>
              <ul className="space-y-2">
                {whatsInside?.map((point, index) => (
                  <li key={index} className=" flex gap-2 text-lg">
                    <span className=" mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
  
          {/* Activity Section */}
          <section className="space-y-4 py-2  border-b-4 [border-image:repeating-linear-gradient(to_right,#CEDADF_0,#CEDADF_10px,transparent_10px,transparent_20px)_1]">
            <h2 className="text-[#C4CDCA] font-raleway text-2xl font-bold">Activity</h2>
            <ul className="space-y-2">
              {activities.map((activity, index) => (
                <li key={index} className="text-[#B3BEBA] flex gap-2 text-lg">
                  <span className=" mt-1">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </section>
  
          {/* What is included / not included Section */}
          <section className="space-y-4 py-2  border-b-4 [border-image:repeating-linear-gradient(to_right,#CEDADF_0,#CEDADF_10px,transparent_10px,transparent_20px)_1]">
            <h2 className="text-[#C4CDCA] font-raleway text-2xl font-bold">What is included / not included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Includes */}
              <div className="space-y-3 text-[#C4CDCA] text-lg">
                <h3 className="  font-medium">Includes</h3>
                <ul className="space-y-2 ">
                  {priceDetails?.priceIncludes.map((item, index) => (
                    <li key={index} className=" flex gap-2">
                      <span className=" mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Not Includes */}
              <div className="space-y-3 text-[#C4CDCA] text-lg">
                <h3 className=" font-medium">Not Includes</h3>
                <ul className="space-y-2">
                  {priceDetails?.priceExcludes.map((item, index) => (
                    <li key={index} className=" flex gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Safety Section */}
          <section className="space-y-4 text-lg py-2  border-b-4 [border-image:repeating-linear-gradient(to_right,#CEDADF_0,#CEDADF_10px,transparent_10px,transparent_20px)_1]">
            <h2 className="text-[#C4CDCA] font-raleway text-2xl font-bold">Safety</h2>
            <h3 className="text-[#C4CDCA] font-raleway text-lg font-bold">Health Precautions</h3>
            <ul className="space-y-2">
              {precautions.map((pre, index) => (
                <li key={index} className="text-[#B3BEBA] flex gap-2">
                  <span className=" mt-1">•</span>
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 py-2 ">


        
        {/* Details Header */}
        <h2 className="text-[#C4CDCA] font-raleway text-2xl font-bold">Details</h2>

        {/* Language, Duration, Number of people */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
          
          {/* Language */}
          <div className="space-y-2">
            <h3 className="text-gray-300 font-medium">Language</h3>
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-400 ">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>{lang}</span>
              </div>
            ))}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <h3 className="text-gray-300 font-medium">Duration</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span>{duration?.value} {duration?.unit}</span>
            </div>
          </div>

          {/* Number of people */}
          <div className="space-y-2">
            <h3 className="text-gray-300 font-medium">Number of people</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span>{capacity?.maxGuests} Guests</span>
            </div>
          </div>
        </div>

        {/* Meeting point address */}
        <div className="space-y-2 text-lg">
          <h3 className="text-gray-300 font-medium">Meeting point address</h3>
          <div className="space-y-1">
            <div className="flex items-start gap-2 text-gray-400 ">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></span>
              <div>
                <p className="text-gray-300">{meetingPoint?.address}</p>
                
                  <p className="text-gray-400">{meetingPoint?.instructions}</p>
                
              </div>
            </div>
          </div>
        </div>


          </section>
  
        </div>
      </div>
    );
  }