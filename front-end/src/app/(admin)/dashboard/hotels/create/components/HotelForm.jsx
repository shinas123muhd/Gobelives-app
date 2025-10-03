import React, { useState, useEffect, useRef } from "react";
import { IoAddOutline, IoCloseOutline, IoImageOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

const HotelForm = ({
  formData,
  errors = {},
  touched = {},
  loading,
  predefinedAmenities,
  predefinedFeatures,
  amenityIconOptions,
  featureIconOptions,
  amenityCategoryOptions,
  newAmenity,
  setNewAmenity,
  newFeature,
  setNewFeature,
  addCustomAmenity,
  addCustomFeature,
  handleInputChange,
  handleArrayChange,
  addAmenity,
  removeAmenity,
  addFeature,
  removeFeature,
  handleFileUpload,
  handleFileRemove,
  isEditMode = false,
}) => {
  const [newTag, setNewTag] = useState("");
  const [showAmenityIconMenu, setShowAmenityIconMenu] = useState(false);
  const [showFeatureIconMenu, setShowFeatureIconMenu] = useState(false);

  const amenityMenuRef = useRef(null);
  const featureMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        amenityMenuRef.current &&
        !amenityMenuRef.current.contains(event.target)
      ) {
        setShowAmenityIconMenu(false);
      }
      if (
        featureMenuRef.current &&
        !featureMenuRef.current.contains(event.target)
      ) {
        setShowFeatureIconMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const childrenChargesOptions = [
    { value: "free", label: "Free" },
    { value: "discounted", label: "Discounted" },
    { value: "full_price", label: "Full Price" },
  ];

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleArrayChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addTag();
    }
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    handleArrayChange("tags", newTags);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential hotel details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Hotel Name"
                placeholder="Enter hotel name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={touched?.name && errors?.name ? errors.name : ""}
                required
                data-field="name"
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={touched?.email && errors?.email ? errors.email : ""}
                required
                data-field="email"
              />

              <Input
                label="Website"
                type="url"
                placeholder="Enter website URL"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                error={
                  touched?.website && errors?.website ? errors.website : ""
                }
              />

              <Input
                label="Location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                error={
                  touched?.location && errors?.location ? errors.location : ""
                }
                required
                data-field="location"
              />

              <Input
                label="Address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={
                  touched?.address && errors?.address ? errors.address : ""
                }
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="w-20">
                      <Select
                        value={formData.phone.code}
                        onChange={(value) =>
                          handleInputChange("phone.code", value)
                        }
                        options={[
                          { value: "+1", label: "+1" },
                          { value: "+91", label: "+91" },
                          { value: "+44", label: "+44" },
                          { value: "+33", label: "+33" },
                          { value: "+49", label: "+49" },
                        ]}
                        error={
                          touched.phone?.code && errors.phone?.code
                            ? errors.phone.code
                            : ""
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="tel"
                        value={formData.phone.number}
                        onChange={(e) =>
                          handleInputChange("phone.number", e.target.value)
                        }
                        placeholder="Enter phone number"
                        error={
                          touched.phone?.number && errors.phone?.number
                            ? errors.phone.number
                            : ""
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Select
                  label="Star Rating"
                  options={starRatingOptions}
                  value={formData.starRating}
                  onChange={(value) => handleInputChange("starRating", value)}
                />
              </div>

              <Select
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
                error={
                  touched?.category && errors?.category ? errors.category : ""
                }
                required
              />

              <Textarea
                label="Description"
                placeholder="Enter hotel description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
              />

              <Textarea
                label="Short Description"
                placeholder="Enter short description"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>
                Geographic coordinates for mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  placeholder="Enter latitude"
                  value={formData.coordinates.latitude}
                  onChange={(e) =>
                    handleInputChange("coordinates.latitude", e.target.value)
                  }
                />

                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  placeholder="Enter longitude"
                  value={formData.coordinates.longitude}
                  onChange={(e) =>
                    handleInputChange("coordinates.longitude", e.target.value)
                  }
                />
              </div>

              <Input
                label="Google Maps Link"
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.coordinates?.googleMapsLink || ""}
                onChange={(e) =>
                  handleInputChange(
                    "coordinates.googleMapsLink",
                    e.target.value
                  )
                }
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Room Information */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
              <CardDescription>
                Hotel room capacity and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Total Rooms"
                  type="number"
                  min="1"
                  placeholder="Enter total rooms"
                  value={formData.rooms.totalRooms}
                  onChange={(e) =>
                    handleInputChange("rooms.totalRooms", e.target.value)
                  }
                  error={
                    touched.rooms?.totalRooms && errors.rooms?.totalRooms
                      ? errors.rooms.totalRooms
                      : ""
                  }
                  required
                />

                <Input
                  label="Available Rooms"
                  type="number"
                  min="0"
                  placeholder="Enter available rooms"
                  value={formData.rooms.availableRooms}
                  onChange={(e) =>
                    handleInputChange("rooms.availableRooms", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <CardDescription>
                Stay policies and check-in/out times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Stay (days)"
                  type="number"
                  min="1"
                  placeholder="Enter minimum stay"
                  value={formData.booking.minimumStay}
                  onChange={(e) =>
                    handleInputChange("booking.minimumStay", e.target.value)
                  }
                  error={
                    touched.booking?.minimumStay && errors.booking?.minimumStay
                      ? errors.booking.minimumStay
                      : ""
                  }
                  required
                />

                <Input
                  label="Maximum Stay (days)"
                  type="number"
                  min="1"
                  placeholder="Enter maximum stay"
                  value={formData.booking.maximumStay}
                  onChange={(e) =>
                    handleInputChange("booking.maximumStay", e.target.value)
                  }
                  error={
                    touched.booking?.maximumStay && errors.booking?.maximumStay
                      ? errors.booking.maximumStay
                      : ""
                  }
                  required
                />

                <Input
                  label="Check-in Time"
                  type="time"
                  value={formData.booking.checkInTime}
                  onChange={(e) =>
                    handleInputChange("booking.checkInTime", e.target.value)
                  }
                />

                <Input
                  label="Check-out Time"
                  type="time"
                  value={formData.booking.checkOutTime}
                  onChange={(e) =>
                    handleInputChange("booking.checkOutTime", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-4">
                <Checkbox
                  checked={formData.booking.flexibleCheckIn}
                  onChange={(e) =>
                    handleInputChange(
                      "booking.flexibleCheckIn",
                      e.target.checked
                    )
                  }
                  label="Flexible Check-in"
                />
                <Checkbox
                  checked={formData.booking.flexibleCheckOut}
                  onChange={(e) =>
                    handleInputChange(
                      "booking.flexibleCheckOut",
                      e.target.checked
                    )
                  }
                  label="Flexible Check-out"
                />
              </div>
            </CardContent>
          </Card>

          {/* Availability Management */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Availability Management</CardTitle>
              <CardDescription>
                Set availability periods and blackout dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Checkbox
                  checked={formData.availability.isAvailable}
                  onChange={(e) =>
                    handleInputChange(
                      "availability.isAvailable",
                      e.target.checked
                    )
                  }
                  label="Hotel Available for Booking"
                />
              </div>

              {/* Quick Availability Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Availability Options
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const nextWeek = new Date(
                        today.getTime() + 7 * 24 * 60 * 60 * 1000
                      );
                      handleInputChange("availability.quickOption", {
                        type: "thisWeek",
                        startDate: today.toISOString().split("T")[0],
                        endDate: nextWeek.toISOString().split("T")[0],
                      });
                    }}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    This Week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      const weekAfter = new Date(
                        nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000
                      );
                      handleInputChange("availability.quickOption", {
                        type: "nextWeek",
                        startDate: nextWeek.toISOString().split("T")[0],
                        endDate: weekAfter.toISOString().split("T")[0],
                      });
                    }}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Next Week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const nextMonth = new Date(
                        today.getFullYear(),
                        today.getMonth() + 1,
                        today.getDate()
                      );
                      handleInputChange("availability.quickOption", {
                        type: "thisMonth",
                        startDate: today.toISOString().split("T")[0],
                        endDate: nextMonth.toISOString().split("T")[0],
                      });
                    }}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    This Month
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      const monthAfter = new Date(
                        nextMonth.getFullYear(),
                        nextMonth.getMonth() + 1,
                        nextMonth.getDate()
                      );
                      handleInputChange("availability.quickOption", {
                        type: "nextMonth",
                        startDate: nextMonth.toISOString().split("T")[0],
                        endDate: monthAfter.toISOString().split("T")[0],
                      });
                    }}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Next Month
                  </Button>
                </div>
              </div>

              {/* Custom Date Range */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Custom Date Range
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="From Date"
                    type="date"
                    value={formData.availability?.customRange?.startDate || ""}
                    onChange={(e) =>
                      handleInputChange("availability.customRange", {
                        ...formData.availability?.customRange,
                        startDate: e.target.value,
                      })
                    }
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <Input
                    label="To Date"
                    type="date"
                    value={formData.availability?.customRange?.endDate || ""}
                    onChange={(e) =>
                      handleInputChange("availability.customRange", {
                        ...formData.availability?.customRange,
                        endDate: e.target.value,
                      })
                    }
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Blackout Dates */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Blackout Dates
                </h4>
                <div className="space-y-2">
                  {formData.availability.blackoutDates.map((date, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const newDates = [
                              ...formData.availability.blackoutDates,
                            ];
                            newDates[index] = e.target.value;
                            handleInputChange(
                              "availability.blackoutDates",
                              newDates
                            );
                          }}
                          className="border-red-200 focus:border-red-400 focus:ring-red-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newDates =
                            formData.availability.blackoutDates.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange(
                            "availability.blackoutDates",
                            newDates
                          );
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoCloseOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("availability.blackoutDates", [
                        ...formData.availability.blackoutDates,
                        "",
                      ])
                    }
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Blackout Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included/Excluded */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>What's Included & Excluded</CardTitle>
              <CardDescription>
                Specify what's included and excluded in the hotel stay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What's Included */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  What's Included
                </h4>
                <div className="space-y-2">
                  {formData.includedItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...formData.includedItems];
                            newItems[index] = e.target.value;
                            handleInputChange("includedItems", newItems);
                          }}
                          placeholder="Enter included item"
                          className="border-green-200 focus:border-green-400 focus:ring-green-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = formData.includedItems.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("includedItems", newItems);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoCloseOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("includedItems", [
                        ...formData.includedItems,
                        "",
                      ])
                    }
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Included Item
                  </Button>
                </div>
              </div>

              {/* What's Excluded */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  What's Excluded
                </h4>
                <div className="space-y-2">
                  {formData.excludedItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...formData.excludedItems];
                            newItems[index] = e.target.value;
                            handleInputChange("excludedItems", newItems);
                          }}
                          placeholder="Enter excluded item"
                          className="border-red-200 focus:border-red-400 focus:ring-red-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = formData.excludedItems.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("excludedItems", newItems);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoCloseOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("excludedItems", [
                        ...formData.excludedItems,
                        "",
                      ])
                    }
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Excluded Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Rates */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Pricing and Rates</CardTitle>
              <CardDescription>
                Set base rates, taxes, and pricing policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Base Rate (per night)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter base rate"
                  value={formData.rates.baseRate}
                  onChange={(e) =>
                    handleInputChange("rates.baseRate", e.target.value)
                  }
                  error={
                    touched.rates?.baseRate && errors.rates?.baseRate
                      ? errors.rates.baseRate
                      : ""
                  }
                  required
                />

                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData.rates.currency}
                  onChange={(value) =>
                    handleInputChange("rates.currency", value)
                  }
                />

                <Input
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter tax rate"
                  value={formData.rates.taxes.rate}
                  onChange={(e) =>
                    handleInputChange("rates.taxes.rate", e.target.value)
                  }
                />

                <div className="flex items-center">
                  <Checkbox
                    checked={formData.rates.taxes.included}
                    onChange={(e) =>
                      handleInputChange(
                        "rates.taxes.included",
                        e.target.checked
                      )
                    }
                    label="Taxes Included in Price"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Checkbox
                  checked={formData.rates.weekendRates.enabled}
                  onChange={(e) =>
                    handleInputChange(
                      "rates.weekendRates.enabled",
                      e.target.checked
                    )
                  }
                  label="Enable Weekend Rates"
                />
              </div>

              {formData.rates.weekendRates.enabled && (
                <Input
                  label="Weekend Rate Multiplier"
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  placeholder="Enter weekend rate multiplier"
                  value={formData.rates.weekendRates.multiplier}
                  onChange={(e) =>
                    handleInputChange(
                      "rates.weekendRates.multiplier",
                      e.target.value
                    )
                  }
                />
              )}
            </CardContent>
          </Card>
          {/* Guest Information */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
              <CardDescription>Guest policies and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Maximum Guests"
                  type="number"
                  min="1"
                  placeholder="Enter maximum guests"
                  value={formData.guestInfo.maximumGuests}
                  onChange={(e) =>
                    handleInputChange("guestInfo.maximumGuests", e.target.value)
                  }
                  error={
                    touched.guestInfo?.maximumGuests &&
                    errors.guestInfo?.maximumGuests
                      ? errors.guestInfo.maximumGuests
                      : ""
                  }
                  required
                />

                <Input
                  label="Minimum Age"
                  type="number"
                  min="0"
                  placeholder="Enter minimum age"
                  value={formData.guestInfo.minimumAge}
                  onChange={(e) =>
                    handleInputChange("guestInfo.minimumAge", e.target.value)
                  }
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Children Policy
                </h4>
                <div className="flex gap-4">
                  <Checkbox
                    checked={formData.guestInfo.childrenPolicy.allowed}
                    onChange={(e) =>
                      handleInputChange(
                        "guestInfo.childrenPolicy.allowed",
                        e.target.checked
                      )
                    }
                    label="Children Allowed"
                  />
                </div>

                {formData.guestInfo.childrenPolicy.allowed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Age Limit"
                      type="number"
                      min="0"
                      max="18"
                      placeholder="Enter age limit"
                      value={formData.guestInfo.childrenPolicy.ageLimit}
                      onChange={(e) =>
                        handleInputChange(
                          "guestInfo.childrenPolicy.ageLimit",
                          e.target.value
                        )
                      }
                    />

                    <Select
                      label="Charges"
                      options={childrenChargesOptions}
                      value={formData.guestInfo.childrenPolicy.charges}
                      onChange={(value) =>
                        handleInputChange(
                          "guestInfo.childrenPolicy.charges",
                          value
                        )
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Pet Policy
                </h4>
                <div className="flex gap-4">
                  <Checkbox
                    checked={formData.guestInfo.petPolicy.allowed}
                    onChange={(checked) =>
                      handleInputChange("guestInfo.petPolicy.allowed", checked)
                    }
                    label="Pets Allowed"
                  />
                </div>

                {formData.guestInfo.petPolicy.allowed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Additional Fee"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter additional fee"
                      value={formData.guestInfo.petPolicy.additionalFee}
                      onChange={(e) =>
                        handleInputChange(
                          "guestInfo.petPolicy.additionalFee",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      label="Restrictions"
                      placeholder="Enter pet restrictions"
                      value={formData.guestInfo.petPolicy.restrictions}
                      onChange={(e) =>
                        handleInputChange(
                          "guestInfo.petPolicy.restrictions",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tags */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add searchable tags for your hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Enter tag"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} className="px-4 py-2">
                  <IoAddOutline className="w-4 h-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <IoCloseOutline className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Select hotel amenities and facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Custom Amenity */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Add Custom Amenity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Amenity Name"
                    value={newAmenity.name}
                    onChange={(e) =>
                      setNewAmenity((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Select
                    placeholder="Category"
                    options={amenityCategoryOptions}
                    value={newAmenity.category}
                    onChange={(value) =>
                      setNewAmenity((prev) => ({ ...prev, category: value }))
                    }
                  />
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Icon
                  </label>
                  <div className="relative" ref={amenityMenuRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setShowAmenityIconMenu(!showAmenityIconMenu)
                      }
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {newAmenity.icon
                            ? amenityIconOptions.find(
                                (icon) => icon.value === newAmenity.icon
                              )?.emoji || "⭐"
                            : "📶"}
                        </span>
                        <span className="text-sm text-gray-700">
                          {newAmenity.icon
                            ? amenityIconOptions.find(
                                (icon) => icon.value === newAmenity.icon
                              )?.value || "Custom"
                            : "Select Icon"}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          showAmenityIconMenu ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showAmenityIconMenu && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2 p-3">
                          {amenityIconOptions.map((icon, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setNewAmenity((prev) => ({
                                  ...prev,
                                  icon: icon.value,
                                }));
                                setShowAmenityIconMenu(false);
                              }}
                              className={`p-2 text-lg border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                                newAmenity.icon === icon.value
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              title={icon.value}
                            >
                              {icon.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomAmenity}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  <IoAddOutline className="w-4 h-4 mr-2" />
                  Add Amenity
                </Button>
              </div>

              {/* Predefined Amenities */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Predefined Amenities
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {predefinedAmenities.map((amenity, index) => {
                    const isSelected = formData.amenities.some(
                      (a) => a.name === amenity.name
                    );
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addAmenity(amenity)}
                        className={`p-3 text-left border rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "border-green-500 bg-green-50 text-green-800 shadow-sm"
                            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {amenity.icon === "wifi" && "📶"}
                            {amenity.icon === "ac" && "❄️"}
                            {amenity.icon === "parking" && "🅿️"}
                            {amenity.icon === "pool" && "🏊"}
                            {amenity.icon === "gym" && "💪"}
                            {amenity.icon === "restaurant" && "🍽️"}
                            {amenity.icon === "spa" && "🧘"}
                            {amenity.icon === "bar" && "🍸"}
                            {amenity.icon === "concierge" && "🎩"}
                            {amenity.icon === "room-service" && "🛎️"}
                            {amenity.icon === "business" && "💼"}
                            {amenity.icon === "laundry" && "👕"}
                            {amenity.icon === "airport-shuttle" && "🚌"}
                            {amenity.icon === "pet-friendly" && "🐕"}
                            {amenity.icon === "accessible" && "♿"}
                            {amenity.icon === "smoking" && "🚭"}
                            {amenity.icon === "non-smoking" && "🚭"}
                            {amenity.icon === "meeting" && "🏢"}
                            {amenity.icon === "security" && "🔒"}
                            {amenity.icon === "elevator" && "🛗"}
                            {amenity.icon === "balcony" && "🏠"}
                            {amenity.icon === "kitchen" && "🍳"}
                            {amenity.icon === "tv" && "📺"}
                            {amenity.icon === "phone" && "📞"}
                            {amenity.icon === "custom" && "⭐"}
                          </span>
                          <div className="font-medium text-sm flex-1">
                            {amenity.name}
                          </div>
                          {isSelected && (
                            <span className="text-green-600 text-sm">✓</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {amenity.category}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        <span className="text-sm">
                          {amenity.icon === "wifi" && "📶"}
                          {amenity.icon === "ac" && "❄️"}
                          {amenity.icon === "parking" && "🅿️"}
                          {amenity.icon === "pool" && "🏊"}
                          {amenity.icon === "gym" && "💪"}
                          {amenity.icon === "restaurant" && "🍽️"}
                          {amenity.icon === "spa" && "🧘"}
                          {amenity.icon === "bar" && "🍸"}
                          {amenity.icon === "concierge" && "🎩"}
                          {amenity.icon === "room-service" && "🛎️"}
                          {amenity.icon === "business" && "💼"}
                          {amenity.icon === "laundry" && "👕"}
                          {amenity.icon === "airport-shuttle" && "🚌"}
                          {amenity.icon === "pet-friendly" && "🐕"}
                          {amenity.icon === "accessible" && "♿"}
                          {amenity.icon === "smoking" && "🚭"}
                          {amenity.icon === "non-smoking" && "🚭"}
                          {amenity.icon === "meeting" && "🏢"}
                          {amenity.icon === "security" && "🔒"}
                          {amenity.icon === "elevator" && "🛗"}
                          {amenity.icon === "balcony" && "🏠"}
                          {amenity.icon === "kitchen" && "🍳"}
                          {amenity.icon === "tv" && "📺"}
                          {amenity.icon === "phone" && "📞"}
                          {amenity.icon === "custom" && "⭐"}
                        </span>
                        {amenity.name}
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <IoCloseOutline className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Select hotel features and highlights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Custom Feature */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Add Custom Feature
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Feature Name"
                    value={newFeature.name}
                    onChange={(e) =>
                      setNewFeature((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={newFeature.description}
                    onChange={(e) =>
                      setNewFeature((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Icon Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Icon
                  </label>
                  <div className="relative" ref={featureMenuRef}>
                    <button
                      type="button"
                      onClick={() =>
                        setShowFeatureIconMenu(!showFeatureIconMenu)
                      }
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-purple-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {newFeature.icon
                            ? featureIconOptions.find(
                                (icon) => icon.value === newFeature.icon
                              )?.emoji || "⭐"
                            : "✨"}
                        </span>
                        <span className="text-sm text-gray-700">
                          {newFeature.icon
                            ? featureIconOptions.find(
                                (icon) => icon.value === newFeature.icon
                              )?.value || "Custom"
                            : "Select Icon"}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          showFeatureIconMenu ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showFeatureIconMenu && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2 p-3">
                          {featureIconOptions.map((icon, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setNewFeature((prev) => ({
                                  ...prev,
                                  icon: icon.value,
                                }));
                                setShowFeatureIconMenu(false);
                              }}
                              className={`p-2 text-lg border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors ${
                                newFeature.icon === icon.value
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200"
                              }`}
                              title={icon.value}
                            >
                              {icon.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomFeature}
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                >
                  <IoAddOutline className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              {/* Predefined Features */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Predefined Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {predefinedFeatures.map((feature, index) => {
                    const isSelected = formData.features.some(
                      (f) => f.name === feature.name
                    );
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addFeature(feature)}
                        className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "border-green-500 bg-green-50 text-green-800 shadow-sm"
                            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {feature.icon === "cancellation" && "❌"}
                            {feature.icon === "early-checkin" && "⏰"}
                            {feature.icon === "late-checkout" && "⏰"}
                            {feature.icon === "breakfast" && "🍳"}
                            {feature.icon === "airport-transfer" && "✈️"}
                            {feature.icon === "city-tour" && "🏛️"}
                            {feature.icon === "concierge" && "🎩"}
                            {feature.icon === "support" && "🆘"}
                            {feature.icon === "luxury" && "✨"}
                            {feature.icon === "beachfront" && "🏖️"}
                            {feature.icon === "mountain-view" && "🏔️"}
                            {feature.icon === "city-center" && "🏙️"}
                            {feature.icon === "historic" && "🏛️"}
                            {feature.icon === "modern" && "🏢"}
                            {feature.icon === "boutique" && "🎨"}
                            {feature.icon === "family-friendly" && "👨‍👩‍👧‍👦"}
                            {feature.icon === "romantic" && "💕"}
                            {feature.icon === "business" && "💼"}
                            {feature.icon === "eco-friendly" && "🌱"}
                            {feature.icon === "pet-friendly" && "🐕"}
                            {feature.icon === "accessible" && "♿"}
                            {feature.icon === "smoking" && "🚭"}
                            {feature.icon === "non-smoking" && "🚭"}
                            {feature.icon === "custom" && "⭐"}
                          </span>
                          <div className="font-medium text-sm flex-1">
                            {feature.name}
                          </div>
                          {isSelected && (
                            <span className="text-green-600 text-sm">✓</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {feature.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected Features
                  </h4>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {feature.icon === "cancellation" && "❌"}
                            {feature.icon === "early-checkin" && "⏰"}
                            {feature.icon === "late-checkout" && "⏰"}
                            {feature.icon === "breakfast" && "🍳"}
                            {feature.icon === "airport-transfer" && "✈️"}
                            {feature.icon === "city-tour" && "🏛️"}
                            {feature.icon === "concierge" && "🎩"}
                            {feature.icon === "support" && "🆘"}
                            {feature.icon === "luxury" && "✨"}
                            {feature.icon === "beachfront" && "🏖️"}
                            {feature.icon === "mountain-view" && "🏔️"}
                            {feature.icon === "city-center" && "🏙️"}
                            {feature.icon === "historic" && "🏛️"}
                            {feature.icon === "modern" && "🏢"}
                            {feature.icon === "boutique" && "🎨"}
                            {feature.icon === "family-friendly" && "👨‍👩‍👧‍👦"}
                            {feature.icon === "romantic" && "💕"}
                            {feature.icon === "business" && "💼"}
                            {feature.icon === "eco-friendly" && "🌱"}
                            {feature.icon === "pet-friendly" && "🐕"}
                            {feature.icon === "accessible" && "♿"}
                            {feature.icon === "smoking" && "🚭"}
                            {feature.icon === "non-smoking" && "🚭"}
                            {feature.icon === "custom" && "⭐"}
                          </span>
                          <div>
                            <div className="font-medium text-sm text-green-800">
                              {feature.name}
                            </div>
                            <div className="text-xs text-green-600">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <IoCloseOutline className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-none" data-field="images">
            <CardHeader>
              <CardTitle>Hotel Gallery</CardTitle>
              <CardDescription>
                Upload images for your hotel (minimum 4 images required)
              </CardDescription>
              {touched?.images && errors?.images && (
                <div className="text-red-600 text-sm mt-1">{errors.images}</div>
              )}
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    console.log("Files selected:", files);
                    console.log(
                      "Files are File instances:",
                      files.every((file) => file instanceof File)
                    );

                    // Only upload if files are selected and are valid File objects
                    if (
                      files.length > 0 &&
                      files.every((file) => file instanceof File)
                    ) {
                      console.log("Uploading files:", files);
                      handleFileUpload(files);
                    } else {
                      console.log("No valid files to upload");
                    }

                    // Reset the input to prevent accumulation
                    e.target.value = "";
                  }}
                  className="hidden"
                  id="hotel-images"
                />
                <label
                  htmlFor="hotel-images"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <IoImageOutline className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Upload hotel images (minimum 4, max 10)
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB each
                  </span>
                  {formData.images && formData.images.length > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      {formData.images.length} image(s) uploaded
                    </div>
                  )}
                </label>
              </div>

              {/* Display Images */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? "Hotel Images" : "Uploaded Images"}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images
                      .filter((image) => {
                        // Filter out empty objects and ensure we have valid images
                        if (image instanceof File) {
                          return true;
                        }
                        if (image && (image.url || image._id)) {
                          return true;
                        }
                        return false;
                      })
                      .map((image, index) => {
                        // Check if it's a File object (new upload) or existing image from database
                        const isFile = image instanceof File;
                        const imageUrl = isFile
                          ? URL.createObjectURL(image)
                          : image.url || image;
                        const imageId = isFile ? null : image._id || image.id;

                        return (
                          <div key={imageId || index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Hotel image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (isFile) {
                                  // Remove from new uploads
                                  const newImages = formData.images.filter(
                                    (_, i) => i !== index
                                  );
                                  handleArrayChange("images", newImages);
                                } else if (handleFileRemove) {
                                  // Delete from database - pass the image object with index for new images
                                  const imageToRemove = isFile
                                    ? { ...image, index }
                                    : image;
                                  handleFileRemove(imageToRemove);
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            >
                              <IoCloseOutline />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status and Visibility */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Status and Visibility</CardTitle>
              <CardDescription>
                Control hotel visibility and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "pending", label: "Pending" },
                    { value: "suspended", label: "Suspended" },
                  ]}
                  value={formData.status}
                  onChange={(value) => handleInputChange("status", value)}
                />

                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    label="Active"
                  />
                  <Checkbox
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      handleInputChange("isFeatured", e.target.checked)
                    }
                    label="Featured"
                  />
                  <Checkbox
                    checked={formData.isVerified}
                    onChange={(e) =>
                      handleInputChange("isVerified", e.target.checked)
                    }
                    label="Verified"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="Enter meta title"
                value={formData.seo.metaTitle}
                onChange={(e) =>
                  handleInputChange("seo.metaTitle", e.target.value)
                }
              />

              <Textarea
                label="Meta Description"
                placeholder="Enter meta description"
                value={formData.seo.metaDescription}
                onChange={(e) =>
                  handleInputChange("seo.metaDescription", e.target.value)
                }
                rows={3}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.seo.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => {
                          const newKeywords = formData.seo.keywords.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("seo.keywords", newKeywords);
                        }}
                        className="ml-2 hover:text-purple-600"
                      >
                        <IoCloseOutline className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add keywords (press Enter to add)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const keyword = e.target.value.trim();
                      if (keyword && !formData.seo.keywords.includes(keyword)) {
                        handleInputChange("seo.keywords", [
                          ...formData.seo.keywords,
                          keyword,
                        ]);
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </div>

              <Input
                label="Canonical URL"
                placeholder="Enter canonical URL"
                value={formData.seo?.canonicalUrl || ""}
                onChange={(e) =>
                  handleInputChange("seo.canonicalUrl", e.target.value)
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Open Graph Title"
                  placeholder="Enter OG title"
                  value={formData.seo?.ogTitle || ""}
                  onChange={(e) =>
                    handleInputChange("seo.ogTitle", e.target.value)
                  }
                />

                <Input
                  label="Open Graph Description"
                  placeholder="Enter OG description"
                  value={formData.seo?.ogDescription || ""}
                  onChange={(e) =>
                    handleInputChange("seo.ogDescription", e.target.value)
                  }
                />
              </div>

              <Input
                label="Twitter Card Title"
                placeholder="Enter Twitter card title"
                value={formData.seo?.twitterTitle || ""}
                onChange={(e) =>
                  handleInputChange("seo.twitterTitle", e.target.value)
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-300">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? "Creating Hotel..." : "Create Hotel"}
        </Button>
      </div>
    </div>
  );
};

export default HotelForm;
