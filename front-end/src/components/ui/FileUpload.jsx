import React, { useRef, useState, useEffect } from "react";
import {
  IoCloudUploadOutline,
  IoImageOutline,
  IoCloseOutline,
} from "react-icons/io5";

const FileUpload = ({
  accept = "image/*",
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  onFilesChange,
  onFileRemove,
  existingFiles = [],
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

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(
          `${file.name} is too large. Maximum size is ${
            maxSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      if (files.length + validFiles.length >= maxFiles) {
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
    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);
    onFilesChange?.(newFiles);
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
    const fileToRemove = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);

    // If it's an existing image (has publicId), call the remove callback
    if (
      fileToRemove &&
      !(fileToRemove instanceof File) &&
      fileToRemove.publicId
    ) {
      onFileRemove?.(fileToRemove);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
          multiple={multiple}
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
            {accept === "image/*" ? "PNG, JPG, GIF up to" : "Files up to"}{" "}
            {maxSize / (1024 * 1024)}MB
          </div>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {files.map((file, index) => (
            <div
              key={
                file instanceof File
                  ? `new-${index}`
                  : `existing-${file._id || index}`
              }
              className="relative group"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
              {/* Existing file indicator */}
              {!file instanceof File && file.url && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                  Existing
                </div>
              )}

              {/* New file indicator */}
              {file instanceof File && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                  New
                </div>
              )}

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <IoCloseOutline className="w-3 h-3" />
              </button>
            </div>
          ))}
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

export default FileUpload;
