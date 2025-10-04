# Booking System Documentation

## Overview

A comprehensive booking system for managing hotel, package, and property reservations with complete lifecycle management, payment tracking, and guest communication.

---

## Features

### ✅ Core Features

- **Multi-Type Bookings**: Hotels, packages, and properties
- **Guest Management**: Detailed guest information and preferences
- **Room Management**: Room type selection and availability tracking
- **Payment Processing**: Multiple payment methods and status tracking
- **Booking Lifecycle**: From pending to completion with full status history
- **Cancellation Management**: Smart refund calculations based on policies
- **Email Notifications**: Automated confirmation and cancellation emails
- **Review Integration**: Link bookings to guest reviews

### ✅ Advanced Features

- **Booking Reference System**: Unique reference codes (HTL-_, PKG-_, PROP-\*)
- **Status History**: Complete audit trail of status changes
- **Refund Management**: Automated refund calculation based on cancellation policy
- **Coupon/Discount**: Apply promotional codes to bookings
- **Special Requests**: Guest-specific requests and notes
- **Internal Notes**: Admin-only notes for booking management
- **Statistics & Analytics**: Comprehensive booking statistics
- **Multi-Currency Support**: USD, EUR, GBP, INR

---

## Database Schema

### Booking Model Fields

#### Core Information

```javascript
{
  bookingType: "hotel" | "package" | "property",
  hotel: ObjectId,           // Reference to Hotel
  package: ObjectId,         // Reference to Package
  property: ObjectId,        // Reference to Property
  user: ObjectId,            // Reference to User
  bookingReference: String   // Unique (e.g., HTL-1234567890-ABC12)
}
```

#### Date & Duration

```javascript
{
  checkIn: Date,
  checkOut: Date,
  duration: Number  // Calculated in days
}
```

#### Guest Information

```javascript
{
  guests: {
    adults: Number,
    children: Number,
    infants: Number,
    total: Number  // Auto-calculated
  },
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: { code: String, number: String },
    country: String,
    specialRequests: String
  }
}
```

#### Booking-Specific Details

**For Hotels:**

```javascript
{
  roomDetails: {
    roomType: String,
    roomNumber: String,
    numberOfRooms: Number,
    bedType: String,
    view: String
  }
}
```

**For Packages:**

```javascript
{
  packageDetails: {
    startTime: String,
    pickupLocation: String,
    dropoffLocation: String,
    selectedActivities: [String],
    language: String
  }
}
```

#### Pricing

```javascript
{
  pricing: {
    basePrice: Number,
    discount: Number,
    taxes: Number,
    serviceFee: Number,
    totalPrice: Number,
    currency: "USD" | "EUR" | "GBP" | "INR",
    paidAmount: Number,
    remainingAmount: Number  // Auto-calculated
  },
  appliedCoupon: {
    code: String,
    discountAmount: Number,
    discountPercentage: Number
  }
}
```

#### Payment Information

```javascript
{
  payment: {
    method: "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "cash" | "wallet",
    status: "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded",
    transactionId: String,
    paymentIntentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String
  }
}
```

#### Status Management

```javascript
{
  status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "completed" | "no_show",
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId,
    reason: String
  }]
}
```

#### Cancellation

```javascript
{
  cancellation: {
    isCancelled: Boolean,
    cancelledAt: Date,
    cancelledBy: ObjectId,
    cancellationReason: String,
    cancellationPolicy: String,
    refundEligible: Boolean,
    refundAmount: Number,
    refundStatus: "pending" | "approved" | "rejected" | "processed"
  }
}
```

#### Confirmation

```javascript
{
  confirmation: {
    isConfirmed: Boolean,
    confirmedAt: Date,
    confirmationCode: String,
    confirmationSent: Boolean
  }
}
```

---

## API Endpoints

### Public Endpoints

#### Get Booking by Reference

```
GET /api/bookings/reference/:reference?email=guest@example.com
```

- **Purpose**: Allow guests to view booking without login
- **Authentication**: Email verification required
- **Response**: Full booking details

### User Endpoints (Authenticated)

#### Create Booking

```
POST /api/bookings
Authorization: Bearer <token>

Body:
{
  "bookingType": "hotel",
  "hotelId": "...",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-05",
  "guests": {
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "guestDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": {
      "code": "+1",
      "number": "1234567890"
    }
  },
  "roomDetails": {
    "roomType": "Deluxe",
    "numberOfRooms": 1
  },
  "pricing": {
    "basePrice": 500,
    "taxes": 50,
    "totalPrice": 550,
    "currency": "USD"
  }
}
```

#### Get My Bookings

```
GET /api/bookings/user/my-bookings?type=upcoming
Authorization: Bearer <token>
```

- **Query Parameters**:
  - `type`: `upcoming` | `past` | `current`

#### Get Booking by ID

```
GET /api/bookings/:id
Authorization: Bearer <token>
```

#### Update Booking

```
PUT /api/bookings/:id
Authorization: Bearer <token>

Body:
{
  "checkIn": "2024-12-02",
  "checkOut": "2024-12-06",
  "notes": "Late check-in requested"
}
```

#### Cancel Booking

```
POST /api/bookings/:id/cancel
Authorization: Bearer <token>

Body:
{
  "reason": "Change of plans"
}
```

### Admin Endpoints

#### Get All Bookings

```
GET /api/bookings?page=1&limit=10&status=confirmed&bookingType=hotel
Authorization: Bearer <admin-token>
```

- **Query Parameters**:
  - `page`: Page number
  - `limit`: Results per page
  - `status`: Filter by status
  - `bookingType`: Filter by type
  - `startDate`: Filter from date
  - `endDate`: Filter to date
  - `userId`: Filter by user
  - `search`: Search by reference/guest name

