import React, { useRef, useState, useEffect } from "react";
import {
  IoCloudUploadOutline,
  IoImageOutline,
  IoCloseOutline,
  IoStarOutline,
  IoStar,
} from "react-icons/io5";

const ImageGallery = ({
  accept = "image/*",
  maxFiles = 6,
  maxSize = 5 * 1024 * 1024, // 5MB
  onFilesChange,
  onFileRemove,
  onCoverImageChange,
  existingFiles = [],
  coverImage = "",
  className = "",
  error = false,
  label = "",
  required = false,
}) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(existingFiles || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update files when existingFiles prop changes
  useEffect(() => {
    setFiles(existingFiles || []);
  }, [existingFiles]);

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = [];
    const errors = [];
    const currentFiles = Array.isArray(files) ? files : [];

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(
          `${file.name} is too large. Maximum size is ${
            maxSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      if (currentFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
      return;
    }

    setErrorMessage("");
    const newFiles = [...currentFiles, ...validFiles];
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // If this is the first image and no cover image is set, set it as cover
    if (newFiles.length === 1 && !coverImage) {
      const firstFile = newFiles[0];
      if (firstFile instanceof File) {
        onCoverImageChange?.(URL.createObjectURL(firstFile));
      } else if (firstFile.url) {
        onCoverImageChange?.(firstFile.url);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index) => {
    const currentFiles = Array.isArray(files) ? files : [];
    const fileToRemove = currentFiles[index];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // If the removed file was the cover image, set a new cover image
    const fileUrl =
      fileToRemove instanceof File
        ? URL.createObjectURL(fileToRemove)
        : fileToRemove.url;

    if (fileUrl === coverImage) {
      if (newFiles.length > 0) {
        const newCoverFile = newFiles[0];
        const newCoverUrl =
          newCoverFile instanceof File
            ? URL.createObjectURL(newCoverFile)
            : newCoverFile.url;
        onCoverImageChange?.(newCoverUrl);
      } else {
        onCoverImageChange?.("");
      }
    }

    // If it's an existing image (has publicId), call the remove callback
    if (
      fileToRemove &&
      !(fileToRemove instanceof File) &&
      fileToRemove.publicId
    ) {
      onFileRemove?.(fileToRemove);
    }
  };

  const setAsCoverImage = (file, index) => {
    const fileUrl = file instanceof File ? URL.createObjectURL(file) : file.url;
    onCoverImageChange?.(fileUrl);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileUrl = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file.url;
  };

  const isCoverImage = (file) => {
    const fileUrl = getFileUrl(file);
    return fileUrl === coverImage;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Main upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          <IoCloudUploadOutline className="w-12 h-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            PNG, JPG, GIF up to {maxSize / (1024 * 1024)}MB (max {maxFiles}{" "}
            files)
          </div>
        </div>
      </div>

      {/* File previews */}
      {files && Array.isArray(files) && files.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-3">
            Click the star icon to set an image as cover image
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((file, index) => (
              <div
                key={
                  file instanceof File
                    ? `new-${index}`
                    : `existing-${file._id || index}`
                }
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent transition-all duration-200 hover:border-blue-300">
                  {file instanceof File ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.url ? (
                    <img
                      src={file.url}
                      alt={file.altText || "Image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IoImageOutline className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Cover image indicator */}
                {isCoverImage(file) && (
                  <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <IoStar className="w-3 h-3" />
                    Cover
                  </div>
                )}

                {/* Existing file indicator */}
                {!(file instanceof File) && file.url && !isCoverImage(file) && (
                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                    Existing
                  </div>
                )}

                {/* New file indicator */}
                {file instanceof File && !isCoverImage(file) && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                    New
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Set as cover button */}
                  <button
                    type="button"
                    onClick={() => setAsCoverImage(file, index)}
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      isCoverImage(file)
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 hover:bg-yellow-500 hover:text-white shadow-md"
                    }`}
                    title={
                      isCoverImage(file)
                        ? "Current cover image"
                        : "Set as cover image"
                    }
                  >
                    {isCoverImage(file) ? (
                      <IoStar className="w-3 h-3" />
                    ) : (
                      <IoStarOutline className="w-3 h-3" />
                    )}
                  </button>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-md"
                    title="Remove image"
                  >
                    <IoCloseOutline className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {error && typeof error === "string" && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageGallery;
