import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import {
  IoCloudUploadOutline,
  IoImageOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useUploadImage, useUpdateImage } from "@/app/(admin)/hooks/useGallery";

// Yup validation schema
const createValidationSchema = (isEditMode = false) =>
  Yup.object().shape({
    title: Yup.string()
      .min(2, "Title must be at least 2 characters")
      .required("Image title is required"),
    description: Yup.string(),
    featured: Yup.boolean().required("Featured status is required"),
    image: isEditMode
      ? Yup.mixed()
          .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value || value === "existing") return true; // Allow "existing" marker
            if (!(value instanceof File)) return true;
            return value.size <= 5 * 1024 * 1024; // 5MB
          })
          .test("fileType", "Only image files are allowed", (value) => {
            if (!value || value === "existing") return true; // Allow "existing" marker
            if (!(value instanceof File)) return true;
            return [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ].includes(value.type);
          })
      : Yup.mixed()
          .required("Image is required")
          .test("fileSize", "Image size must be less than 5MB", (value) => {
            if (!value) return true;
            if (!(value instanceof File)) return true;
            return value.size <= 5 * 1024 * 1024; // 5MB
          })
          .test("fileType", "Only image files are allowed", (value) => {
            if (!value) return true;
            if (!(value instanceof File)) return true;
            return [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ].includes(value.type);
          }),
  });

const AddImageDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  isEditMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Use mutation hooks
  const uploadMutation = useUploadImage();
  const updateMutation = useUpdateImage();

  // Initialize image preview from editData
  useEffect(() => {
    if (editData && isEditMode) {
      if (editData.image?.url) {
        setImagePreview(editData.image.url);
      }
    } else {
      // Reset when not in edit mode
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [editData, isEditMode]);

  const initialValues = editData
    ? {
        title: editData.title || "",
        description: editData.description || "",
        featured: editData.featured || false,
        image: editData.image?.url ? "existing" : null, // Mark as "existing" if has image
      }
    : {
        title: "",
        description: "",
        featured: false,
        image: null,
      };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFieldValue("image", file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("featured", values.featured.toString());
      formData.append("tags", JSON.stringify([]));
      formData.append("categories", JSON.stringify([]));

      // Only append image if a new one is selected (must be a File object)
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (isEditMode && editData) {
        // Update existing image
        await updateMutation.mutateAsync({
          id: editData._id || editData.id,
          data: formData,
        });
        toast.success("Image updated successfully!");
      } else {
        // Upload new image
        await uploadMutation.mutateAsync(formData);
        toast.success("Image added successfully!");
      }

      resetForm();
      setSelectedImage(null);
      setImagePreview(null);
      onSuccess?.();
    } catch (error) {
      console.error(
        isEditMode ? "Error updating image:" : "Error adding image:",
        error
      );
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update image. Please try again."
            : "Failed to add image. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Image" : "Add New Image"}
      className="max-w-lg"
    >
      <Formik
        key={isEditMode ? editData?._id || editData?.id : "create"}
        initialValues={initialValues}
        validationSchema={createValidationSchema(isEditMode)}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, values, isSubmitting }) => {
          const isSaving =
            isSubmitting ||
            uploadMutation.isPending ||
            updateMutation.isPending;

          return (
            <Form className="flex flex-col h-full">
              <div className="flex-1 p-6 space-y-6">
                {/* Image Upload Section */}
                <Field name="image">
                  {({ field, meta }) => (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {isEditMode
                          ? "Upload New Image (Optional)"
                          : "Upload Image *"}
                      </label>

                      {/* Show current or new image preview */}
                      {(imagePreview ||
                        (isEditMode && editData?.image?.url)) && (
                        <div className="space-y-3">
                          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={imagePreview || editData?.image?.url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            {/* Show remove button only if it's a new image */}
                            {selectedImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setImagePreview(null);
                                  setFieldValue("image", "existing");
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <IoCloseOutline className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          {/* Change image button for edit mode */}
                          {isEditMode && !selectedImage && (
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageChange(e, setFieldValue)
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="change-image"
                              />
                              <label
                                htmlFor="change-image"
                                className="block w-full px-4 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                              >
                                Change Image
                              </label>
                            </div>
                          )}

                          {/* Show file info if new image selected */}
                          {selectedImage && (
                            <div className="text-sm text-gray-600">
                              <p>New image: {selectedImage.name}</p>
                              <p className="text-xs text-gray-500">
                                Size:{" "}
                                {(selectedImage.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Button - only show when no image at all */}
                      {!imagePreview && !isEditMode && (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(e, setFieldValue)
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors ${
                              meta.touched && meta.error
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          >
                            <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                              Click to upload image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Show validation error */}
                      {meta.touched && meta.error && (
                        <p className="text-sm text-red-600">{meta.error}</p>
                      )}
                    </div>
                  )}
                </Field>

                {/* Image Title */}
                <Field name="title">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      label="Image Title"
                      placeholder="Enter image title"
                      error={meta.touched && meta.error}
                      required
                    />
                  )}
                </Field>

                {/* Description */}
                <Field name="description">
                  {({ field, meta }) => (
                    <Input
                      {...field}
                      label="Description (Optional)"
                      placeholder="Enter image description"
                      error={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Featured Toggle */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Featured Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <Field name="featured">
                      {({ field }) => (
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      )}
                    </Field>
                    <span className="text-sm text-gray-600">
                      Mark this image as featured
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} loading={isSaving}>
                    {isSaving
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                      ? "Update Image"
                      : "Add Image"}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Drawer>
  );
};

export default AddImageDrawer;
