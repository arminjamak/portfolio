# Cloudflare R2 + Image Resizing Setup

This project now uses Cloudflare R2 for image storage with automatic image resizing for optimal performance.

## Required Environment Variables

Add these to your Netlify environment variables:

```bash
# Cloudflare Account ID (found in Cloudflare dashboard)
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Cloudflare R2 Bucket Name
CLOUDFLARE_R2_BUCKET=portfolio-images

# Cloudflare R2 S3-compatible credentials (NOT API token)
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here

# Your R2 bucket's public domain (after setting up custom domain)
CLOUDFLARE_R2_DOMAIN=your-bucket.your-domain.com

# Your Cloudflare zone domain (for image resizing)
CLOUDFLARE_IMAGES_DOMAIN=your-domain.com
```

## Setup Steps

### 1. Create Cloudflare R2 Bucket
1. Go to Cloudflare Dashboard → R2 Object Storage
2. Create a new bucket named `portfolio-images`
3. Enable public access for the bucket

### 2. Create R2 S3-Compatible Credentials
1. Go to Cloudflare Dashboard → R2 Object Storage → Manage R2 API tokens
2. Create API token with R2 permissions
3. Copy the Access Key ID to `CLOUDFLARE_R2_ACCESS_KEY_ID`
4. Copy the Secret Access Key to `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

### 3. Set up Custom Domain (Optional but Recommended)
1. In R2 bucket settings, add a custom domain
2. Point it to your domain (e.g., `cdn.yourdomain.com`)
3. Update `CLOUDFLARE_R2_DOMAIN` with your custom domain

### 4. Enable Image Resizing
1. Go to Cloudflare Dashboard → Speed → Optimization
2. Enable "Image Resizing" (requires Pro plan or higher)
3. Or use Polish for basic optimization (available on free plan)

## How It Works

1. **Upload**: Images are uploaded to Cloudflare R2 bucket
2. **Resize**: Images are automatically resized using Cloudflare's Image Resizing
3. **Serve**: Images are served from Cloudflare's global CDN with optimal format (WebP, AVIF)
4. **Cache**: Images are cached globally for fast loading

## Benefits

- ✅ **No size limits** (unlike Netlify Functions)
- ✅ **Automatic image optimization** (WebP, AVIF, compression)
- ✅ **Global CDN** for fast loading worldwide
- ✅ **Handles large files** (17MB+ GIFs work perfectly)
- ✅ **Cost effective** (R2 is very cheap)
- ✅ **Automatic resizing** (width=1200, quality=85)

## URL Format

Original: `https://your-bucket.your-domain.com/image-id`
Resized: `https://your-domain.com/cdn-cgi/image/width=1200,quality=85,format=auto/https://your-bucket.your-domain.com/image-id`

The system automatically uses the resized URL for optimal performance.
