import * as yup from "yup";

export const hotelValidationSchema = yup.object().shape({
  // Basic Information
  name: yup
    .string()
    .required("Hotel name is required")
    .min(2, "Hotel name must be at least 2 characters")
    .max(100, "Hotel name must be less than 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  website: yup
    .string()
    .url("Please provide a valid website URL starting with http:// or https://")
    .nullable(),

  location: yup
    .string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters"),

  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),

  phone: yup.object().shape({
    code: yup
      .string()
      .required("Phone code is required")
      .matches(
        /^\+\d{1,4}$/,
        "Please enter a valid phone code (e.g., +1, +91)"
      ),
    number: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d{10,15}$/, "Please enter a valid phone number"),
  }),

  starRating: yup
    .number()
    .min(1, "Star rating must be between 1 and 5")
    .max(5, "Star rating must be between 1 and 5")
    .nullable(),

  category: yup.string().required("Category is required"),

  description: yup.string().nullable(),
  shortDescription: yup.string().nullable(),

  // Location Details
  coordinates: yup.object().shape({
    latitude: yup
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .nullable(),
    longitude: yup
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .nullable(),
    googleMapsLink: yup
      .string()
      .url("Please provide a valid Google Maps URL")
      .nullable(),
  }),

  // Room Information
  rooms: yup.object().shape({
    totalRooms: yup
      .number()
      .required("Total rooms is required")
      .min(1, "Total rooms must be a valid positive number")
      .max(1000, "Total rooms cannot exceed 1000"),
    availableRooms: yup
      .number()
      .min(0, "Available rooms cannot be negative")
      .nullable(),
    roomTypes: yup.array().nullable(),
  }),

  // Booking Information
  booking: yup.object().shape({
    isBookable: yup.boolean(),
    advanceBookingDays: yup.number().nullable(),
    minimumStay: yup
      .number()
      .required("Minimum stay is required")
      .min(1, "Minimum stay must be a valid positive number")
      .max(30, "Minimum stay cannot exceed 30 days"),
    maximumStay: yup
      .number()
      .required("Maximum stay is required")
      .min(1, "Maximum stay must be a valid positive number")
      .max(365, "Maximum stay cannot exceed 365 days")
      .test(
        "min-max",
        "Maximum stay must be greater than minimum stay",
        function (value) {
          const { minimumStay } = this.parent;
          return !value || !minimumStay || value >= minimumStay;
        }
      ),
    checkInTime: yup.string().nullable(),
    checkOutTime: yup.string().nullable(),
    flexibleCheckIn: yup.boolean(),
    flexibleCheckOut: yup.boolean(),
  }),

  // Pricing and Rates
  rates: yup.object().shape({
    baseRate: yup
      .number()
      .required("Base rate is required")
      .min(0, "Base rate must be a valid positive number")
      .max(99999, "Base rate must be less than $100,000"),
    currency: yup.string().required(),
    seasonalRates: yup.array().nullable(),
    weekendRates: yup.object().shape({
      enabled: yup.boolean(),
      multiplier: yup.number().min(0.1).max(5).nullable(),
    }),
    taxes: yup.object().shape({
      included: yup.boolean(),
      rate: yup
        .number()
        .min(0, "Tax rate must be between 0 and 100")
        .max(100, "Tax rate must be between 0 and 100")
        .nullable(),
    }),
    fees: yup.array().nullable(),
  }),

  // Availability
  availability: yup.object().shape({
    isAvailable: yup.boolean(),
    quickOption: yup.object().nullable(),
    customRange: yup.object().nullable(),
    blackoutDates: yup.array().nullable(),
    maintenanceDates: yup.array().nullable(),
    seasonalAvailability: yup.array().nullable(),
  }),

  // Guest Information
  guestInfo: yup.object().shape({
    minimumAge: yup.number().min(0).nullable(),
    maximumGuests: yup
      .number()
      .required("Maximum guests is required")
      .min(1, "Maximum guests must be a valid positive number")
      .max(20, "Maximum guests cannot exceed 20"),
    childrenPolicy: yup.object().shape({
      allowed: yup.boolean(),
      ageLimit: yup.number().min(0).max(18).nullable(),
      charges: yup.string().nullable(),
    }),
    petPolicy: yup.object().shape({
      allowed: yup.boolean(),
      restrictions: yup.string().nullable(),
      additionalFee: yup.number().min(0).nullable(),
    }),
  }),

  // Policies
  policies: yup.object().shape({
    checkIn: yup.object().shape({
      time: yup.string().nullable(),
      policy: yup.string().nullable(),
    }),
    checkOut: yup.object().shape({
      time: yup.string().nullable(),
      policy: yup.string().nullable(),
    }),
    cancellation: yup.object().shape({
      freeCancellation: yup.boolean(),
      freeCancellationHours: yup.string().nullable(),
      policy: yup.string().nullable(),
    }),
    petPolicy: yup.object().shape({
      allowed: yup.boolean(),
      fee: yup.string().nullable(),
      restrictions: yup.string().nullable(),
    }),
  }),

  // Arrays
  tags: yup.array().max(10, "Maximum 10 tags allowed").nullable(),

  amenities: yup.array().nullable(),
  features: yup.array().nullable(),
  includedItems: yup.array().nullable(),
  excludedItems: yup.array().nullable(),

  // Images - Minimum 4 images required
  images: yup
    .array()
    .min(4, "At least 4 images are required")
    .required("Images are required"),

  coverImage: yup.string().nullable(),

  // Status and Visibility
  status: yup.string().required(),
  isActive: yup.boolean(),
  isFeatured: yup.boolean(),
  isVerified: yup.boolean(),

  // SEO
  seo: yup.object().shape({
    metaTitle: yup.string().nullable(),
    metaDescription: yup.string().nullable(),
    keywords: yup.array().nullable(),
    canonicalUrl: yup
      .string()
      .url(
        "Please provide a valid canonical URL starting with http:// or https://"
      )
      .nullable(),
    ogTitle: yup.string().nullable(),
    ogDescription: yup.string().nullable(),
    twitterTitle: yup.string().nullable(),
  }),
});
