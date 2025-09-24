import React, { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

const CreateCouponDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discount: "",
    discountType: "percentage",
    expiryDate: "",
    eligibility: "all",
    status: "active",
    usageLimit: "",
    minimumAmount: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount" },
  ];

  const eligibilityOptions = [
    { value: "all", label: "All Packages" },
    { value: "selected", label: "Selected Packages" },
    { value: "specific", label: "Specific Packages" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
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

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Coupon name is required";
    }

    if (!formData.discount.trim()) {
      newErrors.discount = "Discount amount is required";
    } else if (isNaN(formData.discount) || parseFloat(formData.discount) <= 0) {
      newErrors.discount = "Discount must be a valid positive number";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else {
      const selectedDate = new Date(formData.expiryDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.expiryDate = "Expiry date must be in the future";
      }
    }

    if (
      formData.usageLimit &&
      (isNaN(formData.usageLimit) || parseInt(formData.usageLimit) <= 0)
    ) {
      newErrors.usageLimit = "Usage limit must be a valid positive number";
    }

    if (
      formData.minimumAmount &&
      (isNaN(formData.minimumAmount) || parseFloat(formData.minimumAmount) < 0)
    ) {
      newErrors.minimumAmount =
        "Minimum amount must be a valid non-negative number";
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
      // TODO: Implement API call to create coupon
      console.log("Creating coupon:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and close drawer
      setFormData({
        code: "",
        name: "",
        description: "",
        discount: "",
        discountType: "percentage",
        expiryDate: "",
        eligibility: "all",
        status: "active",
        usageLimit: "",
        minimumAmount: "",
      });
      setErrors({});
      onClose();

      // TODO: Show success message
    } catch (error) {
      console.error("Error creating coupon:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        code: "",
        name: "",
        description: "",
        discount: "",
        discountType: "percentage",
        expiryDate: "",
        eligibility: "all",
        status: "active",
        usageLimit: "",
        minimumAmount: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Create New Coupon">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Code */}
          <Input
            label="Coupon Code"
            placeholder="e.g., WELCOME10"
            value={formData.code}
            onChange={(e) =>
              handleInputChange("code", e.target.value.toUpperCase())
            }
            error={errors.code}
            required
          />

          {/* Coupon Name */}
          <Input
            label="Coupon Name"
            placeholder="e.g., First Booking Discount"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter coupon description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
          />

          {/* Discount Type and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type
              </label>
              <Select
                options={discountTypeOptions}
                value={formData.discountType}
                onChange={(value) => handleInputChange("discountType", value)}
                placeholder="Select type"
              />
            </div>
            <Input
              label="Discount Amount"
              placeholder={formData.discountType === "percentage" ? "10" : "50"}
              value={formData.discount}
              onChange={(e) => handleInputChange("discount", e.target.value)}
              error={errors.discount}
              required
            />
          </div>

          {/* Expiry Date */}
          <Input
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
            error={errors.expiryDate}
            required
          />

          {/* Eligibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility
            </label>
            <Select
              options={eligibilityOptions}
              value={formData.eligibility}
              onChange={(value) => handleInputChange("eligibility", value)}
              placeholder="Select eligibility"
            />
          </div>

          {/* Usage Limit and Minimum Amount */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Usage Limit (Optional)"
              placeholder="100"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              error={errors.usageLimit}
            />
            <Input
              label="Minimum Amount (Optional)"
              placeholder="100"
              value={formData.minimumAmount}
              onChange={(e) =>
                handleInputChange("minimumAmount", e.target.value)
              }
              error={errors.minimumAmount}
            />
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
              {isSubmitting ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default CreateCouponDrawer;
