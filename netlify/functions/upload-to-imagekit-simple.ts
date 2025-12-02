import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  console.log('[upload-to-imagekit-simple] Function started');
  
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[upload-to-imagekit-simple] JSON parse error:', parseError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { imageId, imageData } = body;
    
    if (!imageId || !imageData) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing imageId or imageData',
        received: { imageId: !!imageId, imageData: !!imageData }
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    
    if (!privateKey || !urlEndpoint) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing ImageKit credentials'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simple file size check
    if (imageData.length > 30000000) { // ~22MB base64 limit
      return new Response(JSON.stringify({
        success: false,
        error: 'File too large for upload'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[upload-to-imagekit-simple] Uploading ${imageId}`);

    // Simple fetch without FormData complications
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        file: imageData,
        fileName: `${imageId}.jpg`,
        folder: '/portfolio'
      })
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[upload-to-imagekit-simple] Upload failed:', errorText);
      return new Response(JSON.stringify({
        success: false,
        error: `Upload failed: ${errorText}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await uploadResponse.json();
    const optimizedUrl = `${urlEndpoint}/tr:w-1200,q-85,f-auto${result.filePath}`;

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: result.url,
      resizedUrl: optimizedUrl,
      url: optimizedUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[upload-to-imagekit-simple] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `Function error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
