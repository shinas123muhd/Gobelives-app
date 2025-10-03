import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const CreateEventDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
    duration: "",
    maxBookings: "",
    startLocation: "",
    endLocation: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!formData.maxBookings || formData.maxBookings < 1) {
      newErrors.maxBookings = "Maximum bookings must be at least 1";
    }

    if (!formData.startLocation.trim()) {
      newErrors.startLocation = "Start location is required";
    }

    if (!formData.endLocation.trim()) {
      newErrors.endLocation = "End location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create event
      console.log("Creating event:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and close drawer
      setFormData({
        title: "",
        description: "",
        destination: "",
        startDate: "",
        endDate: "",
        duration: "",
        maxBookings: "",
        startLocation: "",
        endLocation: "",
        status: "active",
      });
      setErrors({});
      onClose();

      // TODO: Show success message
    } catch (error) {
      console.error("Error creating event:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        destination: "",
        startDate: "",
        endDate: "",
        duration: "",
        maxBookings: "",
        startLocation: "",
        endLocation: "",
        status: "active",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Event">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <Input
            label="Event Title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            required
            icon={<IoCalendarOutline />}
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter event description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
            rows={4}
          />

          {/* Destination */}
          <Input
            label="Destination"
            placeholder="Enter destination"
            value={formData.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
            error={errors.destination}
            required
            icon={<IoLocationOutline />}
          />

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              error={errors.endDate}
              required
            />
          </div>

          {/* Duration and Max Bookings */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (Days)"
              type="number"
              placeholder="e.g., 5"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              min="1"
            />
            <Input
              label="Maximum Bookings"
              type="number"
              placeholder="e.g., 50"
              value={formData.maxBookings}
              onChange={(e) => handleInputChange("maxBookings", e.target.value)}
              error={errors.maxBookings}
              required
              icon={<IoPeopleOutline />}
              min="1"
            />
          </div>

          {/* Meeting Points */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Meeting Points
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Location"
                placeholder="e.g., Delhi Airport"
                value={formData.startLocation}
                onChange={(e) =>
                  handleInputChange("startLocation", e.target.value)
                }
                error={errors.startLocation}
                required
                icon={<IoLocationOutline />}
              />
              <Input
                label="End Location"
                placeholder="e.g., Delhi Airport"
                value={formData.endLocation}
                onChange={(e) =>
                  handleInputChange("endLocation", e.target.value)
                }
                error={errors.endLocation}
                required
                icon={<IoLocationOutline />}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              placeholder="Select status"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default CreateEventDrawer;
