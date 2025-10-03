# GoBelives API Documentation

## Overview

The GoBelives API is a comprehensive travel and tourism platform that provides endpoints for managing users, properties, categories, packages, coupons, and hotels. This API is built with Node.js, Express, and MongoDB.

## API Documentation

The complete API documentation is available via Swagger UI at:

**Local Development:** http://localhost:5000/api-docs  
**Production:** https://api.gobelives.com/api-docs

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, password reset
- **Property Management**: CRUD operations for travel properties and experiences
- **Category Management**: Organize packages and properties by categories
- **Package Management**: Comprehensive package creation and management
- **Coupon System**: Discount coupons with validation and usage tracking
- **Hotel Management**: Hotel listings with reviews and ratings
- **File Upload**: Image upload support via Cloudinary
- **Search & Filtering**: Advanced search capabilities across all entities
- **Pagination**: Efficient data pagination for large datasets

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **user**: Regular users who can browse and book packages
- **admin**: Administrators who can manage content
- **super_admin**: Super administrators with full system access

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `PUT /reset-password` - Reset password with token
- `GET /verify-email` - Verify email address
- `POST /resend-verification` - Resend verification email
- `POST /refresh-token` - Refresh access token
- `GET /me` - Get current user profile (Protected)
- `PUT /update-profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)
- `POST /logout` - User logout (Protected)

### Categories (`/api/categories`)

- `POST /` - Create category (Admin)
- `GET /` - Get all categories (Admin)
- `GET /:id` - Get category by ID (Admin)
- `PUT /:id` - Update category (Admin)
- `DELETE /:id` - Delete category (Admin)
- `PATCH /:id/status` - Update category status (Admin)
- `PATCH /:id/featured` - Toggle featured status (Admin)
- `GET /stats` - Get category statistics (Admin)

### Categories (Public) (`/api/categories`)

- `GET /active` - Get active categories (Public)
- `GET /featured` - Get featured categories (Public)
- `GET /hierarchy` - Get category hierarchy (Public)
- `GET /search` - Search categories (Public)
- `GET /:id` - Get category by ID (Public)

### Packages (`/api/packages`)

- `POST /` - Create package (Admin)
- `GET /` - Get all packages (Admin)
- `GET /:id` - Get package by ID (Admin)
- `PUT /:id` - Update package (Admin)
- `DELETE /:id` - Delete package (Admin)
- `PATCH /:id/status` - Update package status (Admin)
- `PATCH /:id/featured` - Toggle featured status (Admin)
- `DELETE /:id/images/:imageId` - Delete package image (Admin)
- `GET /stats` - Get package statistics (Admin)

### Packages (Public) (`/api/packages`)

- `GET /featured` - Get featured packages (Public)
- `GET /category/:category` - Get packages by category (Public)
- `GET /search` - Search packages (Public)
- `GET /location` - Get packages by location (Public)
- `GET /:id` - Get package by ID (Public)

### Properties (`/api/properties`)

- `POST /` - Create property (Admin)
- `GET /` - Get all properties (Admin)
- `GET /:id` - Get property by ID (Admin)
- `PUT /:id` - Update property (Admin)
- `DELETE /:id` - Delete property (Admin)
- `PATCH /:id/status` - Update property status (Admin)
- `PATCH /:id/featured` - Toggle featured property (Admin)

### Coupons (`/api/coupons`)

- `GET /active` - Get active coupons (Public)
- `GET /search` - Search coupons (Public)
- `GET /code/:code` - Get coupon by code (Public)
- `GET /package/:packageId` - Get coupons for package (Public)
- `POST /:id/use` - Use coupon (Protected)
- `POST /:id/validate` - Validate coupon (Protected)
- `POST /` - Create coupon (Admin)
- `GET /` - Get all coupons (Admin)
- `GET /:id` - Get coupon by ID (Admin)
- `PUT /:id` - Update coupon (Admin)
- `DELETE /:id` - Delete coupon (Admin)
- `PATCH /:id/status` - Update coupon status (Admin)
- `PATCH /:id/active` - Toggle coupon active status (Admin)
- `PATCH /:id/featured` - Toggle coupon featured status (Admin)
- `GET /stats` - Get coupon statistics (Admin)
- `GET /expiring` - Get expiring coupons (Admin)

### Hotels (`/api/hotels`)

- `GET /active` - Get active hotels (Public)
- `GET /featured` - Get featured hotels (Public)
- `GET /search` - Search hotels (Public)
- `GET /location/:location` - Get hotels by location (Public)
- `GET /nearby` - Get nearby hotels (Public)
- `POST /:id/view` - Increment hotel views (Public)
- `POST /:id/reviews` - Add hotel review (Protected)
- `PUT /:id/reviews` - Update hotel review (Protected)
- `DELETE /:id/reviews` - Remove hotel review (Protected)
- `POST /` - Create hotel (Admin)
- `GET /` - Get all hotels (Admin)
- `GET /:id` - Get hotel by ID (Admin)
- `PUT /:id` - Update hotel (Admin)
- `DELETE /:id` - Delete hotel (Admin)
- `PATCH /:id/status` - Update hotel status (Admin)
- `PATCH /:id/active` - Toggle hotel active status (Admin)
- `PATCH /:id/featured` - Toggle hotel featured status (Admin)
- `PATCH /:id/verify` - Toggle hotel verified status (Admin)
- `PATCH /:id/rooms` - Update hotel rooms (Admin)
- `DELETE /:id/images/:imageId` - Delete hotel image (Admin)
- `GET /stats` - Get hotel statistics (Admin)

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per 10-minute window per IP address
- Rate limit headers are included in responses

## File Upload

The API supports file uploads for images using multipart/form-data:

- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF, WebP
- Images are automatically processed and stored via Cloudinary

## Search and Filtering

Most list endpoints support:

- **Pagination**: `page`, `limit` parameters
- **Search**: `q` parameter for text search
- **Filtering**: Various filter parameters specific to each endpoint
- **Sorting**: `sort` parameter with field names

## Environment Variables

Required environment variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gobelives
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=90d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:3000
```

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Copy `.env-template.txt` to `.env` and fill in your values

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access API Documentation**
   Visit http://localhost:5000/api-docs

## Testing

The API includes comprehensive test coverage:

```bash
npm test
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation for API changes
4. Use meaningful commit messages

## Support

For API support and questions:

- Email: support@gobelives.com
- Documentation: http://localhost:5000/api-docs

## License

This project is licensed under the MIT License.
