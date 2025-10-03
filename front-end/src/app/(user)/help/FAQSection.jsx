import React from 'react';
import { Shield, CreditCard, User } from 'lucide-react';

const FAQSection = () => {
  const faqData = [
    {
      section: "General Questions",
      icon: <Shield color='#FFD700' className="w-5 h-5" />,
      questions: [
        {
          q: "What is Globehive?",
          a: "Globehive is a platform that offers curated travel packages and lifestyle experiences, bringing culture, adventure, and comfort together in one place."
        },
        {
          q: "How do I book a package?",
          a: "Booking is simple:\n• Browse our curated packages\n• Choose your desired trip\n• Click 'Book Now' and follow the simple steps"
        },
        {
          q: "Can I customize a package?",
          a: "Yes! We offer flexible customization options, contact our support team directly."
        }
      ]
    },
    {
      section: "Payments & Refunds",
      icon: <CreditCard color='#FFD700' className="w-5 h-5" />,
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept UPI, Credit/Debit Cards, Net Banking, and Wallets."
        },
        {
          q: "Is my payment secure?",
          a: "Absolutely. All payments are processed through encrypted and verified gateways."
        },
        {
          q: "What is the cancellation policy?",
          a: "You can cancel up to 48 hours before the trip for a partial refund. Some conditions may apply depending on the package."
        }
      ]
    },
    {
      section: "Account & Support",
      icon: <User color='#FFD700' className="w-5 h-5" />,
      questions: [
        {
          q: "Do I need to create an account to book?",
          a: "You can cancel up to 48 hours before the trip for a partial refund. Some conditions may apply depending on the package."
        },
        {
          q: "How can I contact support?",
          a: "You can reach via text."
        }
      ]
    }
  ];

  const formatAnswer = (answer) => {
    if (answer.includes('•')) {
      const lines = answer.split('\n');
      return (
        <div>
          {lines.map((line, index) => {
            if (line.includes('•')) {
              return (
                <div key={index} className="flex items-start gap-2 ml-4">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{line.replace('•', '').trim()}</span>
                </div>
              );
            }
            return <div key={index} className="mb-2">{line}</div>;
          })}
        </div>
      );
    }
    return answer;
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl ">
       
        
        <div className="space-y-8">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className=" ">
              {/* Section Header */}
              <div className=" text-white  py-4 rounded-t-lg flex items-center gap-3 ">
                <div className='border border-[#FFD700] rounded-full  p-2'>{section.icon}</div>
                <h2 className="text-3xl text-[#E4E4D7] font-bold">{section.section}</h2>
              </div>
              
              {/* Questions */}
              <div className=" space-y-6">
                {section.questions.map((item, index) => (
                  <div key={index} className=" last:border-b-0 pb-4 last:pb-0">
                    <h3 className="text-2xl font-bold text-[#E4E4D7] mb-3 flex items-start gap-2">
                      <span className="text-[#E4E4D7] font-bold ">{index + 1}.</span>
                      {item.q}
                    </h3>
                    <div className="text-[#E4E4D7] leading-relaxed ml-6 text-2xl">
                      {formatAnswer(item.a)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default FAQSection;