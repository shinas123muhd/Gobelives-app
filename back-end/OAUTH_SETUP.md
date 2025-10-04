# OAuth Authentication Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your application.

## Overview

The application now supports three authentication methods:

1. **Local Authentication** - Traditional email/password
2. **Google OAuth** - Sign in with Google
3. **Facebook OAuth** - Sign in with Facebook

Users can also link multiple authentication providers to their account.

## Prerequisites

Before you begin, you need to:

1. Create a Google OAuth application
2. Create a Facebook OAuth application

---

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
6. Choose **Web application** as the application type
7. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
8. Copy the **Client ID** and **Client Secret**

### Step 2: Add Google Credentials to .env

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Choose **Consumer** as the app type
4. Fill in the app details:
   - Display name: Your app name
   - App contact email: Your email
5. Once created, go to **Settings** > **Basic**
6. Copy the **App ID** and **App Secret**

### Step 2: Configure Facebook Login

1. In your app dashboard, click **Add Product**
2. Select **Facebook Login**
3. Choose **Web** as the platform
4. Add your site URL: `http://localhost:3000` (for development)
5. Go to **Facebook Login** > **Settings**
6. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:5000/api/auth/facebook/callback`
   - Production: `https://yourdomain.com/api/auth/facebook/callback`
7. Save changes

### Step 3: Add Facebook Credentials to .env

```env
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Google OAuth Login

```
GET /api/auth/google
```

Redirects user to Google OAuth consent screen.

#### 2. Google OAuth Callback

```
GET /api/auth/google/callback
```

Handles the callback from Google. Automatically creates or logs in the user.

#### 3. Facebook OAuth Login

```
GET /api/auth/facebook
```

Redirects user to Facebook OAuth consent screen.

#### 4. Facebook OAuth Callback

```
GET /api/auth/facebook/callback
```

Handles the callback from Facebook. Automatically creates or logs in the user.

### Account Management Endpoints

#### 5. Link OAuth Account

```
POST /api/auth/link-account
Authorization: Bearer <token>

Body:
{
  "provider": "google" | "facebook",
  "providerId": "string",
  "email": "string"
}
```

Links an OAuth provider to an existing user account.

#### 6. Get Connected Accounts

```
GET /api/auth/connected-accounts
Authorization: Bearer <token>
```

Returns all OAuth providers connected to the user's account.

#### 7. Unlink OAuth Account

```
DELETE /api/auth/unlink-account/:provider
Authorization: Bearer <token>
```

Removes the OAuth provider from the user's account (only if not the primary method).

---

## Frontend Integration

### Basic OAuth Flow

1. **Initiate OAuth**: Redirect user to the OAuth endpoint

   ```javascript
   // Google Login
   window.location.href = "http://localhost:5000/api/auth/google";

   // Facebook Login
   window.location.href = "http://localhost:5000/api/auth/facebook";
   ```

2. **Handle Callback**: The backend will handle the OAuth callback and send the JWT token back to the frontend. You can:
   - Return tokens in the response body
   - Set tokens in HTTP-only cookies
   - Redirect to frontend with tokens in URL parameters

### Example Frontend Button Components

```jsx
// GoogleLoginButton.jsx
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      <img src="/google-icon.png" alt="Google" />
      Continue with Google
    </button>
  );
};

// FacebookLoginButton.jsx
const FacebookLoginButton = () => {
  const handleFacebookLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  };

  return (
    <button onClick={handleFacebookLogin} className="facebook-login-btn">
      <img src="/facebook-icon.png" alt="Facebook" />
      Continue with Facebook
    </button>
  );
};
```

### Link Additional Accounts

```javascript
const linkGoogleAccount = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/link-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: "google",
          providerId: "google-user-id",
          email: "user@gmail.com",
        }),
      }
    );

    const data = await response.json();
    console.log("Account linked:", data);
  } catch (error) {
    console.error("Error linking account:", error);
  }
};
```

---

## User Model Changes

The User model now includes OAuth-related fields:

```javascript
{
  authProvider: 'local' | 'google' | 'facebook',  // Primary auth method
  googleId: String,                                // Google user ID
  facebookId: String,                              // Facebook user ID
  connectedAccounts: [{                            // All linked accounts
    provider: 'google' | 'facebook',
    providerId: String,
    email: String,
    connectedAt: Date
  }],
  password: String  // Optional (not required for OAuth users)
}
```

---

## Authentication Flow

### New User (First Time OAuth Login)

1. User clicks "Continue with Google/Facebook"
2. User is redirected to OAuth provider
3. User grants permissions
4. OAuth provider redirects back to callback URL
5. Backend creates new user account with OAuth details
6. Email is automatically verified (OAuth providers verify emails)
7. JWT tokens are generated and sent to frontend
8. User is logged in

### Existing User (OAuth Login)

1. User clicks "Continue with Google/Facebook"
2. Backend checks if OAuth ID exists in database
3. If found, user is logged in
4. If OAuth ID not found but email exists:
   - Account is automatically linked
   - User is logged in

### Account Linking

Users with local accounts can link OAuth providers:

1. User logs in with email/password
2. User goes to account settings
3. User clicks "Link Google" or "Link Facebook"
4. OAuth flow completes
5. OAuth provider is added to `connectedAccounts`

---

## Security Considerations

1. **Email Verification**: OAuth users have `isEmailVerified: true` by default since OAuth providers verify emails
2. **Account Takeover Prevention**: When linking accounts, the system checks if the OAuth account is already linked to another user
3. **Password Requirement**: OAuth users don't need passwords, but they can set one to enable local login
4. **Unlinking Restrictions**: Users cannot unlink their primary authentication method unless they have a password set

---

## Testing

### Test Google OAuth (Development)

1. Start your backend server: `npm run dev`
2. Navigate to: `http://localhost:5000/api/auth/google`
3. Complete Google OAuth flow
4. Check the response for JWT tokens

### Test Facebook OAuth (Development)

1. Start your backend server: `npm run dev`
2. Navigate to: `http://localhost:5000/api/auth/facebook`
3. Complete Facebook OAuth flow
4. Check the response for JWT tokens

---

## Troubleshooting

### Google OAuth Issues

**Error: redirect_uri_mismatch**

- Ensure the redirect URI in Google Console exactly matches the one in your `.env`
- Check for trailing slashes and http vs https

**Error: invalid_client**

- Verify your Client ID and Client Secret are correct
- Ensure you're using the correct credentials for your environment

### Facebook OAuth Issues

**Error: Can't Load URL**

- Ensure the redirect URI is added to Valid OAuth Redirect URIs in Facebook settings
- Check that your app is not in Development mode blocking external users

**Error: Email Not Provided**

- Ensure your Facebook app requests the `email` permission
- Some Facebook users may not have a public email

### General Issues

**Passport Not Initialized**

- Ensure `app.use(passport.initialize())` is in `server.js`
- Check that passport config is imported correctly

**User Not Created**

- Check database connection
- Verify User model has OAuth fields
- Check server logs for specific errors

---

## Production Deployment

1. Update OAuth callback URLs to production URLs
2. Update environment variables:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/auth/facebook/callback
   CLIENT_URL=https://yourdomain.com
   ```
3. Verify OAuth consent screens are published
4. Test OAuth flows in production environment

---

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Passport.js Documentation](http://www.passportjs.org/)
