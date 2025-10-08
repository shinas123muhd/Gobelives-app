# User Management API Documentation

## Overview

Complete user management system with authentication, role-based access control, rewards system, referrals, and comprehensive analytics.

---

## Authentication & Authorization

### Access Levels

- **Public**: No authentication required
- **Private**: Requires authentication (any logged-in user)
- **Admin**: Requires admin or super_admin role
- **Own Profile**: User can access their own data

---

## API Endpoints

### 1. User Management

#### Get All Users

```
GET /api/users
Access: Admin
```

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Items per page | 10 |
| sortBy | string | Sort field | createdAt |
| sortOrder | string | asc/desc | desc |
| role | string | Filter by role | - |
| isActive | boolean | Filter by status | - |
| tier | string | Filter by tier | - |
| search | string | Search by name/email | - |

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  },
  "message": "Users retrieved successfully",
  "success": true
}
```

---

#### Get Single User

```
GET /api/users/:id
Access: Admin
```

**Populated Fields:**

- bookings (reference, dates, status, pricing)
- favoriteProperties (name, location, price, images)
- referredBy (name, email)

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "rewards": {
      "points": 1250,
      "tier": "silver",
      "pointsHistory": [...],
      "redemptionHistory": [...]
    },
    "bookings": [...],
    "favoriteProperties": [...],
    ...
  },
  "message": "User retrieved successfully",
  "success": true
}
```

---

#### Get My Profile

```
GET /api/users/profile/me
Access: Private (authenticated user)
```

Returns current user's complete profile with bookings and favorites.

---

#### Update User

```
PUT /api/users/:id
Access: Admin or Own Profile
```

**Allowed Fields (All Users):**

- firstName, lastName, phone, avatar
- preferences, addresses

**Admin-Only Fields:**

- role, isActive, isEmailVerified

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "preferences": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    },
    "language": "en"
  }
}
```

---

#### Delete User

```
DELETE /api/users/:id
Access: Admin
```

**Protection:** Cannot delete super_admin accounts

---

### 2. Statistics & Analytics

#### Get User Statistics

```
GET /api/users/stats
Access: Admin
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "totalUsers": 1500,
    "activeUsers": 1350,
    "inactiveUsers": 150,
    "verifiedUsers": 1200,
    "unverifiedUsers": 300,
    "usersByRole": {
      "user": 1450,
      "admin": 45,
      "super_admin": 5
    },
    "usersByTier": {
      "bronze": 800,
      "silver": 500,
      "gold": 150,
      "platinum": 50
    },
    "recentUsers": [
      {
        "_id": "...",
        "firstName": "...",
        "lastName": "...",
        "email": "...",
        "createdAt": "...",
        "role": "user"
      }
    ],
    "topSpenders": [
      {
        "_id": "...",
        "firstName": "...",
        "lastName": "...",
        "email": "...",
        "totalSpent": 15000,
        "totalBookings": 12
      }
    ]
  },
  "message": "User statistics retrieved successfully",
  "success": true
}
```

---

### 3. Role & Status Management

#### Update User Role

```
PATCH /api/users/:id/role
Access: Admin (super_admin only for super_admin role)
```

**Request Body:**

```json
{
  "role": "admin"
}
```

**Valid Roles:** `user`, `admin`, `super_admin`

**Protection:** Only super_admin can assign super_admin role

---

#### Toggle User Status

```
PATCH /api/users/:id/toggle-status
Access: Admin
```

**Action:** Activates or deactivates user account

**Protection:** Cannot deactivate super_admin accounts

---

### 4. Bookings & Rewards

#### Get User Bookings

```
GET /api/users/:id/bookings
Access: Admin or Own Profile
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status |

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "bookings": [
      {
        "_id": "...",
        "bookingReference": "PKG-...",
        "checkIn": "2025-10-20",
        "checkOut": "2025-10-25",
        "status": "confirmed",
        "pricing": {...},
        "hotel": {...},
        "package": {...}
      }
    ],
    "pagination": {...}
  },
  "message": "User bookings retrieved successfully",
  "success": true
}
```

---

#### Get User Rewards

```
GET /api/users/:id/rewards
Access: Admin or Own Profile
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "points": 1250,
    "tier": "silver",
    "pointsHistory": [
      {
        "date": "2025-10-05",
        "points": 100,
        "reason": "booking",
        "bookingRef": {...}
      }
    ],
    "redemptionHistory": [
      {
        "date": "2025-09-15",
        "pointsUsed": 500,
        "reward": "Discount Coupon",
        "value": 50,
        "status": "processed"
      }
    ]
  },
  "message": "User rewards retrieved successfully",
  "success": true
}
```

---

#### Add Points to User

```
POST /api/users/:id/points
Access: Admin
```

**Request Body:**

```json
{
  "points": 100,
  "reason": "promotion"
}
```

**Valid Reasons:**

- `booking` - Points from booking
- `referral` - Points from referrals
- `review` - Points from reviews
- `promotion` - Promotional points
- `redemption` - Points redemption

**Auto-Updates:** Tier is automatically updated based on new point balance

---

### 5. Referral System

#### Get User by Referral Code

```
GET /api/users/referral/:code
Access: Public
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "referralCode": "ABC123XY",
    "rewards": {
      "tier": "silver"
    }
  },
  "message": "User found with referral code",
  "success": true
}
```

---

#### Get User's Referrals

```
GET /api/users/:id/referrals
Access: Admin or Own Profile
```

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "membershipSince": "2025-09-01",
      "totalBookings": 3,
      "rewards": {
        "tier": "bronze"
      }
    }
  ],
  "message": "User referrals retrieved successfully",
  "success": true
}
```

