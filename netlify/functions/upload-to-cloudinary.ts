import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { imageId, imageData } = await request.json();
    
    if (!imageId || !imageData) {
      return new Response('Missing imageId or imageData', { status: 400 });
    }

    console.log(`[upload-to-cloudinary] Uploading ${imageId}...`);

    // Check required environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[upload-to-cloudinary] Missing environment variables:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      });
      return new Response('Missing Cloudinary credentials', { status: 500 });
    }

    // Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('upload_preset', 'portfolio_images'); // We'll create this preset
    formData.append('public_id', imageId);
    formData.append('folder', 'portfolio');
    
    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    console.log(`[upload-to-cloudinary] Uploading to: ${uploadUrl}`);
    
    const cloudinaryResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error(`[upload-to-cloudinary] Upload failed (${cloudinaryResponse.status}):`, errorText);
      return new Response(`Cloudinary upload failed: ${errorText}`, { status: 500 });
    }

    const result = await cloudinaryResponse.json();
    console.log(`[upload-to-cloudinary] ✅ Successfully uploaded to Cloudinary`);

    // Cloudinary automatically provides optimized URLs
    const originalUrl = result.secure_url;
    const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');

    console.log(`[upload-to-cloudinary] Generated URLs:`);
    console.log(`[upload-to-cloudinary] - Original: ${originalUrl}`);
    console.log(`[upload-to-cloudinary] - Optimized: ${optimizedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: originalUrl,
      resizedUrl: optimizedUrl,
      url: optimizedUrl, // Use optimized as default
      cloudinary_result: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[upload-to-cloudinary] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
