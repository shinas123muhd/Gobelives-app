import React from 'react';
import { Mail, MessageCircle, Phone, Check } from 'lucide-react';

const TravelAssistant = () => {
  const features = [
    "Free Consulting",
    "Talk With Experts",
    "Clear Pricing"
  ];

  const contactMethods = [
    {
      icon: <Mail  className="w-8 h-8" />,
      title: "Email",
      subtitle: "You Can Mail Any Assistance",
      contact: "globehive@gmail.com",
      action: "mailto:globehive@gmail.com"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      subtitle: "Need to chat with Our Expert ?",
      contact: "Click Here",
      action: "#"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone",
      subtitle: "Talk to Our Experts Directly",
      contact: "+91 9087654321",
      action: "tel:+919087654321"
    }
  ];

  return (
    <div className=" text-white py-12 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Section - Title and Features */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#FFD700] mb-6 leading-tight">
                Looking for a Travel Assistant?
              </h2>
              <p className="text-[#91A19C]  leading-relaxed mb-8">
                Our UAE visa and license services make your application process easier and faster. We provide digital solutions to boost your online presence.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#C4CDCA] flex-shrink-0" />
                  <span className="text-[#C4CDCA] font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Contact Methods */}
          <div className="grid grid-cols-3  gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="  rounded-xl ">
                <div className="flex flex-col  gap-4">
                  {/* Icon */}
                  <div className=" rounded-lg  flex-shrink-0">
                    {method.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {method.title}
                    </h3>
                    <p className="text-teal-100 w-2/3 text-sm mb-3 leading-relaxed">
                      {method.subtitle}
                    </p>
                    
                    {/* Contact Link */}
                    <a 
                      href={method.action}
                      className="inline-block text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200 hover:underline"
                    >
                      {method.contact}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAssistant;