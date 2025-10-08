# Review System Documentation

## Overview

The review system allows users to review properties and packages **only after completing their booking**. This ensures that only genuine customers who have experienced the service can leave reviews.

## Key Features

### 1. **Booking Verification**

- Users can only review bookings they own
- Bookings must be in `completed` or `checked_out` status
- One review per booking (enforced at database level)
- Reviews are automatically linked to their corresponding booking

### 2. **Review Model Enhancements**

- **Title**: Optional review title (max 100 characters)
- **Content**: Required review content (max 1000 characters)
- **Rating**: Required 1-5 star rating
- **Images**: Optional review images (up to 5)
- **Verified Status**: Automatically verified if booking is completed
- **Helpful Tracking**: Users can mark reviews as helpful
- **Admin Response**: Admins can respond to reviews
- **Edit History**: Tracks if review was edited

### 3. **Review Eligibility Check**

Before submitting a review, the system checks:

- ✅ User owns the booking
- ✅ Booking is completed/checked out
- ✅ No existing review for this booking
- ✅ Booking matches the property/package being reviewed

## API Endpoints

### Public Endpoints

#### Get Property Reviews

```
GET /api/reviews/property/:propertyId
```

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, default: "createdAt")
- `sortOrder` (string, "asc" or "desc", default: "desc")
- `rating` (number, filter by rating 1-5)

**Response:**

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "review_id",
        "title": "Amazing experience!",
        "content": "Had a wonderful time...",
        "rating": 5,
        "author": {
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://..."
        },
        "helpful": {
          "count": 12
        },
        "createdAt": "2025-01-15T10:30:00Z",
        "timeAgo": "2 days ago",
        "response": {
          "content": "Thank you for your feedback!",
          "respondedBy": {...},
          "respondedAt": "2025-01-16T09:00:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    },
    "ratingStats": {
      "averageRating": 4.5,
      "totalReviews": 45,
      "breakdown": {
        "5": 25,
        "4": 15,
        "3": 3,
        "2": 1,
        "1": 1
      }
    }
  }
}
```

#### Get Package Reviews

```
GET /api/reviews/package/:packageId
```

Same structure as property reviews.

#### Get Single Review

```
GET /api/reviews/:id
```

### Protected Endpoints (Require Authentication)

#### Check Review Eligibility

```
GET /api/reviews/can-review/:bookingId
Authorization: Bearer <token>
```

**Response (Can Review):**

```json
{
  "success": true,
  "data": {
    "canReview": true,
    "booking": {
      "_id": "booking_id",
      "bookingReference": "PKG-1234567890",
      "status": "completed"
    }
  }
}
```

**Response (Cannot Review):**

```json
{
  "success": true,
  "data": {
    "canReview": false,
    "reason": "Booking must be completed to leave a review"
  }
}
```

#### Create Review

```
POST /api/reviews
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```json
{
  "bookingId": "booking_id",
  "title": "Amazing experience!",
  "content": "Had a wonderful time on this tour...",
  "rating": 5,
  "images": [File, File] // Optional, max 5 images
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "review_id",
    "title": "Amazing experience!",
    "content": "Had a wonderful time...",
    "rating": 5,
    "author": {...},
    "isVerified": true,
    "status": "active"
  },
  "message": "Review created successfully"
}
```

#### Get My Reviews

```
GET /api/reviews/user/my-reviews
Authorization: Bearer <token>
```

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`

#### Update Review

```
PUT /api/reviews/:id
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "rating": 4
}
```

**Notes:**

- Only the author can update their review
- Changing rating will update property/package ratings
- Sets `isEdited: true` and `editedAt` timestamp

#### Delete Review

```
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

**Notes:**

- Only author or admin can delete
- Updates property/package ratings
- Resets booking's `hasReview` flag

#### Mark Review as Helpful

```
POST /api/reviews/:id/helpful
Authorization: Bearer <token>
```

#### Unmark Review as Helpful

```
DELETE /api/reviews/:id/helpful
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Reviews (Admin)

```
GET /api/reviews/admin/all
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `status` (active, pending, flagged, removed)
- `rating` (1-5)
- `search` (searches in title and content)

#### Add Admin Response

```
POST /api/reviews/:id/response
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "content": "Thank you for your feedback! We're glad you enjoyed..."
}
```

#### Update Review Status

```
PATCH /api/reviews/:id/status
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "status": "flagged" // active, pending, flagged, removed
}
```

### Property/Package Specific Endpoints

#### Add Review to Property

```
POST /api/properties/:id/reviews
Authorization: Bearer <token>
```

#### Get Property Reviews

```
GET /api/properties/:id/reviews
```

#### Add Review to Package

```
POST /api/packages/:id/reviews
Authorization: Bearer <token>
```

#### Get Package Reviews

```
GET /api/packages/:id/reviews
```

## Frontend Integration Guide

### 1. Check Review Eligibility

Before showing the review form, check if the user can review:

