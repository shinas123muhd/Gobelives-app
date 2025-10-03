import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Drawer from "@/components/ui/Drawer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import {
  useCreateCoupon,
  useUpdateCoupon,
} from "@/app/(admin)/hooks/useCoupon";
import { usePackages } from "@/app/(admin)/hooks/usePackages";

// Yup validation schema
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .min(3, "Coupon code must be at least 3 characters")
    .required("Coupon code is required"),
  name: Yup.string().required("Coupon name is required"),
  description: Yup.string(),
  discount: Yup.number()
    .positive("Discount must be a positive number")
    .required("Discount amount is required"),
  discountType: Yup.string().required("Discount type is required"),
  expiryDate: Yup.date()
    .min(new Date(), "Expiry date must be in the future")
    .required("Expiry date is required"),
  eligibility: Yup.string().required("Eligibility is required"),
  status: Yup.string().required("Status is required"),
  usageLimit: Yup.number().positive("Usage limit must be a positive number"),
  minimumAmount: Yup.number().min(0, "Minimum amount must be non-negative"),
  selectedPackages: Yup.array().when("eligibility", {
    is: "selected",
    then: (schema) => schema.min(1, "Please select at least one package"),
    otherwise: (schema) => schema,
  }),
  specificPackage: Yup.string().when("eligibility", {
    is: "specific",
    then: (schema) => schema.required("Please select a specific package"),
    otherwise: (schema) => schema,
  }),
});

