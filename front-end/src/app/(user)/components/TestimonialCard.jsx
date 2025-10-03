import React from 'react';

const TestimonialCard = ({ name = "Galen Frost", title = "Adventure Seeker", testimonial = "An Exceptional Journey from the start to end", avatar = null }) => {
  return (
    <div className="bg-[#5E6D31] rounded-2xl p-6 w-fit shadow-lg font-outfit">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-green-400 flex-shrink-0 ">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="text-white flex flex-col gap-5">
          <div>
          <h3 className="font-semibold text-[#E4DAD7] text-lg leading-tight">{name}</h3>
          <p className="text-[#EBD5D19E] text-sm opacity-90 ">{title}</p>
          </div>
          <div>
            <blockquote className="text-[#E4DAD7] text-sm leading-relaxed max-w-32">
                "{testimonial}"
            </blockquote>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default TestimonialCard