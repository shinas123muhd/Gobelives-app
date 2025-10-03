import Image from "next/image";

const Section2 = () => {
  return (
    <div className="grid grid-cols-2 items-center pb-10">
      {/* Top-left text */}
      <div className="font-source-sans pt-10 pl-14 flex flex-col gap-3 ">
        <h2 className="text-[#FFFF00]">Travel Tips, Destinations</h2>
        <h1 className="text-[#E4E4D7] text-4xl">
          Don't Miss These Key Destinations
        </h1>
        <p className="text-[#E4E4D7] text-xl">
          Explore the top destinations you shouldn't miss on your journey
          through the Amalfi Coast.
        </p>
        <span className="text-[#EBEBD19E]">October 10, 2023</span>
      </div>

      {/* Top-right image */}
      <div className="relative w-full h-[720px]">
        <Image
          src="/images/Destination.png"
          alt="Destination"
          fill
          className="object-cover"
        />
      </div>

      {/* Bottom-left image */}
      <div className="relative w-full h-[720px]">
        <Image
          src="/images/Cuisine.png"
          alt="Cuisine"
          fill
          className="object-cover"
        />
      </div>

      {/* Bottom-right text */}
      <div className="font-source-sans pt-10 pl-14 flex flex-col gap-3 ">
        <h2 className="text-[#FFFF00]">Food, Culture</h2>
        <h1 className="text-[#E4E4D7] text-4xl">Local Cuisine and Culture</h1>
        <p className="text-[#E4E4D7] text-xl">
          Indulge in the flavors of the Amalfi Coast with our guide to the best
          local dishes and cultural experiences.
        </p>
        <span className="text-[#EBEBD19E]">October 15, 2023</span>
      </div>
    </div>
  );
};

export default Section2;
