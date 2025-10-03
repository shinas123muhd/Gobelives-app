import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GoBelives API",
      version: "1.0.0",
      description: "A comprehensive travel and tourism platform API",
      contact: {
        name: "API Support",
        email: "support@gobelives.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "https://api.gobelives.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // User Schemas
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            firstName: {
              type: "string",
              description: "User first name",
              example: "John",
            },
            lastName: {
              type: "string",
              description: "User last name",
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "+1234567890",
            },
            avatar: {
              type: "string",
              description: "User avatar URL",
              example: "https://example.com/avatar.jpg",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "super_admin"],
              description: "User role",
              example: "user",
            },
            isActive: {
              type: "boolean",
              description: "Whether user account is active",
              example: true,
            },
            isEmailVerified: {
              type: "boolean",
              description: "Whether email is verified",
              example: false,
            },
            rewards: {
              type: "object",
              properties: {
                points: {
                  type: "number",
                  description: "User reward points",
                  example: 150,
                },
                tier: {
                  type: "string",
                  enum: ["bronze", "silver", "gold", "platinum"],
                  description: "User reward tier",
                  example: "silver",
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
          },
        },
        UserRegistration: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              description: "User first name",
              example: "John",
            },
            lastName: {
              type: "string",
              description: "User last name",
              example: "Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password",
              example: "password123",
            },
            phone: {
              type: "string",
              description: "User phone number",
              example: "+1234567890",
            },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
          },
        },

        // Property Schemas
        Property: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Property ID",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              description: "Property title",
              example: "Amazing City Tour",
            },
            description: {
              type: "string",
              description: "Property description",
              example: "Explore the beautiful city with our guided tour",
            },
            shortDescription: {
              type: "string",
              description: "Short property description",
              example: "Guided city tour",
            },
            location: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  example: "123 Main Street",
                },
                city: {
                  type: "string",
                  example: "New York",
                },
                state: {
                  type: "string",
                  example: "NY",
                },
                country: {
                  type: "string",
                  example: "USA",
                },
                coordinates: {
                  type: "object",
                  properties: {
                    latitude: {
                      type: "number",
                      example: 40.7128,
                    },
                    longitude: {
                      type: "number",
                      example: -74.006,
                    },
                  },
                },
              },
            },
            price: {
              type: "object",
              properties: {
                basePrice: {
                  type: "number",
                  description: "Base price in currency",
                  example: 100,
                },
                currency: {
                  type: "string",
                  enum: ["USD", "EUR", "GBP", "INR"],
                  example: "USD",
                },
              },
            },
            capacity: {
              type: "object",
              properties: {
                maxGuests: {
                  type: "number",
                  example: 20,
                },
                minGuests: {
                  type: "number",
                  example: 1,
                },
              },
            },
            duration: {
              type: "object",
              properties: {
                value: {
                  type: "number",
                  example: 4,
                },
                unit: {
                  type: "string",
                  enum: ["hours", "days", "weeks"],
                  example: "hours",
                },
              },
            },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    example: "https://example.com/image.jpg",
                  },
                  altText: {
                    type: "string",
                    example: "Tour image",
                  },
                  isPrimary: {
                    type: "boolean",
                    example: false,
                  },
                },
              },
            },
            coverImage: {
              type: "string",
              description: "Cover image URL",
              example: "https://example.com/cover.jpg",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "draft", "suspended"],
              example: "active",
            },
            featured: {
              type: "boolean",
              example: false,
            },
            ratings: {
              type: "object",
              properties: {
                average: {
                  type: "number",
                  minimum: 0,
                  maximum: 5,
                  example: 4.5,
                },
                count: {
                  type: "number",
                  example: 25,
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Category Schemas
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Category ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Category name",
              example: "Adventure Tours",
            },
            description: {
              type: "string",
              description: "Category description",
              example: "Exciting adventure and outdoor activities",
            },
            slug: {
              type: "string",
              description: "URL-friendly category name",
              example: "adventure-tours",
            },
            image: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  example: "https://example.com/category.jpg",
                },
                altText: {
                  type: "string",
                  example: "Adventure category",
                },
              },
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            featured: {
              type: "boolean",
              example: false,
            },
            packageCount: {
              type: "number",
              example: 15,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Package Schemas
        Package: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Package ID",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              description: "Package title",
              example: "Complete City Experience",
            },
            description: {
              type: "string",
              description: "Package description",
              example: "A comprehensive city tour package",
            },
            shortDescription: {
              type: "string",
              description: "Short package description",
              example: "City tour package",
            },
            location: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  example: "123 Main Street",
                },
                city: {
                  type: "string",
                  example: "Paris",
                },
                state: {
                  type: "string",
                  example: "Île-de-France",
                },
                country: {
                  type: "string",
                  example: "France",
                },
                coordinates: {
                  type: "object",
                  properties: {
                    latitude: {
                      type: "number",
                      example: 48.8566,
                    },
                    longitude: {
                      type: "number",
                      example: 2.3522,
                    },
                  },
                },
              },
            },
            price: {
              type: "object",
              properties: {
                basePrice: {
                  type: "number",
                  example: 299,
                },
                sellingPrice: {
                  type: "number",
                  example: 249,
                },
                currency: {
                  type: "string",
                  enum: ["USD", "EUR", "GBP", "INR"],
                  example: "EUR",
                },
                discount: {
                  type: "number",
                  minimum: 0,
                  maximum: 100,
                  example: 15,
                },
              },
            },
            capacity: {
              type: "object",
              properties: {
                maxGuests: {
                  type: "number",
                  example: 25,
                },
                minGuests: {
                  type: "number",
                  example: 2,
                },
                allowKids: {
                  type: "boolean",
                  example: true,
                },
              },
            },
            duration: {
              type: "object",
              properties: {
                value: {
                  type: "number",
                  example: 3,
                },
                unit: {
                  type: "string",
                  enum: ["hours", "days", "weeks"],
                  example: "days",
                },
              },
            },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    example: "https://example.com/package.jpg",
                  },
                  altText: {
                    type: "string",
                    example: "Package image",
                  },
                  isPrimary: {
                    type: "boolean",
                    example: false,
                  },
                },
              },
            },
            coverImage: {
              type: "string",
              example: "https://example.com/cover.jpg",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "draft", "suspended"],
              example: "active",
            },
            featured: {
              type: "boolean",
              example: true,
            },
            category: {
              type: "string",
              enum: [
                "tour",
                "activity",
                "experience",
                "attraction",
                "accommodation",
              ],
              example: "tour",
            },
            ratings: {
              type: "object",
              properties: {
                average: {
                  type: "number",
                  minimum: 0,
                  maximum: 5,
                  example: 4.8,
                },
                count: {
                  type: "number",
                  example: 42,
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Coupon Schemas
        Coupon: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Coupon ID",
              example: "507f1f77bcf86cd799439011",
            },
            code: {
              type: "string",
              description: "Coupon code",
              example: "SAVE20",
            },
            name: {
              type: "string",
              description: "Coupon name",
              example: "20% Off Summer Sale",
            },
            description: {
              type: "string",
              description: "Coupon description",
              example: "Get 20% off on all summer packages",
            },
            type: {
              type: "string",
              enum: ["percentage", "fixed"],
              description: "Discount type",
              example: "percentage",
            },
            value: {
              type: "number",
              description: "Discount value",
              example: 20,
            },
            minOrderAmount: {
              type: "number",
              description: "Minimum order amount",
              example: 100,
            },
            maxDiscountAmount: {
              type: "number",
              description: "Maximum discount amount",
              example: 50,
            },
            usageLimit: {
              type: "number",
              description: "Total usage limit",
              example: 100,
            },
            usedCount: {
              type: "number",
              description: "Number of times used",
              example: 25,
            },
            validFrom: {
              type: "string",
              format: "date-time",
              description: "Valid from date",
            },
            validUntil: {
              type: "string",
              format: "date-time",
              description: "Valid until date",
            },
            isActive: {
              type: "boolean",
              description: "Whether coupon is active",
              example: true,
            },
            isFeatured: {
              type: "boolean",
              description: "Whether coupon is featured",
              example: false,
            },
            applicablePackages: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Package IDs this coupon applies to",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Hotel Schemas
        Hotel: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Hotel ID",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "Hotel name",
              example: "Grand Palace Hotel",
            },
            description: {
              type: "string",
              description: "Hotel description",
              example: "Luxury hotel in the heart of the city",
            },
            location: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  example: "456 Hotel Avenue",
                },
                city: {
                  type: "string",
                  example: "London",
                },
                state: {
                  type: "string",
                  example: "England",
                },
                country: {
                  type: "string",
                  example: "UK",
                },
                coordinates: {
                  type: "object",
                  properties: {
                    latitude: {
                      type: "number",
                      example: 51.5074,
                    },
                    longitude: {
                      type: "number",
                      example: -0.1278,
                    },
                  },
                },
              },
            },
            amenities: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["WiFi", "Pool", "Gym", "Restaurant"],
            },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    example: "https://example.com/hotel.jpg",
                  },
                  altText: {
                    type: "string",
                    example: "Hotel lobby",
                  },
                },
              },
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
              example: 4.5,
            },
            priceRange: {
              type: "object",
              properties: {
                min: {
                  type: "number",
                  example: 150,
                },
                max: {
                  type: "number",
                  example: 500,
                },
                currency: {
                  type: "string",
                  example: "GBP",
                },
              },
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            isFeatured: {
              type: "boolean",
              example: false,
            },
            isVerified: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // Common Response Schemas
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },
                details: {
                  type: "string",
                  example: "Invalid input data",
                },
              },
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                type: "object",
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  example: 1,
                },
                limit: {
                  type: "number",
                  example: 10,
                },
                total: {
                  type: "number",
                  example: 100,
                },
                pages: {
                  type: "number",
                  example: 10,
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
