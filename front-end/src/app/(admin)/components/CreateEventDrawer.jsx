import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useCreateEvent } from "../hooks/useEvents";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";

// Yup validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Event title is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),

  destination: Yup.string()
    .min(2, "Destination must be at least 2 characters")
    .max(100, "Destination must be less than 100 characters")
    .required("Destination is required"),

  startDate: Yup.date()
    .min(new Date(), "Start date must be in the future")
    .required("Start date is required"),

  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),

  duration: Yup.number()
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration must be less than 365 days")
    .integer("Duration must be a whole number")
    .required("Duration is required"),

  maxBookings: Yup.number()
    .min(1, "Maximum bookings must be at least 1")
    .max(1000, "Maximum bookings must be less than 1000")
    .integer("Maximum bookings must be a whole number")
    .required("Maximum bookings is required"),

  startLocation: Yup.string()
    .min(2, "Start location must be at least 2 characters")
    .max(100, "Start location must be less than 100 characters")
    .required("Start location is required"),

  endLocation: Yup.string()
    .min(2, "End location must be at least 2 characters")
    .max(100, "End location must be less than 100 characters")
    .required("End location is required"),

  status: Yup.string()
    .oneOf(["active", "inactive", "draft"], "Invalid status")
    .required("Status is required"),
});

const CreateEventDrawer = ({ isOpen, onClose }) => {
  const createEventMutation = useCreateEvent();

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
  ];

  const initialValues = {
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
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Calculate duration if not provided
      const duration =
        values.duration ||
        Math.ceil(
          (new Date(values.endDate) - new Date(values.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      // Prepare event data for API
      const eventData = {
        ...values,
        duration: parseInt(duration),
        maxBookings: parseInt(values.maxBookings),
        eventType: "standalone", // This is a manually created standalone event
        priority: "medium", // Default priority
        color: "#10B981", // Default color
      };

      await createEventMutation.mutateAsync(eventData);

      // Show success message
      toast.success("Event created successfully!");

      // Reset form and close drawer
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);

      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create event. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!createEventMutation.isPending) {
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Event">
      <div className="p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form className="space-y-6">
              {/* Event Title */}
              <Input
                label="Event Title"
                placeholder="Enter event title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && errors.title}
                required
                icon={<IoCalendarOutline />}
              />

              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Enter event description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                required
                rows={4}
              />

              {/* Destination */}
              <Input
                label="Destination"
                placeholder="Enter destination"
                name="destination"
                value={values.destination}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.destination && errors.destination}
                required
                icon={<IoLocationOutline />}
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.startDate && errors.startDate}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.endDate && errors.endDate}
                  required
                />
              </div>

              {/* Duration and Max Bookings */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (Days)"
                  type="number"
                  placeholder="e.g., 5 (auto-calculated if empty)"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.duration && errors.duration}
                  min="1"
                />
                <Input
                  label="Maximum Bookings"
                  type="number"
                  placeholder="e.g., 50"
                  name="maxBookings"
                  value={values.maxBookings}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.maxBookings && errors.maxBookings}
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
                    name="startLocation"
                    value={values.startLocation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startLocation && errors.startLocation}
                    required
                    icon={<IoLocationOutline />}
                  />
                  <Input
                    label="End Location"
                    placeholder="e.g., Delhi Airport"
                    name="endLocation"
                    value={values.endLocation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.endLocation && errors.endLocation}
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
                  value={values.status}
                  onChange={(value) => setFieldValue("status", value)}
                  placeholder="Select status"
                />
                {touched.status && errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting || createEventMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting || createEventMutation.isPending}
                  className="flex-1"
                >
                  {isSubmitting || createEventMutation.isPending
                    ? "Creating..."
                    : "Create Event"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default CreateEventDrawer;
