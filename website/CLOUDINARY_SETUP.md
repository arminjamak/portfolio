# Cloudinary Setup (Recommended Alternative to R2)

Cloudinary is a reliable image hosting service that handles large files (17MB+ GIFs) perfectly and provides automatic optimization.

## Required Environment Variables

Add these to your Netlify environment variables:

```bash
# Cloudinary credentials (from your Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Setup Steps

### 1. Create Free Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (25GB storage, 25GB bandwidth/month)
3. Note your Cloud Name, API Key, and API Secret from the dashboard

### 2. Create Upload Preset (Optional)
1. Go to Settings → Upload → Upload presets
2. Create a new preset named `portfolio_images`
3. Set it to "Unsigned" for easier uploads
4. Configure auto-optimization settings

### 3. Add Environment Variables to Netlify
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the three variables above

## Benefits

- ✅ **No size limits** (handles 17MB+ GIFs perfectly)
- ✅ **Automatic optimization** (WebP, AVIF, compression)
- ✅ **Global CDN** (fast loading worldwide)
- ✅ **Free tier** (25GB storage, 25GB bandwidth/month)
- ✅ **Reliable** (no SSL handshake issues like R2)
- ✅ **Easy setup** (just 3 environment variables)

## URL Format

Original: `https://res.cloudinary.com/your-cloud/image/upload/v123/portfolio/image-id.jpg`
Optimized: `https://res.cloudinary.com/your-cloud/image/upload/w_1200,q_auto,f_auto/v123/portfolio/image-id.jpg`

The system automatically uses the optimized URL for better performance.

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

This should be more than enough for a portfolio website!
