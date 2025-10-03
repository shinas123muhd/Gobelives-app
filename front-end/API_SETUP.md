# API Setup Documentation

## Overview

This project now uses Axios for HTTP requests and React Query for state management and caching.

## Configuration

### Base URL

- **Development**: `http://localhost:5000/`
- **Production**: Set `NEXT_PUBLIC_API_BASE_URL` environment variable

### Dependencies Installed

- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching
- `@tanstack/react-query-devtools` - Development tools

## File Structure

```
src/
├── lib/
│   └── axios.js              # Axios configuration
├── services/
│   └── authService.js        # Authentication API calls
├── hooks/
│   └── useAuth.js           # React Query hooks for auth
├── providers/
│   └── QueryProvider.jsx    # React Query provider
└── contexts/
    └── AuthContext.jsx      # Updated to work with React Query
```

## Features

### Axios Configuration

- **Base URL**: Configurable via environment variables
- **Request Interceptor**: Automatically adds auth token to requests
- **Response Interceptor**: Handles 401 errors and redirects to login
- **Timeout**: 10 seconds for all requests

### React Query Features

- **Caching**: Automatic caching of API responses
- **Background Refetching**: Keeps data fresh
- **Error Handling**: Built-in retry logic
- **Loading States**: Easy loading state management
- **DevTools**: Available in development mode

### Authentication Hooks

- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useProfile()` - Get user profile
- `useVerifyToken()` - Verify authentication token
- `useRefreshToken()` - Refresh expired tokens

## Usage Examples

### Login

```jsx
import { useLogin } from "../hooks/useAuth";

const loginMutation = useLogin();

const handleLogin = async (credentials) => {
  try {
    const result = await loginMutation.mutateAsync(credentials);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Get User Profile

```jsx
import { useProfile } from "../hooks/useAuth";

const { data: profile, isLoading, error } = useProfile();
```

## Environment Variables

Create a `.env.local` file in the front-end directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NODE_ENV=development
```

## Backend Integration

The frontend now expects the backend API to be running on `http://localhost:5000` with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verify token

## Development Tools

React Query DevTools are available in development mode. They provide:

- Query inspection
- Cache visualization
- Performance monitoring
- Debugging tools

Access them by opening the browser dev tools and looking for the React Query tab.
