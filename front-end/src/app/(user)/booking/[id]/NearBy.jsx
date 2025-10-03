"use client";

import Slider from "react-slick";
import LocationCard from "../../components/LocationCard";
import { LiaAngleLeftSolid, LiaAngleRightSolid  } from "react-icons/lia";



// Custom arrow buttons
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFD700] hover:border border-[#162721] absolute top-[-60px] right-0 z-10"
  >
    <LiaAngleRightSolid className="text-black" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#162721] hover:border border-[#FFD700]  absolute top-[-60px] right-14 z-10 "
  >
    <LiaAngleLeftSolid  className="text-white" />
  </button>
);

const NearBy = () => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
          { breakpoint: 1280, settings: { slidesToShow: 3 } },
          { breakpoint: 1024, settings: { slidesToShow: 2 } },
          { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
      };
  return (
    <div className="w-full py-5 ">
        <div className="flex justify-between">
            <div className='font-raleway flex flex-col gap-4 w-full py-5'>
                <h1 className='text-[#F2EEE2] text-4xl font-bold text-glow-white'>Near By Activities </h1>
                <p className='text-[#B3BEBA] w-2/3'>Discover your next adventure with Destination, a feature designed to help you explore new places and experiences tailored just for you.</p>
            </div>
            <div className="flex gap-2">
                <PrevArrow/>
                <NextArrow/>
            </div>
    </div>
    <Slider {...settings}>
        {Array.from({length:7}).map((_, index) => (
          <div key={index} className="px-2">
            <LocationCard />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default NearBy