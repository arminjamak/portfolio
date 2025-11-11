import { getStore } from '@netlify/blobs';

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { imageData, imageId } = JSON.parse(event.body || '{}');
    
    if (!imageData || !imageId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imageData or imageId' }),
      };
    }

    console.log(`[upload-image] Starting upload for ${imageId}`);
    console.log(`[upload-image] Environment check:`, {
      hasNetlifyToken: !!process.env.NETLIFY_FUNCTIONS_TOKEN,
      hasUrl: !!process.env.URL,
      url: process.env.URL
    });

    // Get Netlify Blobs store with manual configuration
    // Extract site ID from URL (armin.work -> site ID should be available in context)
    const siteId = event.headers['x-nf-site-id'] || process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_FUNCTIONS_TOKEN;
    
    console.log(`[upload-image] Site ID: ${siteId ? 'found' : 'missing'}`);
    console.log(`[upload-image] Token: ${token ? 'found' : 'missing'}`);
    
    if (!siteId || !token) {
      throw new Error(`Missing required config: siteId=${!!siteId}, token=${!!token}`);
    }
    
    const store = getStore({
      name: 'portfolio-images',
      siteID: siteId,
      token: token,
    });
    console.log(`[upload-image] Got store instance with manual config`);
    
    
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        imageId,
        url: blobUrl,
      }),
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
