"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import HotelForm from "../../create/components/HotelForm";
import {
  useHotel,
  useUpdateHotel,
  useDeleteHotelImage,
} from "../../../../hooks/useHotels";
import { hotelValidationSchema } from "../../create/validation/hotelValidation";

const EditHotel = () => {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id;

  const { data: hotelData, isLoading, error } = useHotel(hotelId);
  const updateHotel = useUpdateHotel();
  const deleteHotelImage = useDeleteHotelImage();

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

  const [formValues, setFormValues] = useState(initialValues);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

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

  // Populate form data when hotel data is loaded
  useEffect(() => {
    if (hotelData?.data) {
      const data = hotelData.data;
      setFormValues({
        name: data.name || "",
        website: data.website || "",
        email: data.email || "",
        description: data.description || "",
        shortDescription: data.shortDescription || "",
        location: data.location || "",
        address: data.address || "",
        phone: {
          code: data.phone?.code || "+1",
          number: data.phone?.number || "",
        },
        starRating: data.starRating?.toString() || "",
        category: data.category || "",
        tags: data.tags || [],
        coordinates: {
          latitude: data.coordinates?.latitude?.toString() || "",
          longitude: data.coordinates?.longitude?.toString() || "",
          googleMapsLink: data.coordinates?.googleMapsLink || "",
        },
        rooms: {
          totalRooms: data.rooms?.totalRooms?.toString() || "",
          availableRooms: data.rooms?.availableRooms?.toString() || "",
          roomTypes: data.rooms?.roomTypes || [],
        },
        booking: {
          isBookable: data.booking?.isBookable ?? true,
          advanceBookingDays:
            data.booking?.advanceBookingDays?.toString() || "",
          minimumStay: data.booking?.minimumStay?.toString() || "1",
          maximumStay: data.booking?.maximumStay?.toString() || "30",
          checkInTime: data.booking?.checkInTime || "15:00",
          checkOutTime: data.booking?.checkOutTime || "11:00",
          flexibleCheckIn: data.booking?.flexibleCheckIn ?? false,
          flexibleCheckOut: data.booking?.flexibleCheckOut ?? false,
        },
        rates: {
          baseRate: data.rates?.baseRate?.toString() || "",
          currency: data.rates?.currency || "USD",
          seasonalRates: data.rates?.seasonalRates || [],
          weekendRates: {
            enabled: data.rates?.weekendRates?.enabled ?? false,
            multiplier:
              data.rates?.weekendRates?.multiplier?.toString() || "1.2",
          },
          taxes: {
            included: data.rates?.taxes?.included ?? false,
            rate: data.rates?.taxes?.rate?.toString() || "0",
          },
          fees: data.rates?.fees || [],
        },
        availability: {
          isAvailable: data.availability?.isAvailable ?? true,
          quickOption: data.availability?.quickOption || {
            type: "",
            startDate: "",
            endDate: "",
          },
          customRange: data.availability?.customRange || {
            startDate: "",
            endDate: "",
          },
          blackoutDates: data.availability?.blackoutDates || [],
          maintenanceDates: data.availability?.maintenanceDates || [],
          seasonalAvailability: data.availability?.seasonalAvailability || [],
        },
        guestInfo: {
          minimumAge: data.guestInfo?.minimumAge?.toString() || "0",
          maximumGuests: data.guestInfo?.maximumGuests?.toString() || "4",
          childrenPolicy: {
            allowed: data.guestInfo?.childrenPolicy?.allowed ?? true,
            ageLimit:
              data.guestInfo?.childrenPolicy?.ageLimit?.toString() || "12",
            charges: data.guestInfo?.childrenPolicy?.charges || "free",
          },
          petPolicy: {
            allowed: data.guestInfo?.petPolicy?.allowed ?? false,
            restrictions: data.guestInfo?.petPolicy?.restrictions || "",
            additionalFee:
              data.guestInfo?.petPolicy?.additionalFee?.toString() || "0",
          },
        },
        policies: {
          checkIn: {
            time: data.policies?.checkIn?.time || "15:00",
            policy: data.policies?.checkIn?.policy || "",
          },
          checkOut: {
            time: data.policies?.checkOut?.time || "11:00",
            policy: data.policies?.checkOut?.policy || "",
          },
          cancellation: {
            freeCancellation:
              data.policies?.cancellation?.freeCancellation ?? false,
            freeCancellationHours:
              data.policies?.cancellation?.freeCancellationHours?.toString() ||
              "",
            policy: data.policies?.cancellation?.policy || "",
          },
          petPolicy: {
            allowed: data.policies?.petPolicy?.allowed ?? false,
            fee: data.policies?.petPolicy?.fee?.toString() || "",
            restrictions: data.policies?.petPolicy?.restrictions || "",
          },
        },
        amenities: data.amenities || [],
        features: data.features || [],
        includedItems: data.includedItems || [],
        excludedItems: data.excludedItems || [],
        images: data.images || [],
        coverImage: data.coverImage || "",
        status: data.status || "active",
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isVerified: data.isVerified ?? false,
        seo: {
          metaTitle: data.seo?.metaTitle || "",
          metaDescription: data.seo?.metaDescription || "",
          keywords: data.seo?.keywords || [],
          canonicalUrl: data.seo?.canonicalUrl || "",
          ogTitle: data.seo?.ogTitle || "",
          ogDescription: data.seo?.ogDescription || "",
          twitterTitle: data.seo?.twitterTitle || "",
        },
      });

      // Set existing images separately
      setExistingImages(data.images || []);
    }
  }, [hotelData]);

  // Helper function to handle nested field updates
  const handleInputChange = (setFieldValue, field, value) => {
    setFieldValue(field, value);
  };

  const handleArrayChange = (setFieldValue, field, value) => {
    setFieldValue(field, value);
  };

  const addAmenity = (amenity, currentAmenities, setFieldValue) => {
    const exists = currentAmenities.some((a) => a.name === amenity.name);
    if (!exists) {
      setFieldValue("amenities", [...currentAmenities, amenity]);
    }
  };

  const removeAmenity = (index, currentAmenities, setFieldValue) => {
    setFieldValue(
      "amenities",
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  const addFeature = (feature, currentFeatures, setFieldValue) => {
    const exists = currentFeatures.some((f) => f.name === feature.name);
    if (!exists) {
      setFieldValue("features", [...currentFeatures, feature]);
    }
  };

  const removeFeature = (index, currentFeatures, setFieldValue) => {
    setFieldValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
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

  const addCustomAmenity = (currentAmenities, setFieldValue) => {
    if (newAmenity.name.trim() && newAmenity.category && newAmenity.icon) {
      const amenity = {
        name: newAmenity.name.trim(),
        category: newAmenity.category,
        icon: newAmenity.icon,
      };
      addAmenity(amenity, currentAmenities, setFieldValue);
      setNewAmenity({ name: "", category: "", icon: "" });
    }
  };

  const addCustomFeature = (currentFeatures, setFieldValue) => {
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
      addFeature(feature, currentFeatures, setFieldValue);
      setNewFeature({ name: "", description: "", icon: "" });
    }
  };

  const handleFileUpload = (files, setFieldValue) => {
    // Add new files to newImages state
    setNewImages((prev) => [...prev, ...files]);
    // Update form values with combined existing and new images
    const allImages = [...existingImages, ...newImages, ...files];
    setFieldValue("images", allImages);
  };

  const handleFileRemove = async (imageToRemove, setFieldValue) => {
    try {
      // Check if it's an existing image (has _id) or a new image (File object)
      if (imageToRemove._id) {
        // Existing image - delete from server
        await deleteHotelImage.mutateAsync({
          hotelId,
          imageId: imageToRemove._id,
        });

        // Remove from existing images
        setExistingImages((prev) =>
          prev.filter((img) => img._id !== imageToRemove._id)
        );
        toast.success("Image deleted successfully");
      } else {
        // New image - just remove from newImages
        setNewImages((prev) =>
          prev.filter((_, index) => index !== imageToRemove.index)
        );
        toast.success("Image removed from upload queue");
      }

      // Update form values with remaining images
      const remainingExisting = existingImages.filter(
        (img) => img._id !== imageToRemove._id
      );
      const remainingNew = newImages.filter(
        (_, index) => index !== imageToRemove.index
      );
      const allImages = [...remainingExisting, ...remainingNew];
      setFieldValue("images", allImages);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  // Formik submit handler
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

      // Add files (only new uploads - File objects)
      if (newImages && newImages.length > 0) {
        newImages.forEach((file) => {
          if (file instanceof File) {
            submitData.append("images", file);
          }
        });
      }

      // Add existing images as JSON (for tracking which ones to keep)
      if (existingImages && existingImages.length > 0) {
        submitData.append("existingImages", JSON.stringify(existingImages));
      }

      // Update hotel using the hook
      await updateHotel.mutateAsync({ id: hotelId, data: submitData });

      toast.success("Hotel updated successfully!");
      router.push("/dashboard/hotels");
    } catch (error) {
      console.error("Error updating hotel:", error);

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
        toast.error("Failed to update hotel. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D332C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading hotel</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!hotelData?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Hotel not found</p>
          <button
            onClick={() => router.push("/dashboard/hotels")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Formik
          initialValues={formValues}
          validationSchema={hotelValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          enableReinitialize={true}
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
                  handleFileRemove={(imageToRemove) =>
                    handleFileRemove(imageToRemove, setFieldValue)
                  }
                  isEditMode={true}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </section>
  );
};

export default EditHotel;
