"use client"
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import MainButton from './MainButton';

// Card data


const FeatureCard = ({ card, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      className="relative h-[468px] rounded-2xl overflow-hidden group "
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${card.image})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-black/30`} />
      
      {/* Content */}
      <div className="relative h-full  flex items-end ">
        <div className='flex flex-col h-1/2  gap-5 bg-[#7A95973D] p-6 justify-end items-center text-white text-center '>
          <motion.h3 
            className="text-2xl font-bold mb-3 "
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
          >
            {card.title}
          </motion.h3>
          <motion.p 
            className="text-sm text-gray-200 leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
          >
            {card.description}
          </motion.p>
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
          className='z-10'
        >
          <MainButton 
          text={"Explore Now"}
            
          />
        </motion.div>
        </div>
        
        
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};
export default FeatureCard;