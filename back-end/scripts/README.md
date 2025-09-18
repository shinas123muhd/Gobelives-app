# Admin User Creation Scripts

This directory contains scripts to create admin users for the GoBelives application.

## Available Scripts

### 1. Quick Admin Creation (`createAdmin.js`)

Creates an admin user with default credentials.

**Default Credentials:**

- Email: `admin@gobelives.com`
- Password: `Admin123!@#`
- Role: `admin`

**Usage:**

```bash
npm run create-admin
```

### 2. Interactive Admin Creation (`createAdminInteractive.js`)

Creates an admin user with custom credentials through interactive prompts.

**Usage:**

```bash
npm run create-admin-interactive
```

### 3. Windows Batch File (`createAdmin.bat`)

Windows batch file for easy execution.

**Usage:**
Double-click the `createAdmin.bat` file or run it from command prompt.

## Prerequisites

1. Make sure your MongoDB database is running
2. Ensure your `.env` file is properly configured with `MONGODB_URI`
3. Install dependencies: `npm install`

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/gobelives
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Features

- ✅ Checks for existing admin users to prevent duplicates
- ✅ Creates user with admin role and verified email
- ✅ Sets up default preferences
- ✅ Provides clear feedback and credentials
- ✅ Handles errors gracefully

## Security Notes

- Change the default password after first login
- The admin user is created with email verification set to `true`
- The user is set as active by default
- Password is hashed using bcrypt before storage

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **User Already Exists**: The script will inform you if an admin user already exists
3. **Validation Errors**: Check that email format is valid and password meets requirements

## Login

After running the script, you can login using the provided credentials at your login endpoint:

```
POST /api/auth/login
{
  "email": "admin@gobelives.com",
  "password": "Admin123!@#"
}
```
