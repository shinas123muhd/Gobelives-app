import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { toast } from "react-hot-toast";
import {
  IoCloudUploadOutline,
  IoImageOutline,
  IoCloseOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useCreateBlog, useUpdateBlog } from "../hooks/useBlogs";

// Yup validation schema
const createValidationSchema = (isEditMode = false) =>
  Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Blog title is required"),
    content: Yup.string()
      .min(10, "Content must be at least 10 characters")
      .required("Blog content is required"),
    excerpt: Yup.string().max(500, "Excerpt cannot exceed 500 characters"),
    // Note: tags and keywords are validated manually in handleSubmit
    visibility: Yup.string().required("Package visibility is required"),
    status: Yup.string().required("Blog status is required"),
    scheduleDate: Yup.date().nullable(),
    metaTitle: Yup.string().max(60, "Meta title cannot exceed 60 characters"),
    metaDescription: Yup.string().max(
      160,
      "Meta description cannot exceed 160 characters"
    ),
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
          .required("Blog image is required")
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

const AddBlogDrawer = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  isEditMode = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  // Initialize mutations
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  // Initialize tags and keywords from editData
  useEffect(() => {
    if (editData && isEditMode) {
      setTags(editData.tags || []);
      setKeywords(editData.keywords || []);
      if (editData.image?.url) {
        setImagePreview(editData.image.url);
      }
    } else {
      // Reset when not in edit mode
      setTags([]);
      setKeywords([]);
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [editData, isEditMode]);

  const initialValues = editData
    ? {
        title: editData.title || "",
        content: editData.content || "",
        excerpt: editData.excerpt || "",
        tags: editData.tags || [],
        visibility: editData.visibility || "public",
        status: editData.status || "published",
        scheduleDate: editData.scheduleDate
          ? new Date(editData.scheduleDate).toISOString().slice(0, 16)
          : "",
        metaTitle: editData.metaTitle || "",
        metaDescription: editData.metaDescription || "",
        keywords: editData.keywords || [],
        image: editData.image?.url ? "existing" : null, // Mark as "existing" if has image
      }
    : {
        title: "",
        content: "",
        excerpt: "",
        tags: [],
        visibility: "public",
        status: "published",
        scheduleDate: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
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

  const addTag = (tagText) => {
    if (tagText.trim() && !tags.includes(tagText.trim())) {
      const newTags = [...tags, tagText.trim()];
      setTags(newTags);
      setTagInput("");
      setTagsError(""); // Clear error when tag is added
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const addKeyword = (keywordText) => {
    if (keywordText.trim() && !keywords.includes(keywordText.trim())) {
      const newKeywords = [...keywords, keywordText.trim()];
      setKeywords(newKeywords);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleKeywordInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(keywordInput);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Validate tags (not in Yup schema)
      if (tags.length === 0) {
        setTagsError("At least one tag is required");
        toast.error("Please add at least one tag");
        setSubmitting(false);
        return;
      }
      setTagsError(""); // Clear error if validation passes

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("excerpt", values.excerpt || "");
      formData.append("tags", JSON.stringify(tags));
      formData.append("visibility", values.visibility);
      formData.append("status", values.status);
      formData.append("metaTitle", values.metaTitle || "");
      formData.append("metaDescription", values.metaDescription || "");
      formData.append("keywords", JSON.stringify(keywords));

      if (values.scheduleDate) {
        formData.append("scheduleDate", values.scheduleDate);
      }

      // Only append image if a new one is selected (must be a File object)
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image);
      }

      // Call API
      if (isEditMode && editData) {
        // Update existing blog
        await updateBlog.mutateAsync({
          id: editData._id || editData.id,
          data: formData,
        });
        toast.success("Blog updated successfully!");
      } else {
        // Create new blog
        await createBlog.mutateAsync(formData);
        toast.success("Blog created successfully!");
      }

      // Reset form and close drawer
      resetForm();
      setSelectedImage(null);
      setImagePreview(null);
      setTags([]);
      setTagsError("");
      setKeywords([]);
      setTagInput("");
      setKeywordInput("");
      onSuccess?.();
    } catch (error) {
      console.error(
        isEditMode ? "Error updating blog:" : "Error creating blog:",
        error
      );
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update blog. Please try again."
            : "Failed to create blog. Please try again.")
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
    setTags([]);
    setTagsError("");
    setKeywords([]);
    setTagInput("");
    setKeywordInput("");
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Blog" : "Create New Blog"}
      className="max-w-4xl"
    >
      <Formik
        key={isEditMode ? editData?._id || editData?.id : "create"}
        initialValues={initialValues}
        validationSchema={createValidationSchema(isEditMode)}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, values, isSubmitting, errors, touched }) => {
          const isSaving =
            isSubmitting || createBlog.isPending || updateBlog.isPending;

          return (
            <Form className="flex flex-col h-full">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Validation Errors Summary */}
                  {!isSubmitting &&
                    errors &&
                    touched &&
                    Object.keys(touched).length > 0 &&
                    Object.keys(errors).length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-red-800 mb-2">
                          Please fix the following errors:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>
                              <strong className="capitalize">{field}:</strong>{" "}
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Title */}
                  <Field name="title">
                    {({ field, meta }) => (
                      <Input
                        {...field}
                        label="Title"
                        placeholder="Enter blog title"
                        error={meta.touched && meta.error}
                        required
                      />
                    )}
                  </Field>

                  {/* Blog Content */}
                  <Field name="content">
                    {({ field, meta, form }) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Blog Content *
                        </label>
                        <RichTextEditor
                          value={field.value}
                          onChange={(content) =>
                            form.setFieldValue(field.name, content)
                          }
                          placeholder="Write your blog content here..."
                          error={meta.touched && meta.error}
                          height="300px"
                        />
                        {meta.touched && meta.error && (
                          <p className="text-sm text-red-600">{meta.error}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Use the toolbar to format your content with headings,
                          bold, italic, lists, links, and more.
                        </p>
                      </div>
                    )}
                  </Field>

                  {/* Blog Excerpt */}
                  <Field name="excerpt">
                    {({ field, meta }) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Blog Excerpt
                        </label>
                        <Textarea
                          {...field}
                          placeholder="Write a short excerpt or summary of your blog..."
                          rows={3}
                          className={
                            meta.touched && meta.error ? "border-red-300" : ""
                          }
                        />
                        {meta.touched && meta.error && (
                          <p className="text-sm text-red-600">{meta.error}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          Optional: A brief summary that will appear in blog
                          listings and social media previews.
                        </p>
                      </div>
                    )}
                  </Field>

                  {/* Blog Tags */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Blog Tags *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-600"
                          >
                            <IoCloseOutline className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Add a tag"
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          tagsError ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => addTag(tagInput)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {tagsError && (
                      <p className="text-sm text-red-600">{tagsError}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Press Enter or click Add button to add tags
                    </p>
                  </div>

                  {/* Package Visibility */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Package Visibility *
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "public", label: "Public" },
                        { value: "users_only", label: "Users Only" },
                        { value: "private", label: "Private" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <Field
                            name="visibility"
                            type="radio"
                            value={option.value}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Blog Status */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Blog Status *
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "published", label: "Published" },
                        { value: "unpublished", label: "Un Publish" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <Field
                            name="status"
                            type="radio"
                            value={option.value}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <Field name="scheduleDate">
                    {({ field }) => (
                      <Input
                        {...field}
                        label="Schedule"
                        type="datetime-local"
                        placeholder="Select Date"
                      />
                    )}
                  </Field>

                  {/* SEO Metadata Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900">
                      SEO Metadata
                    </h4>

                    {/* Meta Title */}
                    <Field name="metaTitle">
                      {({ field, meta }) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Meta Title
                          </label>
                          <Input
                            {...field}
                            placeholder="SEO title for search engines (max 60 characters)"
                            error={meta.touched && meta.error}
                          />
                          {meta.touched && meta.error && (
                            <p className="text-sm text-red-600">{meta.error}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Recommended: 50-60 characters. Leave empty to use
                            blog title.
                          </p>
                        </div>
                      )}
                    </Field>

                    {/* Meta Description */}
                    <Field name="metaDescription">
                      {({ field, meta }) => (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Meta Description
                          </label>
                          <Textarea
                            {...field}
                            placeholder="SEO description for search engines (max 160 characters)"
                            rows={3}
                            className={
                              meta.touched && meta.error ? "border-red-300" : ""
                            }
                          />
                          {meta.touched && meta.error && (
                            <p className="text-sm text-red-600">{meta.error}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Recommended: 150-160 characters. Leave empty to use
                            blog excerpt.
                          </p>
                        </div>
                      )}
                    </Field>

                    {/* SEO Keywords */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        SEO Keywords
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-green-600"
                            >
                              <IoCloseOutline className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={handleKeywordInputKeyPress}
                          placeholder="Add a keyword"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => addKeyword(keywordInput)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Add keywords that describe your blog content for better
                        SEO.
                      </p>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <Field name="image">
                    {({ field, meta }) => (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                          {isEditMode
                            ? "Upload New Image (Optional)"
                            : "Blog Image *"}
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
                                    setFieldValue("image", null);
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
                                  {(selectedImage.size / 1024 / 1024).toFixed(
                                    2
                                  )}{" "}
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
                                Drag or Click to Upload Blog Photo
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
                  <Button
                    type="submit"
                    disabled={isSaving}
                    loading={isSaving}
                    className="bg-[#1D332C] hover:bg-[#2B4B40]"
                  >
                    {isSaving
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Blog"
                      : "Save"}
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

export default AddBlogDrawer;
