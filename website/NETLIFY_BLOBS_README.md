# Netlify Blobs Image Storage

This portfolio now uses **Netlify Blobs** for persistent image storage, ensuring that images uploaded in admin mode stay accessible across all sessions and deployments.

## How It Works

### 1. Image Upload in Admin Mode
- When you upload images in admin mode, they're initially stored in **IndexedDB** (browser storage)
- Images get `indexeddb:` references in the data structure

### 2. Automatic Upload on Logout
- When you logout from admin mode, the system automatically:
  1. **Finds all `indexeddb:` references** in your data
  2. **Uploads images to Netlify Blobs** via the `/upload-image` function
  3. **Replaces `indexeddb:` references** with permanent Netlify Blob URLs
  4. **Syncs to GitHub** with the new URLs

### 3. Persistent Storage
- Images are now stored on **Netlify's CDN** with URLs like:
  ```
  https://yoursite.netlify.app/.netlify/blobs/get/portfolio-images/image-id
  ```
- These URLs work across all deployments and sessions
- No more missing images when switching devices or clearing browser data

## Files Modified

### Core Functionality
- **`netlify/functions/upload-image.ts`** - Netlify function to upload images to Blobs
- **`src/polymet/data/sync-service.ts`** - Updated to handle Netlify Blobs upload
- **`src/polymet/components/admin-context.tsx`** - Updated logout to await async upload

### Key Functions
- `uploadImageToNetlifyBlobs()` - Uploads single image to Netlify Blobs
- `replaceIndexedDBReferences()` - Recursively finds and replaces `indexeddb:` refs
- `exportAllData()` - Now async, handles image upload before GitHub sync

## Usage

1. **Login to admin mode** and upload/edit images as usual
2. **Logout** - This triggers automatic upload to Netlify Blobs
3. **Images persist** across all future sessions and deployments

## Benefits

✅ **No more missing images** - Images are stored on Netlify's CDN  
✅ **Automatic process** - No manual steps required  
✅ **Fast loading** - Images served from Netlify's global CDN  
✅ **Version controlled** - Image URLs are stored in GitHub  
✅ **Cross-device sync** - Works on any device, any browser  

## Environment Requirements

- Netlify deployment (for Blobs storage)
- `@netlify/blobs` package installed
- Netlify Functions enabled
