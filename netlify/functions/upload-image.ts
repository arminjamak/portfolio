// @ts-nocheck
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

    // Get Netlify Blobs store
    const store = getStore('portfolio-images');
    
    // Convert base64 data URL to buffer
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Netlify Blobs
    await store.set(imageId, buffer, {
      metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });
    
    // Generate the blob URL
    const blobUrl = `${process.env.URL}/.netlify/blobs/get/portfolio-images/${imageId}`;
    
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
