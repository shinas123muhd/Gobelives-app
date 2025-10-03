# Vercel Deployment Guide for GoBelives Backend

## Prerequisites

- Vercel account
- MongoDB Atlas account
- Cloudinary account (for image uploads)

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Configure Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

### Required Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-here
JWT_REFRESH_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

## Step 4: Deploy to Vercel

```bash
# From the project root directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: gobelives-backend (or your preferred name)
# - Directory: ./back-end
# - Override settings? No
```

## Step 5: Update CORS Settings

After deployment, update your `CLIENT_URL` environment variable in Vercel to match your frontend domain.

## Step 6: Test Your Deployment

Your API will be available at:

- `https://your-project-name.vercel.app/api/health`
- `https://your-project-name.vercel.app/api-docs`

## Important Notes:

### Limitations on Vercel:

1. **Function Timeout**: 10 seconds (Hobby), 60 seconds (Pro)
2. **No File Storage**: Use Cloudinary for image uploads
3. **Cold Starts**: First request may be slower
4. **Database Connections**: Use connection pooling

### Recommended Optimizations:

1. **Database Connection**: Use MongoDB Atlas with connection pooling
2. **Image Uploads**: Configure Cloudinary properly
3. **Caching**: Implement Redis for session management
4. **Rate Limiting**: Adjust for serverless environment

### Alternative Deployment Options:

If you need more control, consider:

- **Railway**: https://railway.app
- **Render**: https://render.com
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
- **AWS Lambda**: https://aws.amazon.com/lambda/

## Troubleshooting:

### Common Issues:

1. **Database Connection Timeout**: Increase MongoDB Atlas connection timeout
2. **Function Timeout**: Optimize database queries
3. **CORS Issues**: Update CLIENT_URL environment variable
4. **Image Upload Issues**: Verify Cloudinary configuration

### Debug Commands:

```bash
# Check deployment logs
vercel logs

# Check function logs
vercel logs --follow

# Redeploy
vercel --prod
```

## Production Checklist:

- [ ] Environment variables configured
- [ ] MongoDB Atlas whitelist includes Vercel IPs
- [ ] Cloudinary configured for image uploads
- [ ] CORS settings updated for production domain
- [ ] JWT secrets are secure and unique
- [ ] Email service configured
- [ ] Rate limiting adjusted for production
- [ ] Error handling tested
- [ ] API documentation accessible
- [ ] Health check endpoint working

## Monitoring:

- Use Vercel Analytics to monitor performance
- Set up error tracking with Sentry
- Monitor database performance in MongoDB Atlas
- Track API usage and errors
