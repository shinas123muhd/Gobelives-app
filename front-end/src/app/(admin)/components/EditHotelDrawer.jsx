import React, { useState, useEffect } from "react";
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
import { useUpdateHotel } from "@/app/(admin)/hooks/useHotels";

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
});

const EditHotelDrawer = ({ isOpen, onClose, hotelData, isEdit = true }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const updateHotel = useUpdateHotel();

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

  // Initial form values based on hotel data
  const getInitialValues = () => {
    if (!hotelData) {
      return {
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
      };
    }

    return {
      hotelName: hotelData.name || "",
      website: hotelData.website || "",
      email: hotelData.email || "",
      location: hotelData.location || "",
      description: hotelData.description || "",
      address: hotelData.address || "",
      phoneCode: hotelData.phone?.code || "+91",
      phoneNumber: hotelData.phone?.number || "",
      images: hotelData.images || [],
      status: hotelData.status || "active",
      tags: hotelData.tags && hotelData.tags.length > 0 ? hotelData.tags : [""],
    };
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
        images: values.images, // Files will be handled by the API
      };

      await updateHotel.mutateAsync({ id: hotelData._id, data: hotelData });

      // Reset form and close drawer on success
      setImagePreviews([]);
      resetForm();
      onClose();

      // Show success message (you can add a toast notification here)
      console.log("Hotel updated successfully!");
    } catch (error) {
      console.error("Error updating hotel:", error);
      // Show error message (you can add a toast notification here)
      console.error("Failed to update hotel:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!updateHotel.isPending) {
      setImagePreviews([]);
      onClose();
    }
  };

  // Reset image previews when hotel data changes
  useEffect(() => {
    if (hotelData && hotelData.images) {
      const previews = hotelData.images.map((image, index) => ({
        file: image, // This might be a URL string, not a file
        preview: typeof image === "string" ? image : URL.createObjectURL(image),
      }));
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  }, [hotelData]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Hotel" : "View Hotel"}
    >
      <div className="p-6">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
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
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                    disabled={!isEdit}
                    className={`w-full pl-3 pr-10 py-2 text-sm border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors duration-200
                      ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                        disabled={!isEdit}
                        className={`flex-1 px-3 py-2 text-sm border rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-colors duration-200
                          ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
                          ${!isEdit ? "border-gray-200" : "border-gray-300"}`}
                      />
                      {values.tags.length > 1 && isEdit && (
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
                  {values.tags.length < 5 && isEdit && (
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
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200 resize-none
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${!isEdit ? "border-gray-200" : "border-gray-300"}`}
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
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors duration-200
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                      disabled={!isEdit}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
                        ${!isEdit ? "border-gray-200" : "border-gray-300"}`}
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
                      disabled={!isEdit}
                      className={`w-full px-3 py-2 text-sm border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-colors duration-200
                        ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
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
                  Images
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
                          {isEdit && (
                            <button
                              type="button"
                              onClick={() => removeImage(index, setFieldValue)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            >
                              <IoCloseOutline />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {imagePreviews.length} of 5 images selected
                    </p>
                  </div>
                )}

                {/* Upload Area */}
                {imagePreviews.length < 5 && isEdit && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleImageChange(e.target.files, setFieldValue)
                      }
                      className="hidden"
                      id="hotel-images-edit"
                    />
                    <label
                      htmlFor="hotel-images-edit"
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Field
                  name="status"
                  as="select"
                  disabled={!isEdit}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${!isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${!isEdit ? "border-gray-200" : "border-gray-300"}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
              </div>

              {/* Action Buttons */}
              {isEdit && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={updateHotel.isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={updateHotel.isPending}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <IoAddOutline className="text-lg" />
                    {updateHotel.isPending ? "Updating..." : "Update Hotel"}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default EditHotelDrawer;