```javascript
const checkEligibility = async (bookingId) => {
  try {
    const response = await axios.get(`/api/reviews/can-review/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.data.canReview) {
      // Show review form
      setCanReview(true);
    } else {
      // Show message why they can't review
      setErrorMessage(response.data.data.reason);
    }
  } catch (error) {
    console.error("Error checking eligibility:", error);
  }
};
```

### 2. Display Reviews with Eligibility Status

When displaying a property/package, you can show:

- Existing reviews
- Whether the current user can add a review
- If they can't, why not (with the reason)

```javascript
const PropertyPage = () => {
  const [canReview, setCanReview] = useState(false);
  const [reason, setReason] = useState("");
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    // Fetch user's completed bookings for this property
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    // Get user's bookings for this property
    const bookings = await getUserBookingsForProperty(propertyId);

    // Filter completed bookings without reviews
    const eligibleBookings = bookings.filter(
      (b) => ["completed", "checked_out"].includes(b.status) && !b.hasReview
    );

    if (eligibleBookings.length > 0) {
      setCanReview(true);
      setUserBookings(eligibleBookings);
    } else {
      // Determine reason
      if (bookings.length === 0) {
        setReason(
          "You need to book and complete this experience to leave a review"
        );
      } else if (bookings.every((b) => b.hasReview)) {
        setReason("You have already reviewed this property");
      } else {
        setReason("Your booking must be completed to leave a review");
      }
    }
  };

  return (
    <div>
      {/* Property details */}

      {/* Reviews section */}
      <ReviewList propertyId={propertyId} />

      {/* Add review button/form */}
      {canReview ? (
        <ReviewForm bookings={userBookings} />
      ) : (
        <div className="review-blocked">
          <p>{reason}</p>
          {!bookings.length && (
            <button onClick={() => navigate("/booking")}>
              Book Now to Leave a Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};
```

### 3. Submit Review

```javascript
const submitReview = async (formData) => {
  try {
    const response = await axios.post("/api/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Review submitted successfully!");
    // Refresh reviews list
    fetchReviews();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to submit review");
  }
};
```

### 4. Display Review Status in Booking History

```javascript
const BookingCard = ({ booking }) => {
  return (
    <div className="booking-card">
      {/* Booking details */}

      {booking.status === "completed" && !booking.hasReview && (
        <button onClick={() => navigate(`/review/create/${booking._id}`)}>
          Leave a Review
        </button>
      )}

      {booking.hasReview && (
        <div className="review-submitted">
          <CheckIcon /> Review Submitted
          <button onClick={() => navigate(`/review/${booking.review}`)}>
            View Review
          </button>
        </div>
      )}
    </div>
  );
};
```

## Database Schema

### Review Model

```javascript
{
  title: String (optional, max 100 chars),
  content: String (required, max 1000 chars),
  rating: Number (required, 1-5),
  author: ObjectId (ref: User),
  booking: ObjectId (ref: Booking, required, unique),
  property: ObjectId (ref: Property),
  package: ObjectId (ref: Package),
  isVerified: Boolean (default: true),
  status: String (active|pending|flagged|removed),
  helpful: {
    count: Number,
    users: [ObjectId]
  },
  images: [{
    url: String,
    publicId: String,
    altText: String
  }],
  response: {
    content: String,
    respondedBy: ObjectId,
    respondedAt: Date
  },
  isEdited: Boolean,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- `{ author: 1, property: 1 }` - Unique, sparse
- `{ author: 1, package: 1 }` - Unique, sparse
- `{ booking: 1 }` - Unique (one review per booking)
- `{ property: 1, status: 1 }`
- `{ package: 1, status: 1 }`
- `{ rating: -1 }`
- `{ createdAt: -1 }`

## Business Logic

### Review Eligibility Rules

1. User must be authenticated
2. User must own the booking
3. Booking must be `completed` or `checked_out`
4. No existing review for this booking
5. Booking must match the property/package being reviewed

### Rating Updates

- When a review is created: Property/Package ratings are updated
- When a review is updated: Ratings are recalculated
- When a review is deleted: Ratings are recalculated

### Security Considerations

- Review content is validated and sanitized
- Image uploads are limited to 5 per review
- Users can only modify/delete their own reviews
- Admins can moderate any review
- Helpful marking prevents spam (one per user)

## Error Handling

Common error responses:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

**Common Error Codes:**

- `400`: Validation error or invalid data
- `401`: Not authenticated
- `403`: Not authorized (e.g., trying to review incomplete booking)
- `404`: Review, booking, property, or package not found
- `409`: Review already exists for this booking

## Best Practices

1. **Always check eligibility** before showing review form
2. **Display helpful error messages** explaining why users can't review
3. **Show review status** in booking history
4. **Allow editing** within a reasonable timeframe (consider adding time limit)
5. **Encourage reviews** after booking completion (email notifications)
6. **Display statistics** prominently (average rating, count, breakdown)
7. **Handle helpful marking** to highlight valuable reviews
8. **Moderate reviews** actively to maintain quality
