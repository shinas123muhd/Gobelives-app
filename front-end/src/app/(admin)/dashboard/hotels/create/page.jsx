"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import HotelForm from "./components/HotelForm";
import { useCreateHotel } from "../../../hooks/useHotels";
import { hotelValidationSchema } from "./validation/hotelValidation";

const CreateHotel = () => {
  const router = useRouter();
  const createHotel = useCreateHotel();

  // Initial form values
  const initialValues = {
    // Basic Information
    name: "",
    website: "",
    email: "",
    description: "",
    shortDescription: "",
    location: "",
    address: "",
    phone: {
      code: "+1",
      number: "",
    },

    // Hotel Classification
    starRating: "",
    category: "",
    tags: [],

    // Location Details
    coordinates: {
      latitude: "",
      longitude: "",
      googleMapsLink: "",
    },

    // Room Information
    rooms: {
      totalRooms: "",
      availableRooms: "",
      roomTypes: [],
    },

    // Booking Information
    booking: {
      isBookable: true,
      advanceBookingDays: "",
      minimumStay: "1",
      maximumStay: "30",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      flexibleCheckIn: false,
      flexibleCheckOut: false,
    },

    // Pricing and Rates
    rates: {
      baseRate: "",
      currency: "USD",
      seasonalRates: [],
      weekendRates: {
        enabled: false,
        multiplier: "1.2",
      },
      taxes: {
        included: false,
        rate: "0",
      },
      fees: [],
    },

    // Availability
    availability: {
      isAvailable: true,
      quickOption: { type: "", startDate: "", endDate: "" },
      customRange: { startDate: "", endDate: "" },
      blackoutDates: [],
      maintenanceDates: [],
      seasonalAvailability: [],
    },

    // Guest Information
    guestInfo: {
      minimumAge: "0",
      maximumGuests: "4",
      childrenPolicy: {
        allowed: true,
        ageLimit: "12",
        charges: "free",
      },
      petPolicy: {
        allowed: false,
        restrictions: "",
        additionalFee: "0",
      },
    },

    // Policies
    policies: {
      checkIn: {
        time: "15:00",
        policy: "",
      },
      checkOut: {
        time: "11:00",
        policy: "",
      },
      cancellation: {
        freeCancellation: false,
        freeCancellationHours: "",
        policy: "",
      },
      petPolicy: {
        allowed: false,
        fee: "",
        restrictions: "",
      },
    },

    // Amenities and Features
    amenities: [],
    features: [],

    // What's Included/Excluded
    includedItems: [],
    excludedItems: [],

    // Media
    images: [],
    coverImage: "",

    // Status and Visibility
    status: "active",
    isActive: true,
    isFeatured: false,
    isVerified: false,

    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      twitterTitle: "",
    },
  };

  // Predefined amenities for selection
  const predefinedAmenities = [
    { name: "Free WiFi", icon: "wifi", category: "general" },
    { name: "Air Conditioning", icon: "ac", category: "room" },
    { name: "Swimming Pool", icon: "pool", category: "recreation" },
    { name: "Fitness Center", icon: "gym", category: "recreation" },
    { name: "Restaurant", icon: "restaurant", category: "dining" },
    { name: "Room Service", icon: "room-service", category: "dining" },
    { name: "Parking", icon: "parking", category: "general" },
    { name: "Business Center", icon: "business", category: "business" },
    { name: "Spa", icon: "spa", category: "recreation" },
    { name: "Concierge", icon: "concierge", category: "general" },
    { name: "Laundry Service", icon: "laundry", category: "general" },
    {
      name: "Airport Shuttle",
      icon: "airport-shuttle",
      category: "transportation",
    },
  ];

  // Predefined features for selection
  const predefinedFeatures = [
    {
      name: "Free cancellation",
      icon: "cancellation",
      description: "Cancel up to 24 hours in advance to receive a full refund.",
    },
    {
      name: "Early check-in",
      icon: "early-checkin",
      description:
        "Arrive earlier for no extra fee and enjoy more time at your destination.",
    },
    {
      name: "Complimentary breakfast",
      icon: "breakfast",
      description:
        "Start your day with a delicious breakfast included in your stay.",
    },
    {
      name: "Airport pickup",
      icon: "airport-transfer",
      description:
        "Convenient airport pickup service included in your package.",
    },
    {
      name: "Professional concierge",
      icon: "concierge",
      description: "Expert local concierge to enhance your experience.",
    },
    {
      name: "24/7 support",
      icon: "support",
      description: "Round-the-clock customer support during your stay.",
    },
  ];

  // Amenity category options
  const amenityCategoryOptions = [
    { value: "general", label: "General" },
    { value: "room", label: "Room" },
    { value: "recreation", label: "Recreation" },
    { value: "dining", label: "Dining" },
    { value: "business", label: "Business" },
    { value: "transportation", label: "Transportation" },
    { value: "accessibility", label: "Accessibility" },
  ];

  // Helper function to handle nested field updates
  const handleInputChange = (setFieldValue, field, value) => {
    setFieldValue(field, value);
  };

  const handleArrayChange = (setFieldValue, field, value) => {
    setFieldValue(field, value);
  };

  const addAmenity = (amenity, amenities, setFieldValue) => {
    const exists = amenities.some((a) => a.name === amenity.name);
    if (!exists) {
      setFieldValue("amenities", [...amenities, amenity]);
    }
  };

  const removeAmenity = (index, amenities, setFieldValue) => {
    setFieldValue(
      "amenities",
      amenities.filter((_, i) => i !== index)
    );
  };

  const addFeature = (feature, features, setFieldValue) => {
    const exists = features.some((f) => f.name === feature.name);
    if (!exists) {
      setFieldValue("features", [...features, feature]);
    }
  };

  const removeFeature = (index, features, setFieldValue) => {
    setFieldValue(
      "features",
      features.filter((_, i) => i !== index)
    );
  };

  // Custom amenity and feature creation
  const [newAmenity, setNewAmenity] = useState({
    name: "",
    category: "",
    icon: "",
  });
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Icon options for amenities
  const amenityIconOptions = [
    { value: "wifi", emoji: "📶" },
    { value: "ac", emoji: "❄️" },
    { value: "parking", emoji: "🅿️" },
    { value: "pool", emoji: "🏊" },
    { value: "gym", emoji: "💪" },
    { value: "restaurant", emoji: "🍽️" },
    { value: "spa", emoji: "🧘" },
    { value: "bar", emoji: "🍸" },
    { value: "concierge", emoji: "🎩" },
    { value: "room-service", emoji: "🛎️" },
    { value: "business", emoji: "💼" },
    { value: "laundry", emoji: "👕" },
    { value: "airport-shuttle", emoji: "🚌" },
    { value: "pet-friendly", emoji: "🐕" },
    { value: "accessible", emoji: "♿" },
    { value: "smoking", emoji: "🚭" },
    { value: "non-smoking", emoji: "🚭" },
    { value: "meeting", emoji: "🏢" },
    { value: "security", emoji: "🔒" },
    { value: "elevator", emoji: "🛗" },
    { value: "balcony", emoji: "🏠" },
    { value: "kitchen", emoji: "🍳" },
    { value: "tv", emoji: "📺" },
    { value: "phone", emoji: "📞" },
    { value: "custom", emoji: "⭐" },
  ];

  // Icon options for features
  const featureIconOptions = [
    { value: "cancellation", emoji: "❌" },
    { value: "early-checkin", emoji: "⏰" },
    { value: "late-checkout", emoji: "⏰" },
    { value: "breakfast", emoji: "🍳" },
    { value: "airport-transfer", emoji: "✈️" },
    { value: "city-tour", emoji: "🏛️" },
    { value: "concierge", emoji: "🎩" },
    { value: "support", emoji: "🆘" },
    { value: "luxury", emoji: "✨" },
    { value: "beachfront", emoji: "🏖️" },
    { value: "mountain-view", emoji: "🏔️" },
    { value: "city-center", emoji: "🏙️" },
    { value: "historic", emoji: "🏛️" },
    { value: "modern", emoji: "🏢" },
    { value: "boutique", emoji: "🎨" },
    { value: "family-friendly", emoji: "👨‍👩‍👧‍👦" },
    { value: "romantic", emoji: "💕" },
    { value: "business", emoji: "💼" },
    { value: "eco-friendly", emoji: "🌱" },
    { value: "pet-friendly", emoji: "🐕" },
    { value: "accessible", emoji: "♿" },
    { value: "smoking", emoji: "🚭" },
    { value: "non-smoking", emoji: "🚭" },
    { value: "wifi", emoji: "📶" },
    { value: "parking", emoji: "🅿️" },
    { value: "custom", emoji: "⭐" },
  ];

  const addCustomAmenity = (amenities, setFieldValue) => {
    if (newAmenity.name.trim() && newAmenity.category && newAmenity.icon) {
      const amenity = {
        name: newAmenity.name.trim(),
        category: newAmenity.category,
        icon: newAmenity.icon,
      };
      addAmenity(amenity, amenities, setFieldValue);
      setNewAmenity({ name: "", category: "", icon: "" });
    }
  };

  const addCustomFeature = (features, setFieldValue) => {
    if (
      newFeature.name.trim() &&
      newFeature.description.trim() &&
      newFeature.icon
    ) {
      const feature = {
        name: newFeature.name.trim(),
        description: newFeature.description.trim(),
        icon: newFeature.icon,
      };
      addFeature(feature, features, setFieldValue);
      setNewFeature({ name: "", description: "", icon: "" });
    }
  };

  const handleFileUpload = (files, setFieldValue) => {
    console.log("handleFileUpload called with:", files);
    // Filter out any non-File objects and empty objects
    const validFiles = files.filter((file) => file instanceof File);
    console.log("Valid files after filtering:", validFiles);

    setFieldValue("images", validFiles);
  };

  // Helper function to scroll to first error field
  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];

      // Handle nested field names (e.g., "phone.code" -> "phone_code")
      const fieldId = firstErrorField.replace(/\./g, "_");

      // Try to find the field by ID or name
      let targetElement =
        document.getElementById(fieldId) ||
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`[data-field="${firstErrorField}"]`);

      // If not found, try to find by the field name in various input types
      if (!targetElement) {
        // For nested fields, try different approaches
        const fieldParts = firstErrorField.split(".");
        if (fieldParts.length > 1) {
          // Try to find parent container and then the specific field
          const parentField = fieldParts[0];
          const childField = fieldParts[1];

          targetElement =
            document.querySelector(
              `[data-parent="${parentField}"] [data-field="${childField}"]`
            ) ||
            document.querySelector(`[name="${parentField}.${childField}"]`);
        }

        // If still not found, try to find by label text
        if (!targetElement) {
          const fieldLabels = {
            name: "Hotel Name",
            email: "Email",
            location: "Location",
            address: "Address",
            "phone.code": "Phone Number",
            "phone.number": "Phone Number",
            category: "Category",
            "rooms.totalRooms": "Total Rooms",
            "booking.minimumStay": "Minimum Stay",
            "booking.maximumStay": "Maximum Stay",
            "rates.baseRate": "Base Rate",
            "guestInfo.maximumGuests": "Maximum Guests",
            images: "Hotel Gallery",
          };

          const labelText = fieldLabels[firstErrorField];
          if (labelText) {
            const labelElement = Array.from(
              document.querySelectorAll("label")
            ).find((label) => label.textContent.includes(labelText));
            if (labelElement) {
              targetElement =
                labelElement.nextElementSibling ||
                labelElement.parentElement.querySelector(
                  "input, select, textarea"
                );
            }
          }
        }
      }

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Focus the element if it's focusable
        if (targetElement.focus) {
          setTimeout(() => targetElement.focus(), 300);
        }
      } else {
        // Fallback: scroll to the top of the form
        const formElement =
          document.querySelector("form") ||
          document.querySelector('[data-form="hotel-form"]');
        if (formElement) {
          formElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  };

  // Form submission handler
  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, setErrors }
  ) => {
    try {
      // Prepare form data for submission using FormData for file uploads
      const submitData = new FormData();

      // Add basic fields
      submitData.append("name", values.name);
      submitData.append("website", values.website || "");
      submitData.append("email", values.email);
      submitData.append("description", values.description || "");
      submitData.append("shortDescription", values.shortDescription || "");
      submitData.append("location", values.location);
      submitData.append("address", values.address);
      submitData.append(
        "starRating",
        values.starRating ? values.starRating : ""
      );
      submitData.append("category", values.category || "");
      submitData.append("status", values.status || "active");
      submitData.append("isActive", values.isActive.toString());
      submitData.append("isFeatured", values.isFeatured.toString());
      submitData.append("isVerified", values.isVerified.toString());

      // Add nested objects as JSON strings
      submitData.append("phone", JSON.stringify(values.phone));
      submitData.append("coordinates", JSON.stringify(values.coordinates));
      submitData.append(
        "rooms",
        JSON.stringify({
          totalRooms: values.rooms.totalRooms
            ? parseInt(values.rooms.totalRooms)
            : null,
          availableRooms: values.rooms.availableRooms
            ? parseInt(values.rooms.availableRooms)
            : 0,
          roomTypes: values.rooms.roomTypes || [],
        })
      );
      submitData.append(
        "booking",
        JSON.stringify({
          isBookable: values.booking.isBookable,
          advanceBookingDays: values.booking.advanceBookingDays
            ? parseInt(values.booking.advanceBookingDays)
            : 0,
          minimumStay: parseInt(values.booking.minimumStay),
          maximumStay: parseInt(values.booking.maximumStay),
          checkInTime: values.booking.checkInTime,
          checkOutTime: values.booking.checkOutTime,
          flexibleCheckIn: values.booking.flexibleCheckIn,
          flexibleCheckOut: values.booking.flexibleCheckOut,
        })
      );
      submitData.append(
        "rates",
        JSON.stringify({
          baseRate: values.rates.baseRate
            ? parseFloat(values.rates.baseRate)
            : null,
          currency: values.rates.currency,
          seasonalRates: values.rates.seasonalRates || [],
          weekendRates: {
            enabled: values.rates.weekendRates.enabled,
            multiplier: values.rates.weekendRates.multiplier
              ? parseFloat(values.rates.weekendRates.multiplier)
              : 1.2,
          },
          taxes: {
            included: values.rates.taxes.included,
            rate: values.rates.taxes.rate
              ? parseFloat(values.rates.taxes.rate)
              : 0,
          },
          fees: values.rates.fees || [],
        })
      );
      submitData.append(
        "availability",
        JSON.stringify({
          isAvailable: values.availability.isAvailable,
          blackoutDates: values.availability.blackoutDates || [],
          maintenanceDates: values.availability.maintenanceDates || [],
          seasonalAvailability: values.availability.seasonalAvailability || [],
        })
      );
      submitData.append(
        "guestInfo",
        JSON.stringify({
          minimumAge: parseInt(values.guestInfo.minimumAge),
          maximumGuests: parseInt(values.guestInfo.maximumGuests),
          childrenPolicy: {
            allowed: values.guestInfo.childrenPolicy.allowed,
            ageLimit: parseInt(values.guestInfo.childrenPolicy.ageLimit),
            charges: values.guestInfo.childrenPolicy.charges,
          },
          petPolicy: {
            allowed: values.guestInfo.petPolicy.allowed,
            restrictions: values.guestInfo.petPolicy.restrictions || null,
            additionalFee: values.guestInfo.petPolicy.additionalFee
              ? parseFloat(values.guestInfo.petPolicy.additionalFee)
              : 0,
          },
        })
      );
      submitData.append("policies", JSON.stringify(values.policies));
      submitData.append("seo", JSON.stringify(values.seo || {}));

      // Add arrays as JSON strings
      submitData.append("tags", JSON.stringify(values.tags || []));
      submitData.append("amenities", JSON.stringify(values.amenities || []));
      submitData.append("features", JSON.stringify(values.features || []));
      submitData.append(
        "includedItems",
        JSON.stringify(values.includedItems || [])
      );
      submitData.append(
        "excludedItems",
        JSON.stringify(values.excludedItems || [])
      );

      // Add files - only append actual File objects
      console.log("FormData images:", values.images);
      if (values.images && values.images.length > 0) {
        values.images.forEach((file, index) => {
          console.log(`File ${index}:`, file, "is File:", file instanceof File);
          // Only append if it's a valid File object
          if (file instanceof File) {
            console.log(`Appending file ${index} to FormData`);
            submitData.append("images", file);
          } else {
            console.log(`Skipping non-File object at index ${index}`);
          }
        });
      } else {
        console.log("No images to upload");
      }

      // Create hotel using the hook
      await createHotel.mutateAsync(submitData);

      toast.success("Hotel created successfully!");
      router.push("/dashboard/hotels");
    } catch (error) {
      console.error("Error creating hotel:", error);

      // Handle field-specific errors
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        // Check for specific field errors
        if (errorMessage.includes("Phone code")) {
          setFieldError("phone.code", errorMessage);
        } else if (errorMessage.includes("Phone number")) {
          setFieldError("phone.number", errorMessage);
        } else if (errorMessage.includes("email")) {
          setFieldError("email", errorMessage);
        } else if (errorMessage.includes("website")) {
          setFieldError("website", errorMessage);
        } else {
          // Show general error
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to create hotel. Please try again.");
      }

      // Scroll to first error field after a short delay to allow errors to be set
      setTimeout(() => {
        const currentErrors = {};
        // Get current form errors (this would need to be passed from Formik)
        scrollToFirstError(currentErrors);
      }, 100);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={hotelValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            setErrors,
          }) => {
            // Scroll to first error when validation fails
            useEffect(() => {
              if (
                Object.keys(errors).length > 0 &&
                Object.keys(touched).length > 0
              ) {
                // Only scroll if form has been touched and has errors
                const hasValidationErrors = Object.keys(errors).some(
                  (key) => touched[key] && errors[key]
                );
                if (hasValidationErrors) {
                  setTimeout(() => scrollToFirstError(errors), 100);
                }
              }
            }, [errors, touched]);

            return (
              <Form>
                <HotelForm
                  formData={values}
                  errors={errors}
                  touched={touched}
                  loading={isSubmitting}
                  predefinedAmenities={predefinedAmenities}
                  predefinedFeatures={predefinedFeatures}
                  amenityIconOptions={amenityIconOptions}
                  featureIconOptions={featureIconOptions}
                  amenityCategoryOptions={amenityCategoryOptions}
                  newAmenity={newAmenity}
                  setNewAmenity={setNewAmenity}
                  newFeature={newFeature}
                  setNewFeature={setNewFeature}
                  addCustomAmenity={(amenities) =>
                    addCustomAmenity(amenities, setFieldValue)
                  }
                  addCustomFeature={(features) =>
                    addCustomFeature(features, setFieldValue)
                  }
                  handleInputChange={(field, value) =>
                    handleInputChange(setFieldValue, field, value)
                  }
                  handleArrayChange={(field, value) =>
                    handleArrayChange(setFieldValue, field, value)
                  }
                  addAmenity={(amenity) =>
                    addAmenity(amenity, values.amenities, setFieldValue)
                  }
                  removeAmenity={(index) =>
                    removeAmenity(index, values.amenities, setFieldValue)
                  }
                  addFeature={(feature) =>
                    addFeature(feature, values.features, setFieldValue)
                  }
                  removeFeature={(index) =>
                    removeFeature(index, values.features, setFieldValue)
                  }
                  handleFileUpload={(files) =>
                    handleFileUpload(files, setFieldValue)
                  }
                  isEditMode={false}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};

export default CreateHotel;
