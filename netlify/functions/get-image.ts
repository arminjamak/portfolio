import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const imageId = url.searchParams.get('id');
  
  if (!imageId) {
    return new Response('Missing image ID', { status: 400 });
  }

  try {
    console.log(`[get-image] Retrieving image: ${imageId}`);
    const store = getStore('portfolio-images');
    const blob = await store.get(imageId);
    
    if (!blob) {
      console.log(`[get-image] Image not found: ${imageId}`);
      return new Response('Image not found', { status: 404 });
    }

    console.log(`[get-image] Found image: ${imageId}, size: ${blob instanceof ArrayBuffer ? blob.byteLength : 'unknown'}`);

    // Detect content type from the blob or default to a common image type
    let contentType = 'image/png';
    if (blob instanceof ArrayBuffer) {
      // Check magic bytes for image type detection
      const uint8Array = new Uint8Array(blob.slice(0, 4));
      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8) {
        contentType = 'image/jpeg';
      } else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50) {
        contentType = 'image/png';
      } else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49) {
        contentType = 'image/gif';
      }
    }

    console.log(`[get-image] Serving image with content-type: ${contentType}`);

    // Return the blob with appropriate headers
    return new Response(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
