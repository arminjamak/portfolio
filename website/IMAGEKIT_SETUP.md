# ImageKit.io Setup - Best Image Storage & Optimization

ImageKit.io is an excellent image hosting service with powerful optimization, CDN, and transformation features. Perfect for handling large files like 17MB GIFs.

## Required Environment Variables

Add these to your Netlify environment variables:

```bash
# ImageKit credentials (from your ImageKit dashboard)
IMAGEKIT_PUBLIC_KEY=public_your_public_key_here
IMAGEKIT_PRIVATE_KEY=private_your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

## Setup Steps

### 1. Create Free ImageKit Account
1. Go to [imagekit.io](https://imagekit.io)
2. Sign up for a free account (20GB storage, 20GB bandwidth/month)
3. Complete the onboarding process

### 2. Get Your Credentials
1. Go to Developer → API Keys in your ImageKit dashboard
2. Copy your:
   - **Public Key** → `IMAGEKIT_PUBLIC_KEY`
   - **Private Key** → `IMAGEKIT_PRIVATE_KEY`
   - **URL Endpoint** → `IMAGEKIT_URL_ENDPOINT`

### 3. Add Environment Variables to Netlify
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the three variables above

### 4. Optional: Configure Upload Settings
1. Go to Settings → Upload in ImageKit dashboard
2. Set default folder to `/portfolio`
3. Configure auto-optimization settings

## Benefits

- ✅ **No size limits** (handles 17MB+ GIFs perfectly)
- ✅ **Real-time image optimization** (WebP, AVIF, compression)
- ✅ **Global CDN** (fast loading worldwide)
- ✅ **Free tier** (20GB storage, 20GB bandwidth/month)
- ✅ **Advanced transformations** (resize, crop, effects)
- ✅ **Easy setup** (just 3 environment variables)
- ✅ **Reliable** (enterprise-grade infrastructure)

## URL Transformations

ImageKit provides powerful URL-based transformations:

**Original**: `https://ik.imagekit.io/your_id/portfolio/image.jpg`

**Optimized**: `https://ik.imagekit.io/your_id/tr:w-1200,q-85,f-auto/portfolio/image.jpg`

**Custom transformations**:
- `tr:w-800,h-600` - Resize to 800x600
- `tr:q-80` - Set quality to 80%
- `tr:f-webp` - Convert to WebP
- `tr:e-blur:10` - Apply blur effect

## Free Tier Limits

- **Storage**: 20GB
- **Bandwidth**: 20GB/month
- **Transformations**: Unlimited
- **Requests**: 100,000/month

Perfect for portfolio websites with room to grow!

## Advanced Features

- **Smart cropping** - AI-powered cropping
- **Background removal** - Automatic background removal
- **Video optimization** - Also handles videos
- **Analytics** - Detailed usage analytics
- **Webhooks** - Real-time notifications