---

### 6. Bulk Operations

#### Bulk Update Users

```
PATCH /api/users/bulk-update
Access: Admin
```

**Request Body:**

```json
{
  "userIds": ["id1", "id2", "id3"],
  "updates": {
    "isActive": false,
    "role": "user"
  }
}
```

**Allowed Update Fields:**

- `isActive` - Boolean
- `role` - String (user/admin/super_admin)

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "acknowledged": true,
    "modifiedCount": 3,
    "matchedCount": 3
  },
  "message": "3 users updated successfully",
  "success": true
}
```

---

## User Model Schema

### Core Fields

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed, select: false),
  phone: String,
  avatar: String,
  role: "user" | "admin" | "super_admin",
  isActive: Boolean,
  isEmailVerified: Boolean
}
```

### OAuth Fields

```javascript
{
  authProvider: "local" | "google" | "facebook",
  googleId: String (unique, sparse),
  facebookId: String (unique, sparse),
  connectedAccounts: [
    {
      provider: "google" | "facebook",
      providerId: String,
      email: String,
      connectedAt: Date
    }
  ]
}
```

### Rewards System

```javascript
{
  rewards: {
    points: Number (min: 0),
    tier: "bronze" | "silver" | "gold" | "platinum",
    pointsHistory: [
      {
        date: Date,
        points: Number,
        reason: "booking" | "referral" | "review" | "promotion" | "redemption",
        bookingRef: ObjectId (ref: Booking)
      }
    ],
    redemptionHistory: [
      {
        date: Date,
        pointsUsed: Number,
        reward: String,
        value: Number,
        status: "pending" | "processed" | "cancelled"
      }
    ]
  }
}
```

### Tier Requirements

- **Bronze**: 0+ points
- **Silver**: 500+ points
- **Gold**: 1500+ points
- **Platinum**: 3000+ points

### Additional Fields

```javascript
{
  bookings: [ObjectId (ref: Booking)],
  totalBookings: Number,
  totalSpent: Number,
  favoriteProperties: [ObjectId (ref: Property)],
  recentlyViewed: [
    {
      property: ObjectId (ref: Property),
      viewedAt: Date
    }
  ],
  referralCode: String (unique, auto-generated),
  referredBy: ObjectId (ref: User),
  addresses: [
    {
      name: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      isDefault: Boolean
    }
  ],
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String
  }
}
```

### Virtual Fields

- `fullName` - Concatenated first and last name
- `nextTier` - Next tier user can achieve
- `pointsToNextTier` - Points needed for next tier

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid role",
  "success": false
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Not authorized to update this user",
  "success": false
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User not found",
  "success": false
}
```

---

## Security Features

1. **Password Hashing**: Bcrypt with salt rounds of 12
2. **Sensitive Data Exclusion**: Password and tokens never returned
3. **Role Protection**: Super admin operations restricted
4. **Authorization Checks**: Users can only access own data
5. **Sparse Unique Indexes**: OAuth IDs for multiple providers
6. **Rate Limiting**: Applied at server level
7. **Input Sanitization**: MongoDB injection prevention
8. **XSS Protection**: HTML/script sanitization

---

## Usage Examples

### Frontend Integration

#### Get All Users

```javascript
import { useUsers } from "@/hooks/useUser";

const UserList = () => {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    role: "user",
    search: "john",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.data.users.map((user) => (
        <div key={user._id}>{user.fullName}</div>
      ))}
    </div>
  );
};
```

#### Update User Role

```javascript
import { useUpdateUserRole } from "@/hooks/useUser";
import { toast } from "react-hot-toast";

const UpdateRole = ({ userId }) => {
  const updateRoleMutation = useUpdateUserRole();

  const handleRoleChange = async (newRole) => {
    try {
      await updateRoleMutation.mutateAsync({
        id: userId,
        role: newRole,
      });
      toast.success("Role updated successfully!");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  return (
    <select onChange={(e) => handleRoleChange(e.target.value)}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="super_admin">Super Admin</option>
    </select>
  );
};
```

#### Add Points

```javascript
import { useAddPointsToUser } from "@/hooks/useUser";

const AddPoints = ({ userId }) => {
  const addPointsMutation = useAddPointsToUser();

  const handleAddPoints = async () => {
    await addPointsMutation.mutateAsync({
      id: userId,
      points: 100,
      reason: "promotion",
    });
  };

  return <button onClick={handleAddPoints}>Add 100 Points</button>;
};
```

---

## Best Practices

1. **Always validate user input** on both client and server
2. **Use pagination** for large datasets
3. **Cache queries** appropriately based on data freshness needs
4. **Invalidate relevant queries** after mutations
5. **Handle errors gracefully** with user-friendly messages
6. **Protect sensitive operations** with proper authorization
7. **Log important actions** for audit trails
8. **Test role-based access** thoroughly
9. **Use optimistic updates** for better UX where appropriate
10. **Monitor query performance** and add indexes as needed

---

## Notes

- All dates are in ISO 8601 format
- All IDs are MongoDB ObjectId strings
- Pagination is 1-indexed (page 1 is first page)
- Sort order: "asc" (ascending) or "desc" (descending)
- Rewards tier is automatically updated when points change
- Referral codes are auto-generated on user creation
- Super admin accounts have special protections

