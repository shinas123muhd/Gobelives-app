import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import {
  IoLocationOutline,
  IoAttachOutline,
  IoAddOutline,
  IoCloseOutline,
  IoImageOutline,
} from "react-icons/io5";
import { useCreateHotel } from "@/app/(admin)/hooks/useHotels";

// Yup validation schema
const validationSchema = Yup.object({
  hotelName: Yup.string()
    .required("Hotel name is required")
    .min(2, "Hotel name must be at least 2 characters"),
  website: Yup.string().url("Please enter a valid website URL").nullable(),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  location: Yup.string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters"),
  description: Yup.string().nullable(),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  phoneCode: Yup.string().required("Phone code is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10,15}$/, "Please enter a valid phone number"),
  images: Yup.array().max(5, "Maximum 5 images allowed"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Invalid status")
    .required("Status is required"),
  tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
  starRating: Yup.number()
    .min(1, "Star rating must be at least 1")
    .max(5, "Star rating cannot exceed 5")
    .nullable(),
  category: Yup.string()
    .oneOf(
      [
        "luxury",
        "business",
        "boutique",
        "resort",
        "budget",
        "family",
        "romantic",
        "adventure",
      ],
      "Invalid category"
    )
    .nullable(),
  coordinates: Yup.object({
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .nullable(),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .nullable(),
  }),
  rooms: Yup.object({
    totalRooms: Yup.number()
      .min(1, "Total rooms must be at least 1")
      .nullable(),
    availableRooms: Yup.number()
      .min(0, "Available rooms cannot be negative")
      .nullable(),
  }),
  pricing: Yup.object({
    currency: Yup.string()
      .oneOf(["USD", "EUR", "GBP", "INR"], "Invalid currency")
      .required("Currency is required"),
    taxRate: Yup.number()
      .min(0, "Tax rate cannot be negative")
      .max(100, "Tax rate cannot exceed 100%")
      .nullable(),
    serviceCharge: Yup.number()
      .min(0, "Service charge cannot be negative")
      .max(100, "Service charge cannot exceed 100%")
      .nullable(),
  }),
  policies: Yup.object({
    checkIn: Yup.object({
      time: Yup.string().required("Check-in time is required"),
      policy: Yup.string().nullable(),
    }),
    checkOut: Yup.object({
      time: Yup.string().required("Check-out time is required"),
      policy: Yup.string().nullable(),
    }),
    cancellation: Yup.object({
      freeCancellation: Yup.boolean(),
      freeCancellationHours: Yup.number()
        .min(0, "Free cancellation hours cannot be negative")
        .nullable(),
      policy: Yup.string().nullable(),
    }),
    petPolicy: Yup.object({
      allowed: Yup.boolean(),
      fee: Yup.number().min(0, "Pet fee cannot be negative").nullable(),
      restrictions: Yup.string().nullable(),
    }),
  }),
});

const CreateHotelDrawer = ({ isOpen, onClose }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const createHotel = useCreateHotel();

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const countryCodeOptions = [
    { value: "+91", label: "+91" },
    { value: "+1", label: "+1" },
    { value: "+44", label: "+44" },
    { value: "+33", label: "+33" },
    { value: "+49", label: "+49" },
  ];

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "luxury", label: "Luxury" },
    { value: "business", label: "Business" },
    { value: "boutique", label: "Boutique" },
    { value: "resort", label: "Resort" },
    { value: "budget", label: "Budget" },
    { value: "family", label: "Family" },
    { value: "romantic", label: "Romantic" },
    { value: "adventure", label: "Adventure" },
  ];

  const starRatingOptions = [
    { value: "", label: "Select Star Rating" },
    { value: "1", label: "1 Star" },
    { value: "2", label: "2 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "5", label: "5 Stars" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "INR", label: "INR" },
  ];

  // Initial form values
  const initialValues = {
    hotelName: "",
    website: "",
    email: "",
    location: "",
    description: "",
    address: "",
    phoneCode: "+91",
    phoneNumber: "",
    images: [],
    status: "active",
    tags: [""],
    starRating: "",
    category: "",
    amenities: [],
    coordinates: {
      latitude: "",
      longitude: "",
    },
    rooms: {
      totalRooms: "",
      availableRooms: "",
    },
    pricing: {
      currency: "USD",
      taxRate: "",
      serviceCharge: "",
    },
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
  };

  // Handle image selection and preview
  const handleImageChange = (files, setFieldValue) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setFieldValue("images", validFiles);

    // Create preview URLs
    const previews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagePreviews(previews);
  };

  // Remove image from preview and form
  const removeImage = (index, setFieldValue) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFieldValue(
      "images",
      newPreviews.map((p) => p.file)
    );
  };

  // Handle tag operations
  const handleTagAdd = (tags, setFieldValue) => {
    if (tags.length < 5) {
      setFieldValue("tags", [...tags, ""]);
    }
  };

  const handleTagRemove = (index, tags, setFieldValue) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      setFieldValue("tags", newTags);
    }
  };

  const handleTagChange = (index, value, tags, setFieldValue) => {
    const newTags = tags.map((tag, i) => (i === index ? value : tag));
    setFieldValue("tags", newTags);
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Transform form data to match API schema
      const hotelData = {
        name: values.hotelName,
        website: values.website || undefined,
        email: values.email,
        description: values.description || undefined,
        location: values.location,
        address: values.address,
        phone: {
          code: values.phoneCode,
          number: values.phoneNumber,
        },
        status: values.status,
        tags: values.tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
        // Don't send images as files - they need to be uploaded separately
        // images: [], // Will be handled by image upload service
        starRating: values.starRating ? parseInt(values.starRating) : undefined,
        category: values.category || undefined,
        amenities: values.amenities || [],
        coordinates:
          values.coordinates.latitude && values.coordinates.longitude
            ? {
                latitude: parseFloat(values.coordinates.latitude),
                longitude: parseFloat(values.coordinates.longitude),
              }
            : undefined,
        rooms: {
          totalRooms: values.rooms.totalRooms
            ? parseInt(values.rooms.totalRooms)
            : undefined,
          availableRooms: values.rooms.availableRooms
            ? parseInt(values.rooms.availableRooms)
            : undefined,
        },
        pricing: {
          currency: values.pricing.currency,
          taxRate: values.pricing.taxRate
            ? parseFloat(values.pricing.taxRate)
            : undefined,
          serviceCharge: values.pricing.serviceCharge
            ? parseFloat(values.pricing.serviceCharge)
            : undefined,
        },
        policies: {
          checkIn: {
            time: values.policies.checkIn.time,
            policy: values.policies.checkIn.policy || undefined,
          },
          checkOut: {
            time: values.policies.checkOut.time,
            policy: values.policies.checkOut.policy || undefined,
          },
          cancellation: {
            freeCancellation: values.policies.cancellation.freeCancellation,
            freeCancellationHours: values.policies.cancellation
              .freeCancellationHours
              ? parseInt(values.policies.cancellation.freeCancellationHours)
              : undefined,
            policy: values.policies.cancellation.policy || undefined,
          },
          petPolicy: {
            allowed: values.policies.petPolicy.allowed,
            fee: values.policies.petPolicy.fee
              ? parseFloat(values.policies.petPolicy.fee)
              : undefined,
            restrictions: values.policies.petPolicy.restrictions || undefined,
          },
        },
      };

      await createHotel.mutateAsync(hotelData);

      // Reset form and close drawer on success
      setImagePreviews([]);
      resetForm();
      onClose();

      // Show success message (you can add a toast notification here)
      console.log("Hotel created successfully!");
    } catch (error) {
      console.error("Error creating hotel:", error);
      // Show error message (you can add a toast notification here)
      console.error("Failed to create hotel:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!createHotel.isPending) {
      setImagePreviews([]);
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Hotel">
      <div className="p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Hotel Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="hotelName"
                  type="text"
                  placeholder="Enter Name"
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${
                      errors.hotelName && touched.hotelName
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                <ErrorMessage
                  name="hotelName"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <Field
                  name="website"
                  type="url"
                  placeholder="Enter Website URL"
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${
                      errors.website && touched.website
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                <ErrorMessage
                  name="website"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${
                      errors.email && touched.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    name="location"
                    type="text"
                    placeholder="Add Location"
                    className={`w-full pl-3 pr-10 py-2 text-sm border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors duration-200
                      ${
                        errors.location && touched.location
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                  <IoLocationOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <ErrorMessage
                  name="location"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {values.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Field
                        name={`tags.${index}`}
                        type="text"
                        placeholder="Enter Hotel Tag"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-colors duration-200"
                      />
                      {values.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            handleTagRemove(index, values.tags, setFieldValue)
                          }
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <IoCloseOutline className="text-lg" />
                        </button>
                      )}
                    </div>
                  ))}
                  {values.tags.length < 5 && (
                    <button
                      type="button"
                      onClick={() => handleTagAdd(values.tags, setFieldValue)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <IoAddOutline className="text-lg" />
                      Add Tag
                    </button>
                  )}
                </div>
                <ErrorMessage
                  name="tags"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Enter Short Description"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200 resize-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <Field
                  name="address"
                  type="text"
                  placeholder="Enter Address"
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${
                      errors.address && touched.address
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-20">
                    <Field
                      name="phoneCode"
                      as="select"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {countryCodeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter Number"
                      className={`w-full px-3 py-2 text-sm border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-colors duration-200
                        ${
                          errors.phoneNumber && touched.phoneNumber
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                  </div>
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images <span className="text-red-500">*</span>
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, setFieldValue)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            <IoCloseOutline />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {imagePreviews.length} of 5 images selected
                    </p>
                  </div>
                )}

                {/* Upload Area */}
                {imagePreviews.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleImageChange(e.target.files, setFieldValue)
                      }
                      className="hidden"
                      id="hotel-images"
                    />
                    <label
                      htmlFor="hotel-images"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <IoImageOutline className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Upload{" "}
                        {imagePreviews.length === 0 ? "at least 3" : "more"}{" "}
                        photos (max 5)
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB each
                      </span>
                    </label>
                  </div>
                )}

                <ErrorMessage
                  name="images"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Star Rating
                </label>
                <Field
                  name="starRating"
                  as="select"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {starRatingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Field
                  name="category"
                  as="select"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Field
                    name="coordinates.latitude"
                    type="number"
                    step="any"
                    placeholder="Enter latitude"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Field
                    name="coordinates.longitude"
                    type="number"
                    step="any"
                    placeholder="Enter longitude"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms
                  </label>
                  <Field
                    name="rooms.totalRooms"
                    type="number"
                    min="1"
                    placeholder="Enter total rooms"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Rooms
                  </label>
                  <Field
                    name="rooms.availableRooms"
                    type="number"
                    min="0"
                    placeholder="Enter available rooms"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <Field
                    name="pricing.currency"
                    as="select"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <Field
                    name="pricing.taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter tax rate"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Charge (%)
                  </label>
                  <Field
                    name="pricing.serviceCharge"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter service charge"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Check-in/Check-out Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <Field
                    name="policies.checkIn.time"
                    type="time"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <Field
                    name="policies.checkOut.time"
                    type="time"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Policy
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Field
                      name="policies.cancellation.freeCancellation"
                      type="checkbox"
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Free Cancellation Available
                    </label>
                  </div>
                  <Field
                    name="policies.cancellation.freeCancellationHours"
                    type="number"
                    min="0"
                    placeholder="Free cancellation hours before check-in"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Field
                    name="policies.cancellation.policy"
                    as="textarea"
                    rows={3}
                    placeholder="Cancellation policy details"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Pet Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pet Policy
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Field
                      name="policies.petPolicy.allowed"
                      type="checkbox"
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Pets Allowed
                    </label>
                  </div>
                  <Field
                    name="policies.petPolicy.fee"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Pet fee amount"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Field
                    name="policies.petPolicy.restrictions"
                    as="textarea"
                    rows={2}
                    placeholder="Pet policy restrictions"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Field
                  name="status"
                  as="select"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={createHotel.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={createHotel.isPending}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <IoAddOutline className="text-lg" />
                  {createHotel.isPending ? "Creating..." : "Create New Hotel"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default CreateHotelDrawer;