#### Confirm Booking

```
POST /api/bookings/:id/confirm
Authorization: Bearer <admin-token>
```

#### Update Booking Status

```
PATCH /api/bookings/:id/status
Authorization: Bearer <admin-token>

Body:
{
  "status": "checked_in",
  "reason": "Guest arrived early"
}
```

#### Update Payment Status

```
PATCH /api/bookings/:id/payment
Authorization: Bearer <admin-token>

Body:
{
  "paymentStatus": "completed",
  "transactionId": "TXN123456",
  "paidAmount": 550,
  "paymentMethod": "credit_card"
}
```

#### Get Booking Statistics

```
GET /api/bookings/stats
Authorization: Bearer <admin-token>
```

#### Delete Booking

```
DELETE /api/bookings/:id
Authorization: Bearer <admin-token>
```

---

## Booking Workflow

### 1. Create Booking

```
User submits booking → Validate availability → Create booking (pending) → Send confirmation email
```

### 2. Payment Processing

```
Payment initiated → Update payment status → Confirm booking → Send booking confirmation
```

### 3. Check-in

```
Guest arrives → Admin updates status to checked_in
```

### 4. Check-out

```
Guest leaves → Admin updates status to checked_out → Booking completed
```

### 5. Cancellation

```
User requests cancellation → Calculate refund → Update status → Process refund → Send cancellation email
```

---

## Refund Policy (Default)

### Automatic Refund Calculation

```javascript
Hours Until Check-in    Refund Percentage
> 48 hours              100%
24-48 hours             50%
< 24 hours              0%
```

This is implemented in the `cancelBooking` controller and can be customized per hotel/package.

---

## Email Notifications

### Booking Confirmation

- **Sent**: After successful booking creation
- **Content**: Booking reference, dates, amount, details

### Booking Confirmed

- **Sent**: When admin confirms pending booking
- **Content**: Confirmation code, check-in details

### Cancellation Confirmation

- **Sent**: After booking cancellation
- **Content**: Cancellation confirmation, refund details

---

## Instance Methods

### `booking.cancelBooking(userId, reason)`

Cancel a booking with automatic status history update.

```javascript
await booking.cancelBooking(req.user._id, "Change of plans");
```

### `booking.confirmBooking(confirmationCode)`

Confirm a pending booking.

```javascript
await booking.confirmBooking();
```

### `booking.updateStatus(newStatus, changedBy, reason)`

Update booking status with audit trail.

```javascript
await booking.updateStatus("checked_in", adminId, "Guest arrived");
```

---

## Static Methods

### `Booking.findUpcoming(userId)`

Get user's upcoming bookings.

```javascript
const upcomingBookings = await Booking.findUpcoming(userId);
```

### `Booking.findPast(userId)`

Get user's past bookings.

```javascript
const pastBookings = await Booking.findPast(userId);
```

### `Booking.findCurrent(userId)`

Get user's current active bookings.

```javascript
const currentBookings = await Booking.findCurrent(userId);
```

### `Booking.getBookingStats()`

Get comprehensive booking statistics.

```javascript
const stats = await Booking.getBookingStats();
/*
Returns:
{
  totalBookings: 150,
  pendingBookings: 10,
  confirmedBookings: 80,
  completedBookings: 50,
  cancelledBookings: 10,
  totalRevenue: 75000,
  averageBookingValue: 500
}
*/
```

---

## Virtual Properties

### `numberOfNights`

Automatically calculated number of nights.

```javascript
booking.numberOfNights; // 4
```

### `isPast`, `isUpcoming`, `isCurrent`

Booking time status checks.

```javascript
booking.isPast; // true if checkout date passed
booking.isUpcoming; // true if checkin date in future
booking.isCurrent; // true if currently active
```

### `bookingRef`

Returns booking reference type and ID.

```javascript
booking.bookingRef; // { type: "Hotel", id: ObjectId }
```

---

## Integration Points

### With Hotel Model

- Check room availability before booking
- Update room availability on booking/cancellation
- Increment hotel analytics (bookings, revenue)

### With Package Model

- Check availability for dates
- Increment booking count
- Update popularity metrics

### With User Model

- Add booking to user's booking history
- Update totalBookings and totalSpent
- Track loyalty points (if applicable)

### With Review Model

- Link completed bookings to reviews
- Mark booking as reviewed

---

## Best Practices

1. **Always validate availability** before creating bookings
2. **Send email notifications** for all status changes
3. **Track status history** for audit purposes
4. **Calculate refunds automatically** based on cancellation policy
5. **Update hotel/package availability** immediately on booking/cancellation
6. **Use transactions** for critical operations (booking creation, cancellation)
7. **Implement idempotency** for payment operations
8. **Store metadata** (IP address, user agent) for security

---

## Security Considerations

1. **Authorization**: Users can only view/modify their own bookings
2. **Admin Actions**: Only admins can confirm, update status, manage payments
3. **Email Verification**: Required for public booking lookup
4. **Audit Trail**: Complete status history with timestamps and user IDs
5. **Data Privacy**: Sensitive payment data stored securely
6. **Rate Limiting**: Applied to booking creation to prevent abuse

---

## Future Enhancements

- [ ] Real-time availability checking
- [ ] Dynamic pricing based on demand
- [ ] Multi-room booking in single transaction
- [ ] Group booking support
- [ ] Booking modifications without cancellation
- [ ] Automatic reminders (check-in, check-out)
- [ ] Integration with payment gateways (Stripe, PayPal)
- [ ] Calendar view for bookings
- [ ] Waitlist functionality
- [ ] Loyalty points integration

---

**Last Updated**: October 4, 2025
**Version**: 1.0.0
