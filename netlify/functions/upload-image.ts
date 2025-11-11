import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.text();
    const { imageData, imageId } = JSON.parse(body || '{}');
    
    if (!imageData || !imageId) {
      return new Response(JSON.stringify({ error: 'Missing imageData or imageId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[upload-image] Starting upload for ${imageId}`);
    console.log(`[upload-image] Environment check:`, {
      hasNetlifyToken: !!process.env.NETLIFY_FUNCTIONS_TOKEN,
      hasUrl: !!process.env.URL,
      url: process.env.URL
    });

    // Get Netlify Blobs store - try automatic configuration
    console.log(`[upload-image] Getting Netlify Blobs store...`);
    const store = getStore('portfolio-images');
    console.log(`[upload-image] ✅ Got store instance`);
    
    // Convert base64 data URL to buffer
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Netlify Blobs
    console.log(`[upload-image] Uploading buffer of size: ${buffer.length}`);
    await store.set(imageId, buffer.buffer, {
      metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });
    console.log(`[upload-image] Successfully uploaded to store`);
    
    // Generate the blob URL using the site URL
    const siteUrl = process.env.URL || 'https://armin.work';
    const blobUrl = `${siteUrl}/.netlify/blobs/get/portfolio-images/${imageId}`;
    
    console.log(`[upload-image] Uploaded image: ${imageId} (${(buffer.length / 1024).toFixed(0)}KB)`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      url: blobUrl,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
