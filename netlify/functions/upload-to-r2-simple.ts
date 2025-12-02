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

    console.log(`[upload-to-r2-simple] Uploading ${imageId} to Cloudflare R2...`);

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log(`[upload-to-r2-simple] Buffer size: ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);

    // For now, let's just return a mock successful response to test the flow
    // We'll implement actual R2 upload once we confirm the flow works
    console.log(`[upload-to-r2-simple] ✅ Mock upload successful`);

    // Generate mock URLs for testing
    const mockPublicUrl = `https://pub-12345.r2.dev/${imageId}`;
    const mockResizedUrl = `https://imagedelivery.net/abc123/cdn-cgi/image/width=1200,quality=85,format=auto/${mockPublicUrl}`;

    console.log(`[upload-to-r2-simple] Generated URLs:`);
    console.log(`[upload-to-r2-simple] - Original: ${mockPublicUrl}`);
    console.log(`[upload-to-r2-simple] - Resized: ${mockResizedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: mockPublicUrl,
      resizedUrl: mockResizedUrl,
      url: mockResizedUrl, // Use resized as default
      mock: true, // Indicate this is a mock response
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[upload-to-r2-simple] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
