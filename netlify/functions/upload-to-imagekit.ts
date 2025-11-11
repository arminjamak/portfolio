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

    // Only skip if it's clearly an IndexedDB reference (not valid base64)
    if (imageData.startsWith('indexeddb:')) {
      console.log(`[upload-to-imagekit] Skipping IndexedDB reference: ${imageData.substring(0, 50)}...`);
      return new Response(JSON.stringify({
        success: false,
        error: 'IndexedDB reference cannot be uploaded',
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate that it's a proper data URL
    if (!imageData.startsWith('data:image/')) {
      console.log(`[upload-to-imagekit] Invalid data URL format: ${imageData.substring(0, 50)}...`);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid data URL format',
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[upload-to-imagekit] Uploading ${imageId}...`);

    // Check required environment variables
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error('[upload-to-imagekit] Missing environment variables:', {
        publicKey: !!publicKey,
        privateKey: !!privateKey,
        urlEndpoint: !!urlEndpoint
      });
      return new Response('Missing ImageKit credentials', { status: 500 });
    }

    console.log(`[upload-to-imagekit] Processing image data...`);
    console.log(`[upload-to-imagekit] Image data preview:`, imageData.substring(0, 100) + '...');

    // Extract file extension from base64 data
    const mimeMatch = imageData.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
    const fileExtension = mimeMatch ? mimeMatch[1] : 'jpg';
    console.log(`[upload-to-imagekit] Detected file type: ${fileExtension}`);

    // Convert base64 to buffer for proper file upload
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Validate base64 data
    if (!base64Data || base64Data.length < 100) {
      console.log(`[upload-to-imagekit] Invalid or too short base64 data: ${base64Data.length} characters`);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid base64 data',
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    let buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
      console.log(`[upload-to-imagekit] Buffer created successfully: ${buffer.length} bytes`);
    } catch (error) {
      console.error(`[upload-to-imagekit] Failed to create buffer from base64:`, error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to process image data',
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Create form data for ImageKit upload
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: `image/${fileExtension}` }), `${imageId}.${fileExtension}`);
    formData.append('fileName', `${imageId}.${fileExtension}`);
    formData.append('folder', '/portfolio');
    formData.append('useUniqueFileName', 'false');
    
    // Create basic auth header
    const auth = Buffer.from(`${privateKey}:`).toString('base64');
    
    // Upload to ImageKit
    const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';
    
    console.log(`[upload-to-imagekit] Uploading to ImageKit...`);
    console.log(`[upload-to-imagekit] Form data entries:`);
    for (const [key, value] of formData.entries()) {
      if (key === 'file') {
        console.log(`[upload-to-imagekit] - ${key}: ${typeof value === 'string' ? value.substring(0, 50) + '...' : value}`);
      } else {
        console.log(`[upload-to-imagekit] - ${key}: ${value}`);
      }
    }
    
    let imagekitResponse;
    try {
      imagekitResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        body: formData,
      });
    } catch (fetchError) {
      console.error(`[upload-to-imagekit] Fetch error:`, fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Network error during upload',
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[upload-to-imagekit] Response status: ${imagekitResponse.status}`);
    console.log(`[upload-to-imagekit] Response headers:`, Object.fromEntries(imagekitResponse.headers.entries()));

    if (!imagekitResponse.ok) {
      const errorText = await imagekitResponse.text();
      console.error(`[upload-to-imagekit] Upload failed (${imagekitResponse.status}):`, errorText);
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText);
        console.error(`[upload-to-imagekit] Error details:`, errorJson);
      } catch (e) {
        console.error(`[upload-to-imagekit] Raw error:`, errorText);
      }
      
      // Return graceful failure instead of 500 error
      return new Response(JSON.stringify({
        success: false,
        error: `ImageKit upload failed: ${errorText}`,
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await imagekitResponse.json();
    console.log(`[upload-to-imagekit] ✅ Successfully uploaded to ImageKit`);

    // ImageKit provides automatic optimization through URL transformations
    const originalUrl = result.url;
    // Remove leading slash from filePath to avoid double slashes
    const cleanFilePath = result.filePath.startsWith('/') ? result.filePath.slice(1) : result.filePath;
    const optimizedUrl = `${urlEndpoint}/tr:w-1200,q-85,f-auto/${cleanFilePath}`;

    console.log(`[upload-to-imagekit] Generated URLs:`);
    console.log(`[upload-to-imagekit] - Original: ${originalUrl}`);
    console.log(`[upload-to-imagekit] - Optimized: ${optimizedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: originalUrl,
      resizedUrl: optimizedUrl,
      url: optimizedUrl, // Use optimized as default
      imagekit_result: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[upload-to-imagekit] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
