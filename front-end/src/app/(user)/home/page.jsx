import Image from 'next/image';
import React from 'react';
import FilterBar from '../components/FilterBar';
import BannerSection from './BannerSection';
import Featured from './Featured';
import WhyChooseUs from './WhyChooseUs';
import PopularPackages from './PopularPackages';
import TrendingNow from './TrendingNow';
import Adventure from './Adventure';
import EventPackages from './EventPackages';
import Gallery from './Gallery';

const HomePage = () => {
  return (
    <div>
      <BannerSection/>
      <Featured/>
      <WhyChooseUs/>
      <PopularPackages/>
      <TrendingNow/>
      <Adventure/>
      <EventPackages/>
      <Gallery/>
    </div>
  );
};

export default HomePage;