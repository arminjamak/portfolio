# Image Storage System

## Overview

This portfolio uses **Netlify Blobs** to store full-resolution images uploaded via admin mode. Images are automatically uploaded to Netlify's blob storage when you logout from admin mode.

## How It Works

### 1. Upload Images in Admin Mode
- Login to admin mode
- Upload images (up to 20MB each) to projects
- Images are temporarily stored in browser's IndexedDB

### 2. Automatic Sync on Logout
When you logout from admin mode:
1. All images are extracted from IndexedDB
2. Each image is uploaded to **Netlify Blobs** (full resolution, no compression)
3. Netlify Blobs returns a permanent URL for each image
4. The `data.json` file is updated with these Netlify Blob URLs
5. Everything is synced to GitHub
6. Netlify automatically rebuilds the site

### 3. Images Available Everywhere
- Images are stored on Netlify's CDN
- Available in all browsers and sessions
- No size limits (Netlify Blobs handles large files)
- Fast loading from CDN

## Technical Details

### Netlify Function
- **Function**: `/netlify/functions/upload-image.ts`
- **Purpose**: Uploads images to Netlify Blobs
- **Store Name**: `portfolio-images`
- **Returns**: Permanent blob URL

### Data Flow
```
Admin Upload → IndexedDB → Logout Trigger → 
→ Extract from IndexedDB → Upload to Netlify Blobs → 
→ Get Blob URL → Update data.json → Push to GitHub → 
→ Netlify Rebuild → Images Available Everywhere
```

### File Structure
- **Images**: Stored in Netlify Blobs (`portfolio-images` store)
- **Metadata**: Stored in `public/data.json` with blob URLs
- **Fallback**: IndexedDB still used for local editing before sync

## Benefits

✅ **Full Resolution**: No compression, images stored at original quality
✅ **No Size Limits**: Netlify Blobs handles large files (20MB+)
✅ **CDN Delivery**: Fast loading from Netlify's global CDN
✅ **Persistent**: Images available across all browsers and sessions
✅ **Automatic**: Upload happens automatically on admin logout
✅ **Version Control**: Image URLs tracked in Git

## Environment Variables

Make sure these are set in Netlify:
- `GITHUB_TOKEN`: For syncing to GitHub
- `GITHUB_REPO`: Repository name (default: `arminjamak/portfolio`)
- `URL`: Netlify site URL (automatically set)

## Troubleshooting

### Images Not Showing After Logout
1. Check browser console for upload errors
2. Verify Netlify function logs
3. Ensure you're on the deployed site (not localhost)

### Upload Fails
1. Check Netlify Blobs is enabled for your site
2. Verify the site is deployed (Blobs only work in production)
3. Check function logs in Netlify dashboard

## Local Development

**Note**: Netlify Blobs only work in production. In local development:
- Images stay in IndexedDB
- Upload function will fail (expected)
- Images will be uploaded when you deploy and logout on the live site
