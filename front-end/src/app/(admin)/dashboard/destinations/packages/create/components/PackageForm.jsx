"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import RadioGroup from "@/components/ui/RadioGroup";
import Checkbox from "@/components/ui/Checkbox";
import FileUpload from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";
import { IoAddOutline, IoTrashOutline, IoCloseOutline } from "react-icons/io5";

const PackageForm = ({
  formData,
  errors,
  loading,
  featureHighlight,
  setFeatureHighlight,
  featureHighlights,
  predefinedFeatures,
  iconOptions,
  handleInputChange,
  handleArrayChange,
  addFeatureHighlight,
  removeFeatureHighlight,
  addPredefinedFeature,
  isFeatureSelected,
  handleFileUpload,
  handleFileRemove,
  handleSubmit,
  isEditMode = false,
}) => {
  const categoryOptions = [
    { value: "tour", label: "Tour" },
    { value: "activity", label: "Activity" },
    { value: "experience", label: "Experience" },
    { value: "attraction", label: "Attraction" },
    { value: "accommodation", label: "Accommodation" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "INR", label: "INR" },
  ];

  const durationUnitOptions = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Japanese", label: "Japanese" },
  ];

  const cancellationPolicyOptions = [
    { value: "flexible", label: "Flexible" },
    { value: "moderate", label: "Moderate" },
    { value: "strict", label: "Strict" },
    { value: "non_refundable", label: "Non-refundable" },
  ];

  const visibilityOptions = [
    { value: "public", label: "Public" },
    { value: "users_only", label: "Users Only" },
    { value: "private", label: "Private" },
  ];

  const statusOptions = [
    { value: "active", label: "Publish" },
    { value: "draft", label: "Un Publish" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Descriptions Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Descriptions</CardTitle>
              <CardDescription>
                Basic package information and descriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Package Name"
                placeholder="Enter Package Name"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={errors.title}
                required
              />

              <Input
                label="Location"
                placeholder="Enter Location"
                value={formData.location.city}
                onChange={(e) =>
                  handleInputChange("location.city", e.target.value)
                }
                error={errors["location.city"]}
                required
              />

              <Textarea
                label="Description"
                placeholder="Enter detailed package description..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={errors.description}
                required
                rows={4}
              />

              <Textarea
                label="Short Description"
                placeholder="Enter brief package summary..."
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Feature Highlights Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Create Short Feature Highlights</CardTitle>
              <CardDescription>
                Add key features and highlights for your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                  placeholder="Icon"
                  options={iconOptions}
                  value={featureHighlight.icon}
                  onChange={(value) =>
                    setFeatureHighlight((prev) => ({ ...prev, icon: value }))
                  }
                />
                <Input
                  placeholder="Key Feature"
                  value={featureHighlight.name}
                  onChange={(e) =>
                    setFeatureHighlight((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Short Description"
                  value={featureHighlight.description}
                  onChange={(e) =>
                    setFeatureHighlight((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeatureHighlight}
                className="w-full"
              >
                <IoAddOutline className="w-4 h-4 mr-2" />
                Create Feature
              </Button>

              {/* Predefined Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Add Features:
                </h4>
                {predefinedFeatures.map((feature, index) => {
                  const isSelected = isFeatureSelected(feature.name);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-green-50 border border-green-200 opacity-60"
                          : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      }`}
                      onClick={() =>
                        !isSelected && addPredefinedFeature(feature)
                      }
                    >
                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${
                            isSelected ? "text-green-700" : "text-gray-900"
                          }`}
                        >
                          {feature.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isSelected ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {feature.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium">
                            Added
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              addPredefinedFeature(feature);
                            }
                          }}
                          disabled={isSelected}
                          className={isSelected ? "opacity-50" : ""}
                        >
                          {isSelected ? "✓" : "Add"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Added Features */}
              {featureHighlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Added Features:
                  </h4>
                  {featureHighlights.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium text-sm">
                            {feature.icon === "star" && "⭐"}
                            {feature.icon === "heart" && "❤️"}
                            {feature.icon === "shield" && "🛡️"}
                            {feature.icon === "checkmark" && "✅"}
                          </span>
                          <div className="font-medium text-sm text-blue-900">
                            {feature.name}
                          </div>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {feature.description}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeatureHighlight(index)}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Categories Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Package Categories</CardTitle>
              <CardDescription>Categorize and tag your package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Package Categories"
                placeholder="Select Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.filter(
                            (_, i) => i !== index
                          );
                          handleArrayChange("tags", newTags);
                        }}
                        className="ml-2 hover:text-blue-600"
                      >
                        <IoCloseOutline className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter to add)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const tag = e.target.value.trim();
                      if (tag && !formData.tags.includes(tag)) {
                        handleArrayChange("tags", [...formData.tags, tag]);
                        e.target.value = "";
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Transportation Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Transportation</CardTitle>
              <CardDescription>
                Include transportation in your package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                name="transportation"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                value={
                  formData.price.priceIncludes.includes("transportation")
                    ? "yes"
                    : "no"
                }
                onChange={(e) => {
                  const includes =
                    e.target.value === "yes"
                      ? [
                          ...formData.price.priceIncludes.filter(
                            (item) => item !== "transportation"
                          ),
                          "transportation",
                        ]
                      : formData.price.priceIncludes.filter(
                          (item) => item !== "transportation"
                        );
                  handleInputChange("price.priceIncludes", includes);
                }}
              />
            </CardContent>
          </Card>

          {/* Safety Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Safety</CardTitle>
              <CardDescription>
                Add health precautions and safety measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Health Precautions
                </h4>
                <div className="space-y-2">
                  {formData.healthSafetyMeasures.map((measure, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={measure}
                          onChange={(e) => {
                            const newMeasures = [
                              ...formData.healthSafetyMeasures,
                            ];
                            newMeasures[index] = e.target.value;
                            handleInputChange(
                              "healthSafetyMeasures",
                              newMeasures
                            );
                          }}
                          placeholder="Add health precaution"
                          className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMeasures =
                            formData.healthSafetyMeasures.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange(
                            "healthSafetyMeasures",
                            newMeasures
                          );
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("healthSafetyMeasures", [
                        ...formData.healthSafetyMeasures,
                        "",
                      ])
                    }
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Health Precaution
                  </Button>
                </div>
              </div>

              {/* Predefined Safety Measures */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Add Safety Measures:
                </h4>
                {[
                  "All required protective equipment is provided",
                  "All areas that customers touch are frequently cleaned",
                  "You must keep social distance while in vehicles",
                  "The number of visitors is limited to reduce crowds",
                ].map((measure, index) => {
                  const isSelected =
                    formData.healthSafetyMeasures.includes(measure);
                  const safetyIcons = ["🛡️", "🧽", "📏", "👥"];
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-green-50 border border-green-200 opacity-60"
                          : "bg-orange-50 hover:bg-orange-100 cursor-pointer border border-orange-100"
                      }`}
                      onClick={() =>
                        !isSelected &&
                        handleInputChange("healthSafetyMeasures", [
                          ...formData.healthSafetyMeasures,
                          measure,
                        ])
                      }
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{safetyIcons[index]}</span>
                          <div
                            className={`text-sm ${
                              isSelected ? "text-green-700" : "text-orange-800"
                            }`}
                          >
                            {measure}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium">
                            Added
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              handleInputChange("healthSafetyMeasures", [
                                ...formData.healthSafetyMeasures,
                                measure,
                              ]);
                            }
                          }}
                          disabled={isSelected}
                          className={
                            isSelected ? "opacity-50" : "hover:bg-orange-200"
                          }
                        >
                          {isSelected ? "✓" : "Add"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activities Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Package Activities</CardTitle>
              <CardDescription>
                Define the activities included in your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Activities
                </h4>
                <div className="space-y-2">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={activity.name || activity || ""}
                          onChange={(e) => {
                            const newActivities = [...formData.activities];
                            newActivities[index] = e.target.value;
                            handleInputChange("activities", newActivities);
                          }}
                          placeholder="Add activity"
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newActivities = formData.activities.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("activities", newActivities);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("activities", [
                        ...formData.activities,
                        "",
                      ])
                    }
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </div>

              {/* Quick Add Common Activities */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Add Common Activities:
                </h4>
                {[
                  "Guided tour of main attractions",
                  "Local cultural experience",
                  "Traditional meal at local restaurant",
                ].map((activity, index) => {
                  const isSelected = formData.activities.includes(activity);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-green-50 border border-green-200 opacity-60"
                          : "bg-blue-50 hover:bg-blue-100 cursor-pointer border border-blue-100"
                      }`}
                      onClick={() =>
                        !isSelected &&
                        handleInputChange("activities", [
                          ...formData.activities,
                          activity,
                        ])
                      }
                    >
                      <div className="flex-1">
                        <div
                          className={`text-sm ${
                            isSelected ? "text-green-700" : "text-blue-800"
                          }`}
                        >
                          {activity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium">
                            Added
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              handleInputChange("activities", [
                                ...formData.activities,
                                activity,
                              ]);
                            }
                          }}
                          disabled={isSelected}
                          className={
                            isSelected ? "opacity-50" : "hover:bg-blue-200"
                          }
                        >
                          {isSelected ? "✓" : "Add"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Includes/Excludes Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>What's Included/Not Included</CardTitle>
              <CardDescription>
                Define what's included and excluded in your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    Includes
                  </span>
                </label>
                <div className="space-y-2">
                  {formData.price.priceIncludes.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newIncludes = [
                              ...formData.price.priceIncludes,
                            ];
                            newIncludes[index] = e.target.value;
                            handleInputChange(
                              "price.priceIncludes",
                              newIncludes
                            );
                          }}
                          placeholder="Add bullet point"
                          className="border-green-200 focus:border-green-400 focus:ring-green-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newIncludes =
                            formData.price.priceIncludes.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange("price.priceIncludes", newIncludes);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("price.priceIncludes", [
                        ...formData.price.priceIncludes,
                        "",
                      ])
                    }
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Include
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    Excludes
                  </span>
                </label>
                <div className="space-y-2">
                  {formData.price.priceExcludes.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newExcludes = [
                              ...formData.price.priceExcludes,
                            ];
                            newExcludes[index] = e.target.value;
                            handleInputChange(
                              "price.priceExcludes",
                              newExcludes
                            );
                          }}
                          placeholder="Add bullet point"
                          className="border-red-200 focus:border-red-400 focus:ring-red-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newExcludes =
                            formData.price.priceExcludes.filter(
                              (_, i) => i !== index
                            );
                          handleInputChange("price.priceExcludes", newExcludes);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("price.priceExcludes", [
                        ...formData.price.priceExcludes,
                        "",
                      ])
                    }
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Exclude
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* What's Inside the Package Section */}
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                What's Inside the Package
              </CardTitle>
              <CardDescription>
                List the key attractions, experiences, and highlights included
                in your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Package Contents
                </h4>
                <div className="space-y-2">
                  {formData.whatsInside.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          value={item || ""}
                          onChange={(e) => {
                            const newItems = [...formData.whatsInside];
                            newItems[index] = e.target.value;
                            handleInputChange("whatsInside", newItems);
                          }}
                          placeholder="Add package content"
                          className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = formData.whatsInside.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("whatsInside", newItems);
                        }}
                        className="hover:bg-red-100"
                      >
                        <IoTrashOutline className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleInputChange("whatsInside", [
                        ...formData.whatsInside,
                        "",
                      ])
                    }
                    className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <IoAddOutline className="w-4 h-4 mr-2" />
                    Add Package Content
                  </Button>
                </div>
              </div>

              {/* Quick Add Common Package Contents */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Add Common Contents
                </h4>
                {[
                  "Guided tour of main attractions",
                  "Professional photography session",
                  "Local transportation included",
                  "Traditional meal experience",
                  "Cultural performance show",
                  "Souvenir shopping time",
                ].map((item, index) => {
                  const isSelected = formData.whatsInside.includes(item);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-green-50 border border-green-200 opacity-60"
                          : "bg-purple-50 hover:bg-purple-100 cursor-pointer border border-purple-100"
                      }`}
                      onClick={() =>
                        !isSelected &&
                        handleInputChange("whatsInside", [
                          ...formData.whatsInside,
                          item,
                        ])
                      }
                    >
                      <div className="flex-1">
                        <div
                          className={`text-sm ${
                            isSelected ? "text-green-700" : "text-purple-800"
                          }`}
                        >
                          {item}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium">
                            Added
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSelected) {
                              handleInputChange("whatsInside", [
                                ...formData.whatsInside,
                                item,
                              ]);
                            }
                          }}
                          disabled={isSelected}
                          className={
                            isSelected ? "opacity-50" : "hover:bg-purple-200"
                          }
                        >
                          {isSelected ? "✓" : "Add"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          {/* Location Details Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>
                Add detailed location information and meeting point
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Address"
                  placeholder="Enter complete address"
                  value={formData.location.address}
                  onChange={(e) =>
                    handleInputChange("location.address", e.target.value)
                  }
                />
                <Input
                  label="State/Province"
                  placeholder="Enter state or province"
                  value={formData.location.state}
                  onChange={(e) =>
                    handleInputChange("location.state", e.target.value)
                  }
                />
              </div>

              <Input
                label="Country"
                placeholder="Enter country"
                value={formData.location.country}
                onChange={(e) =>
                  handleInputChange("location.country", e.target.value)
                }
              />

              <Input
                label="Location Link"
                placeholder="Enter Google Maps link or website URL"
                type="url"
                value={formData.location.link || ""}
                onChange={(e) =>
                  handleInputChange("location.link", e.target.value)
                }
              />

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Meeting Point
                </h4>
                <Input
                  label="Meeting Point Address"
                  placeholder="Enter meeting point address"
                  value={formData.meetingPoint?.address || ""}
                  onChange={(e) =>
                    handleInputChange("meetingPoint.address", e.target.value)
                  }
                />
                <Textarea
                  label="Meeting Instructions"
                  placeholder="Enter specific meeting instructions..."
                  value={formData.meetingPoint?.instructions || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "meetingPoint.instructions",
                      e.target.value
                    )
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Package Gallery Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Package Gallery</CardTitle>
              <CardDescription>Upload images for your package</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept="image/*"
                multiple
                maxFiles={6}
                onFilesChange={handleFileUpload}
                onFileRemove={handleFileRemove}
                existingFiles={formData.images}
                label="Package Photos"
                required
              />
            </CardContent>
          </Card>

          {/* Price Details Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
              <CardDescription>
                Set pricing and availability for your package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Package Cost"
                placeholder="Enter Package Cost"
                type="number"
                value={formData.price.basePrice}
                onChange={(e) =>
                  handleInputChange("price.basePrice", e.target.value)
                }
                error={errors["price.basePrice"]}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Package Price"
                  placeholder="Enter Package Selling Price"
                  type="number"
                  value={formData.price.basePrice}
                  onChange={(e) =>
                    handleInputChange("price.basePrice", e.target.value)
                  }
                />
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData.price.currency}
                  onChange={(value) =>
                    handleInputChange("price.currency", value)
                  }
                />
              </div>

              <Input
                label="Package Discount"
                placeholder="Enter Discount (%)"
                type="number"
                min="0"
                max="100"
              />

              <Input
                label="Available Date"
                placeholder="Select Date Range"
                type="date"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Package Duration"
                  placeholder="3"
                  value={formData.duration.value}
                  onChange={(e) =>
                    handleInputChange("duration.value", e.target.value)
                  }
                  error={errors["duration.value"]}
                  required
                />
                <Select
                  label="Duration Unit"
                  options={durationUnitOptions}
                  value={formData.duration.unit}
                  onChange={(value) =>
                    handleInputChange("duration.unit", value)
                  }
                />
              </div>

              <RadioGroup
                label="Allow Kids"
                name="allowKids"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                value="yes"
              />
            </CardContent>
          </Card>

          {/* Publish Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Publish</CardTitle>
              <CardDescription>
                Control package visibility and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                label="Package Visibility"
                name="visibility"
                options={visibilityOptions}
                value={formData.status === "active" ? "public" : "private"}
                onChange={(e) => {
                  const status =
                    e.target.value === "public" ? "active" : "draft";
                  handleInputChange("status", status);
                }}
              />

              <RadioGroup
                label="Package Status"
                name="status"
                options={statusOptions}
                value={formData.status === "active" ? "active" : "draft"}
                onChange={(e) => handleInputChange("status", e.target.value)}
              />

              <Input label="Schedule" placeholder="Select Date" type="date" />
            </CardContent>
          </Card>

          {/* Additional Details Section */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Add more specific information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => {
                          const newLanguages = formData.languages.filter(
                            (_, i) => i !== index
                          );
                          handleArrayChange("languages", newLanguages);
                        }}
                        className="ml-2 hover:text-green-600"
                      >
                        <IoCloseOutline className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select
                  placeholder="Add language"
                  options={languageOptions}
                  onChange={(value) => {
                    if (value && !formData.languages.includes(value)) {
                      handleArrayChange("languages", [
                        ...formData.languages,
                        value,
                      ]);
                    }
                  }}
                />
              </div>

              <Input
                label="Maximum Guests"
                placeholder="Enter maximum guests"
                type="number"
                value={formData.capacity.maxGuests}
                onChange={(e) =>
                  handleInputChange("capacity.maxGuests", e.target.value)
                }
                error={errors["capacity.maxGuests"]}
                required
              />

              <Select
                label="Cancellation Policy"
                options={cancellationPolicyOptions}
                value={formData.cancellationPolicy}
                onChange={(value) =>
                  handleInputChange("cancellationPolicy", value)
                }
              />

              <Checkbox
                label="Featured Package"
                checked={formData.featured}
                onChange={(e) =>
                  handleInputChange("featured", e.target.checked)
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
          {loading
            ? isEditMode
              ? "Updating Package..."
              : "Creating Package..."
            : isEditMode
            ? "Update Package"
            : "Create Package"}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;