const CreateCouponDrawer = ({
  isOpen,
  onClose,
  editData = null,
  isEditMode = false,
  onSuccess,
}) => {
  const [packageSearchTerm, setPackageSearchTerm] = useState("");

  // Hooks for API calls
  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const { data: packagesData, isLoading: packagesLoading } = usePackages({
    limit: 100,
  }); // Get all packages for selection
  const initialValues = editData
    ? {
        code: editData.code || "",
        name: editData.name || "",
        description: editData.description || "",
        discount: editData.discount || "",
        discountType: editData.discountType || "percentage",
        expiryDate: editData.expiryDate || "",
        eligibility: editData.eligibility || "all",
        status: editData.status ? "active" : "inactive",
        usageLimit: editData.usageLimit || "",
        minimumAmount: editData.minimumAmount || "",
        selectedPackages: editData.selectedPackages || [],
        specificPackage: editData.specificPackage || "",
      }
    : {
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
        selectedPackages: [],
        specificPackage: "",
      };

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount" },
  ];

  const eligibilityOptions = [
    { value: "all", label: "All Packages" },
    { value: "selected", label: "Selected Packages" },
    { value: "specific", label: "Specific Package" },
  ];

  // Get package options from API data
  const packageOptions =
    packagesData?.data?.packages?.map((pkg) => ({
      value: pkg._id,
      label: pkg.title,
    })) || [];

  // Filter packages based on search term
  const filteredPackages = packageOptions.filter((pkg) =>
    pkg.label.toLowerCase().includes(packageSearchTerm.toLowerCase())
  );

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handlePackageSelection = (
    packageId,
    setFieldValue,
    selectedPackages
  ) => {
    const newSelectedPackages = selectedPackages.includes(packageId)
      ? selectedPackages.filter((id) => id !== packageId)
      : [...selectedPackages, packageId];
    setFieldValue("selectedPackages", newSelectedPackages);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Prepare data for API
      const couponData = {
        code: values.code,
        name: values.name,
        description: values.description,
        discount: parseFloat(values.discount),
        discountType: values.discountType,
        expiryDate: values.expiryDate,
        eligibility: values.eligibility,
        status: values.status,
        usageLimit: values.usageLimit ? parseInt(values.usageLimit) : undefined,
        minimumAmount: values.minimumAmount
          ? parseFloat(values.minimumAmount)
          : undefined,
        selectedPackages:
          values.eligibility === "selected"
            ? values.selectedPackages
            : undefined,
        specificPackage:
          values.eligibility === "specific"
            ? values.specificPackage
            : undefined,
      };

      if (isEditMode) {
        // Update existing coupon
        await updateCouponMutation.mutateAsync({
          id: editData._id,
          data: couponData,
        });
      } else {
        // Create new coupon
        await createCouponMutation.mutateAsync(couponData);
      }

      // Reset form and close drawer
      resetForm();
      onClose();

      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} coupon:`,
        error
      );
      // Error handling is managed by the mutation hooks
    }
  };

  const handleClose = (resetForm) => {
    const isSubmitting =
      createCouponMutation.isPending || updateCouponMutation.isPending;
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => handleClose(() => {})}
      title={isEditMode ? "Edit Coupon" : "Create New Coupon"}
    >
      <div className="p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, resetForm }) => (
            <Form className="space-y-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <Field
                  as={Input}
                  name="code"
                  placeholder="e.g., WELCOME10"
                  onChange={(e) =>
                    setFieldValue("code", e.target.value.toUpperCase())
                  }
                  error={touched.code && errors.code}
                />
              </div>

              {/* Coupon Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Name *
                </label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="e.g., First Booking Discount"
                  error={touched.name && errors.name}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Field
                  as={Textarea}
                  name="description"
                  placeholder="Enter coupon description"
                  rows={3}
                />
              </div>

              {/* Discount Type and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <Select
                    options={discountTypeOptions}
                    value={values.discountType}
                    onChange={(value) => setFieldValue("discountType", value)}
                    placeholder="Select type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount *
                  </label>
                  <Field
                    as={Input}
                    name="discount"
                    type="number"
                    placeholder={
                      values.discountType === "percentage" ? "10" : "50"
                    }
                    error={touched.discount && errors.discount}
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <Field
                  as={Input}
                  name="expiryDate"
                  type="date"
                  error={touched.expiryDate && errors.expiryDate}
                />
              </div>

              {/* Eligibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility
                </label>
                <Select
                  options={eligibilityOptions}
                  value={values.eligibility}
                  onChange={(value) => setFieldValue("eligibility", value)}
                  placeholder="Select eligibility"
                />
              </div>

              {/* Conditional Package Selection */}
              {values.eligibility === "specific" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package *
                  </label>
                  {packagesLoading ? (
                    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500">
                        Loading packages...
                      </p>
                    </div>
                  ) : (
                    <Select
                      options={packageOptions}
                      value={values.specificPackage}
                      onChange={(value) =>
                        setFieldValue("specificPackage", value)
                      }
                      placeholder="Choose a package"
                    />
                  )}
                  {touched.specificPackage && errors.specificPackage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.specificPackage}
                    </p>
                  )}
                </div>
              )}

              {values.eligibility === "selected" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Packages *
                  </label>

                  {packagesLoading ? (
                    <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-500">
                        Loading packages...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Search Bar */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Search packages..."
                          value={packageSearchTerm}
                          onChange={(e) => setPackageSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {filteredPackages.map((pkg) => (
                          <label
                            key={pkg.value}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={values.selectedPackages.includes(
                                pkg.value
                              )}
                              onChange={() =>
                                handlePackageSelection(
                                  pkg.value,
                                  setFieldValue,
                                  values.selectedPackages
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {pkg.label}
                            </span>
                          </label>
                        ))}
                        {filteredPackages.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No packages found matching your search.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {touched.selectedPackages && errors.selectedPackages && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.selectedPackages}
                    </p>
                  )}

                  {values.selectedPackages.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {values.selectedPackages.length} package(s) selected
                    </p>
                  )}
                </div>
              )}

              {/* Usage Limit and Minimum Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit (Optional)
                  </label>
                  <Field
                    as={Input}
                    name="usageLimit"
                    type="number"
                    placeholder="100"
                    error={touched.usageLimit && errors.usageLimit}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Amount (Optional)
                  </label>
                  <Field
                    as={Input}
                    name="minimumAmount"
                    type="number"
                    placeholder="100"
                    error={touched.minimumAmount && errors.minimumAmount}
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(resetForm)}
                  disabled={
                    createCouponMutation.isPending ||
                    updateCouponMutation.isPending
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    createCouponMutation.isPending ||
                    updateCouponMutation.isPending
                  }
                  className="flex-1"
                >
                  {createCouponMutation.isPending ||
                  updateCouponMutation.isPending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Coupon"
                    : "Create Coupon"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};

export default CreateCouponDrawer;
