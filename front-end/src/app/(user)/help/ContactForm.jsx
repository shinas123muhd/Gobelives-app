"use client"
import React, { useState } from 'react';
import { Mail, Plane, MessageCircle, MapPin } from 'lucide-react';
import Image from 'next/image';

// Custom form hook for handling form state and validation
const useFormState = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(initialValues);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Simple validation
    validateField(name, value);
  };

  const validateField = (fieldName, fieldValue) => {
    const fieldValidations = {
      email: !fieldValue ? 'Email is required' : '',
      phone: !fieldValue ? 'Phone is required' : '',
      city: !fieldValue ? 'City is required' : '',
      message: !fieldValue ? 'Message is required' : ''
    };
    
    setValidationErrors(prev => ({ ...prev, [fieldName]: fieldValidations[fieldName] || '' }));
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    formData,
    validationErrors,
    touchedFields,
    handleInputChange,
    handleFieldBlur,
    handleFormSubmit
  };
};

const ContactForm = () => {
  const defaultFormValues = {
    email: '',
    phone: '',
    city: '',
    message: ''
  };

  const availableCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Other'
  ];

  const handleFormSubmission = (formValues) => {
    console.log('Form submitted:', formValues);
    // Handle form submission here
    alert('Form submitted successfully!');
  };

  const {
    formData,
    validationErrors,
    touchedFields,
    handleInputChange,
    handleFieldBlur,
    handleFormSubmit
  } = useFormState({ initialValues: defaultFormValues, onSubmit: handleFormSubmission });

  return (
    <div className=" min-h-screen py-12  font-raleway">
      <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-8 px-8">
              Still Need Help?
            </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-end">
        
          {/* Left Column - Form */}
          <div className=" px-8 ">
            
            
            <form onSubmit={handleFormSubmit}>
                <div className="space-y-6">
                  
                  {/* Email and Phone Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-teal-200 text-sm font-medium">Your Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          placeholder="Your Email"
                          className="w-full  border border-teal-600/30 rounded-xl px-4 py-3 text-white placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:bg-teal-800/70 transition-all duration-200"
                        />
                        <Mail className="absolute right-3 top-3.5 w-5 h-5 text-teal-400" />
                      </div>
                      {touchedFields.email && validationErrors.email && (
                        <p className="text-red-400 text-xs">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-teal-200 text-sm font-medium">Your Phone</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          placeholder="Your Phone"
                          className="w-full  border border-teal-600/30 rounded-xl px-4 py-3 text-white placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:bg-teal-800/70 transition-all duration-200"
                        />
                        <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-teal-400" />
                      </div>
                      {touchedFields.phone && validationErrors.phone && (
                        <p className="text-red-400 text-xs">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* City Select */}
                  <div className="space-y-2">
                    <label className="text-teal-200 text-sm font-medium">City</label>
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        className="w-full  border border-teal-600/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400 focus:bg-teal-800/70 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-teal-800">Select Your City</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city} className="bg-teal-800">{city}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none">
                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {touchedFields.city && validationErrors.city && (
                      <p className="text-red-400 text-xs">{validationErrors.city}</p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label className="text-teal-200 text-sm font-medium">Message</label>
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        placeholder="Write Message"
                        rows={4}
                        className="w-full  border border-teal-600/30 rounded-xl px-4 py-3 text-white placeholder-teal-300 focus:outline-none focus:border-teal-400 focus:bg-teal-800/70 transition-all duration-200 resize-none"
                      />
                      <MessageCircle className="absolute right-3 top-3 w-5 h-5 text-teal-400" />
                    </div>
                    {touchedFields.message && validationErrors.message && (
                      <p className="text-red-400 text-xs">{validationErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    Send
                  </button>
                </div>
            </form>
          </div>

          {/* Right Column - Illustration */}
          <Image src={"/images/FormImage.jpg"} height={485} width={662} className='h-[400px] w-full object-cover rounded-2xl'/>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;