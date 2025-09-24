"use client";
import React, { useState } from "react";
import PackageForm from "./components/PackageForm";

const CreatePackage = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    shortDescription: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      link: "",
    },
    meetingPoint: {
      address: "",
      instructions: "",
    },

    // Pricing
    price: {
      basePrice: "",
      currency: "USD",
      priceIncludes: [],
      priceExcludes: [],
    },

    // Capacity and Duration
    capacity: {
      maxGuests: "",
      minGuests: "1",
    },
    duration: {
      value: "",
      unit: "days",
    },

    // Features and Activities
    activities: [],
    languages: [],
    tags: [],
    category: "",

    // Policies
    cancellationPolicy: "moderate",
    healthSafetyMeasures: [],

    // Media
    images: [],
    coverImage: "",

    // Status
    status: "draft",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Feature highlights state
  const [featureHighlight, setFeatureHighlight] = useState({
    icon: "",
    name: "",
    description: "",
  });
  const [featureHighlights, setFeatureHighlights] = useState([]);

  // Predefined features for selection
  const predefinedFeatures = [
    {
      name: "Free cancellation",
      description: "Cancel up to 24 hours in advance to receive a full refund.",
    },
    {
      name: "Early check-in",
      description:
        "Arrive earlier for no extra fee and enjoy more time at your destination.",
    },
    {
      name: "Complimentary breakfast",
      description:
        "Start your day with a delicious breakfast included in your stay.",
    },
    {
      name: "Airport pickup",
      description:
        "Convenient airport pickup service included in your package.",
    },
    {
      name: "Professional guide",
      description: "Expert local guide to enhance your experience.",
    },
    {
      name: "24/7 support",
      description: "Round-the-clock customer support during your trip.",
    },
  ];

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeatureHighlight = () => {
    if (featureHighlight.name && featureHighlight.description) {
      const newFeature = {
        id: Date.now(),
        icon: featureHighlight.icon,
        name: featureHighlight.name,
        description: featureHighlight.description,
      };
      setFeatureHighlights((prev) => [...prev, newFeature]);
      setFeatureHighlight({ icon: "", name: "", description: "" });
    }
  };

  const removeFeatureHighlight = (id) => {
    setFeatureHighlights((prev) => prev.filter((feature) => feature.id !== id));
  };

  const addPredefinedFeature = (feature) => {
    const newFeature = {
      id: Date.now(),
      icon: "",
      name: feature.name,
      description: feature.description,
    };
    setFeatureHighlights((prev) => [...prev, newFeature]);
  };

  const handleFileUpload = (files) => {
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Package name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.location.city.trim())
      errors["location.city"] = "City is required";
    if (!formData.price.basePrice)
      errors["price.basePrice"] = "Package cost is required";
    if (!formData.duration.value)
      errors["duration.value"] = "Duration is required";
    if (!formData.capacity.maxGuests)
      errors["capacity.maxGuests"] = "Maximum guests is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Prepare form data for submission
      const submitData = {
        ...formData,
        featureHighlights,
        activities: formData.activities.map((activity) => ({
          name: activity.name || "",
          description: activity.description || "",
          duration: parseInt(activity.duration) || 0,
          included: activity.included !== false,
        })),
      };

      console.log("Submitting package data:", submitData);

      // TODO: Implement API call to create package
      // await createPackage(submitData);

      alert("Package created successfully!");
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto ">
        <PackageForm
          formData={formData}
          errors={errors}
          loading={loading}
          featureHighlight={featureHighlight}
          setFeatureHighlight={setFeatureHighlight}
          featureHighlights={featureHighlights}
          predefinedFeatures={predefinedFeatures}
          handleInputChange={handleInputChange}
          handleArrayChange={handleArrayChange}
          addFeatureHighlight={addFeatureHighlight}
          removeFeatureHighlight={removeFeatureHighlight}
          addPredefinedFeature={addPredefinedFeature}
          handleFileUpload={handleFileUpload}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default CreatePackage;
