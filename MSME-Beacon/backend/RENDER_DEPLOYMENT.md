# MSME Beacon Backend - Render Deployment Guide

## Environment Variables Required in Render Dashboard

**CRITICAL:** You MUST set these environment variables in your Render service dashboard:

### Required Environment Variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://adimsme:msme000@msme.bvlwyvs.mongodb.net/msme_beacon?retryWrites=true&w=majority&appName=msme

# Server Configuration  
PORT=10000
NODE_ENV=production

# JWT Security
JWT_SECRET=msme_beacon_production_secret_key_2024_secure
JWT_EXPIRE=30d

# ML Service Integration
ML_SERVICE_URL=https://msme-ml-service.onrender.com

# Frontend CORS
FRONTEND_URL=https://msme-survival-predictor.vercel.app
```

## How to Set Environment Variables in Render:

1. Go to your Render service dashboard
2. Click on "Environment" tab
3. Add each variable name and value from above
4. Click "Save Changes"
5. Redeploy your service

## Critical Notes:

- **Database Name**: The MongoDB URI MUST include `/msme_beacon` to use the correct database
- **Port**: Render will automatically set PORT=10000, but include it in env vars for consistency
- **JWT Secret**: Use a strong, unique secret key for production
- **ML Service**: Update this URL after your ML service is deployed

## Troubleshooting:

If you see `Database: test` in logs instead of `Database: msme_beacon`:
1. Check your MONGODB_URI includes `/msme_beacon` 
2. Verify all environment variables are set in Render dashboard
3. Redeploy the service
4. Check logs for connection confirmation

## Expected Success Logs:

```
✅ MongoDB Atlas Connected Successfully!
📊 Database: msme_beacon
🔗 Connection State: Connected
```

## Deployment Commands:

**Build Command:** `./render_build.sh`
**Start Command:** `./render_start.sh`

Both scripts are already configured in the repository. 