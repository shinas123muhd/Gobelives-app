"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import PackageForm from "../../create/components/PackageForm";
import {
  usePackage,
  useUpdatePackage,
  useDeletePackageImage,
} from "../../../../../hooks/usePackages";

const EditPackage = () => {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id;

  const { data: packageData, isLoading, error } = usePackage(packageId);
  const updatePackage = useUpdatePackage();
  const deletePackageImage = useDeletePackageImage();

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
    whatsInside: [],
    languages: [],
    tags: [],
    category: "",

    // Policies
    cancellationPolicy: "moderate",
    cancellationDetails: {},
    healthSafetyMeasures: [],

    // Transportation
    transportation: {
      included: false,
      type: "",
      details: "",
    },

    // Availability and Schedule
    availableDates: {
      startDate: "",
      endDate: "",
      blackoutDates: [],
    },
    schedule: {
      startTime: "",
      endTime: "",
      duration: "",
    },

    // Visibility and SEO
    visibility: "public",
    metaTitle: "",
    metaDescription: "",
    keywords: [],

    // Media
    images: [],
    coverImage: "",

    // Status
    status: "draft",
    featured: false,
  });

  const [errors, setErrors] = useState({});

  // Feature highlights state
  const [featureHighlight, setFeatureHighlight] = useState({
    icon: "star",
    name: "",
    description: "",
  });
  const [featureHighlights, setFeatureHighlights] = useState([]);

  // Icon options for feature highlights
  const iconOptions = [
    { value: "star", label: "Star" },
    { value: "heart", label: "Heart" },
    { value: "shield", label: "Shield" },
    { value: "checkmark", label: "Checkmark" },
  ];

  // Predefined features for selection
  const predefinedFeatures = [
    {
      name: "Free cancellation",
      description: "Cancel up to 24 hours in advance to receive a full refund.",
      icon: "checkmark",
    },
    {
      name: "Early check-in",
      description:
        "Arrive earlier for no extra fee and enjoy more time at your destination.",
      icon: "star",
    },
    {
      name: "Complimentary breakfast",
      description:
        "Start your day with a delicious breakfast included in your stay.",
      icon: "heart",
    },
    {
      name: "Airport pickup",
      description:
        "Convenient airport pickup service included in your package.",
      icon: "shield",
    },
    {
      name: "Professional guide",
      description: "Expert local guide to enhance your experience.",
      icon: "star",
    },
    {
      name: "24/7 support",
      description: "Round-the-clock customer support during your trip.",
      icon: "shield",
    },
  ];

  // Populate form data when package data is loaded
  useEffect(() => {
    if (packageData?.data) {
      const data = packageData.data;
      setFormData({
        title: data.title || "",
        description: data.description || "",
        shortDescription: data.shortDescription || "",
        location: {
          address: data.location?.address || "",
          city: data.location?.city || "",
          state: data.location?.state || "",
          country: data.location?.country || "",
          link: data.location?.link || "",
        },
        meetingPoint: {
          address: data.meetingPoint?.address || "",
          instructions: data.meetingPoint?.instructions || "",
        },
        price: {
          basePrice: data.price?.basePrice || "",
          currency: data.price?.currency || "USD",
          priceIncludes: data.price?.priceIncludes || [],
          priceExcludes: data.price?.priceExcludes || [],
        },
        capacity: {
          maxGuests: data.capacity?.maxGuests || "",
          minGuests: data.capacity?.minGuests || "1",
        },
        duration: {
          value: data.duration?.value || "",
          unit: data.duration?.unit || "days",
        },
        activities: data.activities || [],
        whatsInside: data.whatsInside || [],
        languages: data.languages || [],
        tags: data.tags || [],
        category: data.category?._id || data.category || "",
        cancellationPolicy: data.cancellationPolicy || "moderate",
        cancellationDetails: data.cancellationDetails || {},
        healthSafetyMeasures: data.healthSafetyMeasures || [],
        transportation: {
          included: data.transportation?.included || false,
          type: data.transportation?.type || "",
          details: data.transportation?.details || "",
        },
        availableDates: {
          startDate: data.availableDates?.startDate || "",
          endDate: data.availableDates?.endDate || "",
          blackoutDates: data.availableDates?.blackoutDates || [],
        },
        schedule: {
          startTime: data.schedule?.startTime || "",
          endTime: data.schedule?.endTime || "",
          duration: data.schedule?.duration || "",
        },
        visibility: data.visibility || "public",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: data.keywords || [],
        images: data.images || [],
        coverImage: data.coverImage || "",
        status: data.status || "draft",
        featured: data.featured || false,
      });

      // Set feature highlights
      setFeatureHighlights(data.featureHighlights || []);
    }
  }, [packageData]);

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

    // Clear related errors when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear related errors when array changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const validateField = (field, value) => {
    const fieldErrors = {};

    switch (field) {
      case "title":
        if (!value.trim()) {
          fieldErrors.title = "Package title is required";
        } else if (value.trim().length < 3) {
          fieldErrors.title = "Package title must be at least 3 characters";
        } else if (value.trim().length > 100) {
          fieldErrors.title = "Package title must be less than 100 characters";
        }
        break;

      case "description":
        if (!value.trim()) {
          fieldErrors.description = "Package description is required";
        } else if (value.trim().length < 10) {
          fieldErrors.description =
            "Description must be at least 10 characters";
        } else if (value.trim().length > 2000) {
          fieldErrors.description =
            "Description must be less than 2000 characters";
        }
        break;

      case "price.basePrice":
        if (!value) {
          fieldErrors["price.basePrice"] = "Base price is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          fieldErrors["price.basePrice"] =
            "Base price must be a valid positive number";
        } else if (parseFloat(value) > 99999) {
          fieldErrors["price.basePrice"] =
            "Base price must be less than $100,000";
        }
        break;

      case "capacity.maxGuests":
        if (!value) {
          fieldErrors["capacity.maxGuests"] = "Maximum guests is required";
        } else if (isNaN(value) || parseInt(value) <= 0) {
          fieldErrors["capacity.maxGuests"] =
            "Maximum guests must be a valid positive number";
        } else if (parseInt(value) > 100) {
          fieldErrors["capacity.maxGuests"] =
            "Maximum guests cannot exceed 100";
        }
        break;

      case "duration.value":
        if (!value) {
          fieldErrors["duration.value"] = "Duration is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          fieldErrors["duration.value"] =
            "Duration must be a valid positive number";
        } else if (parseFloat(value) > 365) {
          fieldErrors["duration.value"] = "Duration cannot exceed 365 days";
        }
        break;

      case "location.city":
        if (!value.trim()) {
          fieldErrors["location.city"] = "City is required";
        }
        break;

      case "location.country":
        if (!value.trim()) {
          fieldErrors["location.country"] = "Country is required";
        }
        break;

      case "location.address":
        if (!value.trim()) {
          fieldErrors["location.address"] = "Address is required";
        }
        break;

      case "meetingPoint.address":
        if (!value.trim()) {
          fieldErrors["meetingPoint.address"] =
            "Meeting point address is required";
        }
        break;

      case "category":
        if (!value) {
          fieldErrors.category = "Category is required";
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  const addFeatureHighlight = () => {
    if (featureHighlight.name && featureHighlight.description) {
      const newFeature = {
        icon: featureHighlight.icon || "star",
        name: featureHighlight.name,
        description: featureHighlight.description,
      };
      setFeatureHighlights((prev) => [...prev, newFeature]);
      setFeatureHighlight({ icon: "star", name: "", description: "" });
    }
  };

  const removeFeatureHighlight = (index) => {
    setFeatureHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const addPredefinedFeature = (feature) => {
    const exists = featureHighlights.some(
      (highlight) => highlight.name === feature.name
    );

    if (!exists) {
      const newFeature = {
        icon: feature.icon || "star",
        name: feature.name,
        description: feature.description,
      };
      setFeatureHighlights((prev) => [...prev, newFeature]);
    }
  };

  const isFeatureSelected = (featureName) => {
    return featureHighlights.some(
      (highlight) => highlight.name === featureName
    );
  };

  const handleFileUpload = (files) => {
    setFormData((prev) => ({
      ...prev,
      images: files, // ImageGallery already handles combining existing and new files
    }));
  };

  const handleFileRemove = async (field, imageToRemove) => {
    if (field === "images") {
      try {
        await deletePackageImage.mutateAsync({
          packageId,
          imageId: imageToRemove._id,
        });

        // Update local state to remove the deleted image
        setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img._id !== imageToRemove._id),
        }));

        // If the deleted image was the cover image, clear it
        if (formData.coverImage === imageToRemove.url) {
          setFormData((prev) => ({
            ...prev,
            coverImage: "",
          }));
        }

        toast.success("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image. Please try again.");
      }
    } else if (field === "coverImage") {
      setFormData((prev) => ({
        ...prev,
        coverImage: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Basic Information Validation
    if (!formData.title.trim()) {
      errors.title = "Package title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Package title must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Package title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Package description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 2000) {
      errors.description = "Description must be less than 2000 characters";
    }

    if (formData.shortDescription && formData.shortDescription.length > 500) {
      errors.shortDescription =
        "Short description must be less than 500 characters";
    }

    // Location Validation - Made more lenient for testing
    if (!formData.location.city.trim()) {
      errors["location.city"] = "City is required";
    }

    // Price Validation
    if (!formData.price.basePrice) {
      errors["price.basePrice"] = "Base price is required";
    } else if (
      isNaN(formData.price.basePrice) ||
      parseFloat(formData.price.basePrice) <= 0
    ) {
      errors["price.basePrice"] = "Base price must be a valid positive number";
    } else if (parseFloat(formData.price.basePrice) > 99999) {
      errors["price.basePrice"] = "Base price must be less than $100,000";
    }

    if (!formData.price.currency) {
      errors["price.currency"] = "Currency is required";
    }

    // Capacity Validation - Made more lenient for testing
    if (
      formData.capacity.maxGuests &&
      (isNaN(formData.capacity.maxGuests) ||
        parseInt(formData.capacity.maxGuests) <= 0)
    ) {
      errors["capacity.maxGuests"] =
        "Maximum guests must be a valid positive number";
    } else if (
      formData.capacity.maxGuests &&
      parseInt(formData.capacity.maxGuests) > 100
    ) {
      errors["capacity.maxGuests"] = "Maximum guests cannot exceed 100";
    }

    // Duration Validation - Made more lenient for testing
    if (
      formData.duration.value &&
      (isNaN(formData.duration.value) ||
        parseFloat(formData.duration.value) <= 0)
    ) {
      errors["duration.value"] = "Duration must be a valid positive number";
    } else if (
      formData.duration.value &&
      parseFloat(formData.duration.value) > 365
    ) {
      errors["duration.value"] = "Duration cannot exceed 365 days";
    }

    // Category Validation
    if (!formData.category) {
      errors.category = "Category is required";
    }

    // Activities Validation - Filter out empty items
    if (formData.activities && formData.activities.length > 0) {
      const validActivities = formData.activities.filter(
        (activity) => activity && activity.trim()
      );
      if (validActivities.length !== formData.activities.length) {
        handleInputChange("activities", validActivities);
      }
    }

    // What's Inside Validation - Filter out empty items
    if (formData.whatsInside && formData.whatsInside.length > 0) {
      const validWhatsInside = formData.whatsInside.filter(
        (item) => item && item.trim()
      );
      if (validWhatsInside.length !== formData.whatsInside.length) {
        handleInputChange("whatsInside", validWhatsInside);
      }
    }

    // Languages Validation - Filter out empty items
    if (formData.languages && formData.languages.length > 0) {
      const validLanguages = formData.languages.filter(
        (language) => language && language.trim()
      );
      if (validLanguages.length !== formData.languages.length) {
        handleInputChange("languages", validLanguages);
      }
    }

    // Tags Validation - Filter out empty items
    if (formData.tags && formData.tags.length > 0) {
      const validTags = formData.tags.filter((tag) => tag && tag.trim());
      if (validTags.length !== formData.tags.length) {
        handleInputChange("tags", validTags);
      }
    }

    if (formData.tags && formData.tags.length > 10) {
      errors.tags = "Maximum 10 tags allowed";
    }

    // Feature Highlights Validation
    if (featureHighlights && featureHighlights.length > 0) {
      featureHighlights.forEach((highlight, index) => {
        if (!highlight.name || !highlight.name.trim()) {
          errors[`featureHighlights.${index}.name`] =
            "Feature name is required";
        }
        if (!highlight.description || !highlight.description.trim()) {
          errors[`featureHighlights.${index}.description`] =
            "Feature description is required";
        }
        if (
          !highlight.icon ||
          !["star", "heart", "shield", "checkmark"].includes(highlight.icon)
        ) {
          errors[`featureHighlights.${index}.icon`] = "Valid icon is required";
        }
      });
    }

    // Health & Safety Measures Validation - Filter out empty items
    if (
      formData.healthSafetyMeasures &&
      formData.healthSafetyMeasures.length > 0
    ) {
      const validMeasures = formData.healthSafetyMeasures.filter(
        (measure) => measure && measure.trim()
      );
      if (validMeasures.length !== formData.healthSafetyMeasures.length) {
        handleInputChange("healthSafetyMeasures", validMeasures);
      }
    }

    // Price Includes/Excludes Validation - Filter out empty items instead of showing errors
    if (
      formData.price.priceIncludes &&
      formData.price.priceIncludes.length > 0
    ) {
      const validIncludes = formData.price.priceIncludes.filter(
        (item) => item && item.trim()
      );
      if (validIncludes.length !== formData.price.priceIncludes.length) {
        handleInputChange("price.priceIncludes", validIncludes);
      }
    }

    if (
      formData.price.priceExcludes &&
      formData.price.priceExcludes.length > 0
    ) {
      const validExcludes = formData.price.priceExcludes.filter(
        (item) => item && item.trim()
      );
      if (validExcludes.length !== formData.price.priceExcludes.length) {
        handleInputChange("price.priceExcludes", validExcludes);
      }
    }

    // Status Validation
    if (!formData.status) {
      errors.status = "Status is required";
    } else if (
      !["active", "inactive", "draft", "suspended"].includes(formData.status)
    ) {
      errors.status = "Invalid status value";
    }

    // Cancellation Policy Validation
    if (!formData.cancellationPolicy) {
      errors.cancellationPolicy = "Cancellation policy is required";
    } else if (
      !["flexible", "moderate", "strict", "super_strict"].includes(
        formData.cancellationPolicy
      )
    ) {
      errors.cancellationPolicy = "Invalid cancellation policy";
    }

    // Visibility Validation
    if (!formData.visibility) {
      errors.visibility = "Visibility is required";
    } else if (
      !["public", "private", "unlisted"].includes(formData.visibility)
    ) {
      errors.visibility = "Invalid visibility value";
    }

    // SEO Validation
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      errors.metaTitle = "Meta title must be less than 60 characters";
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      errors.metaDescription =
        "Meta description must be less than 160 characters";
    }

    // Keywords Validation - Filter out empty items
    if (formData.keywords && formData.keywords.length > 0) {
      const validKeywords = formData.keywords.filter(
        (keyword) => keyword && keyword.trim()
      );
      if (validKeywords.length !== formData.keywords.length) {
        handleInputChange("keywords", validKeywords);
      }
    }

    if (formData.keywords && formData.keywords.length > 10) {
      errors.keywords = "Maximum 10 keywords allowed";
    }

    // Transportation Validation
    if (formData.transportation.included && !formData.transportation.type) {
      errors["transportation.type"] =
        "Transportation type is required when transportation is included";
    }

    // Availability Dates Validation
    if (formData.availableDates.startDate && formData.availableDates.endDate) {
      const startDate = new Date(formData.availableDates.startDate);
      const endDate = new Date(formData.availableDates.endDate);
      if (startDate >= endDate) {
        errors["availableDates.endDate"] = "End date must be after start date";
      }
    }

    // Schedule Validation
    if (formData.schedule.startTime && formData.schedule.endTime) {
      const startTime = new Date(`2000-01-01T${formData.schedule.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.schedule.endTime}`);
      if (startTime >= endTime) {
        errors["schedule.endTime"] = "End time must be after start time";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors
      clearAllErrors();

      // Validate form
      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error(
          `Please fix the validation errors: ${Object.keys(
            validationErrors
          ).join(", ")}`
        );
        return;
      }

      // Prepare form data for submission
      const submitData = new FormData();

      // Add basic fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("shortDescription", formData.shortDescription);
      submitData.append("category", formData.category);
      submitData.append("status", formData.status);
      submitData.append("featured", formData.featured.toString());
      submitData.append("visibility", formData.visibility);
      submitData.append("cancellationPolicy", formData.cancellationPolicy);
      submitData.append("metaTitle", formData.metaTitle);
      submitData.append("metaDescription", formData.metaDescription);

      // Add nested objects as JSON strings
      submitData.append("location", JSON.stringify(formData.location));
      submitData.append("meetingPoint", JSON.stringify(formData.meetingPoint));
      submitData.append("price", JSON.stringify(formData.price));
      submitData.append("capacity", JSON.stringify(formData.capacity));
      submitData.append("duration", JSON.stringify(formData.duration));
      submitData.append(
        "transportation",
        JSON.stringify(formData.transportation)
      );
      submitData.append(
        "cancellationDetails",
        JSON.stringify(formData.cancellationDetails)
      );
      submitData.append(
        "availableDates",
        JSON.stringify(formData.availableDates)
      );
      submitData.append("schedule", JSON.stringify(formData.schedule));

      // Add arrays as JSON strings
      submitData.append("featureHighlights", JSON.stringify(featureHighlights));
      submitData.append("activities", JSON.stringify(formData.activities));
      submitData.append("whatsInside", JSON.stringify(formData.whatsInside));
      submitData.append("languages", JSON.stringify(formData.languages));
      submitData.append("tags", JSON.stringify(formData.tags));
      submitData.append("keywords", JSON.stringify(formData.keywords));
      submitData.append(
        "healthSafetyMeasures",
        JSON.stringify(formData.healthSafetyMeasures)
      );
      submitData.append(
        "priceIncludes",
        JSON.stringify(formData.price.priceIncludes)
      );
      submitData.append(
        "priceExcludes",
        JSON.stringify(formData.price.priceExcludes)
      );

      // Add cover image
      if (formData.coverImage) {
        submitData.append("coverImage", formData.coverImage);
      }

      // Add files
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          submitData.append("images", file);
        });
      }

      // Update package using the hook
      await updatePackage.mutateAsync({ id: packageId, data: submitData });

      toast.success("Package updated successfully!");
      router.push("/dashboard/destinations/packages");
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update package. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <section className="w-full h-full p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="animate-pulse space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="h-6 bg-gray-200 rounded w-40"></div>

                {/* Title and Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Location Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100">
                <div className="h-12 bg-gray-200 rounded-lg w-24"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error Loading Package
                </h3>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!packageData?.data) {
    return (
      <section className="w-full h-full p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Package Not Found
                </h3>
                <p className="text-gray-600 mb-6">
                  The package you're looking for doesn't exist or has been
                  removed.
                </p>
                <button
                  onClick={() =>
                    router.push("/dashboard/destinations/packages")
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Back to Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <PackageForm
          formData={formData}
          errors={errors}
          loading={updatePackage.isPending}
          featureHighlight={featureHighlight}
          setFeatureHighlight={setFeatureHighlight}
          featureHighlights={featureHighlights}
          predefinedFeatures={predefinedFeatures}
          iconOptions={iconOptions}
          handleInputChange={handleInputChange}
          handleArrayChange={handleArrayChange}
          addFeatureHighlight={addFeatureHighlight}
          removeFeatureHighlight={removeFeatureHighlight}
          addPredefinedFeature={addPredefinedFeature}
          isFeatureSelected={isFeatureSelected}
          handleFileUpload={handleFileUpload}
          handleFileRemove={handleFileRemove}
          handleSubmit={handleSubmit}
          isEditMode={true}
        />
      </div>
    </section>
  );
};

export default EditPackage;
