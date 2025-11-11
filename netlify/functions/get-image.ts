import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const imageId = url.searchParams.get('id');
  
  if (!imageId) {
    return new Response('Missing image ID', { status: 400 });
  }

  try {
    const store = getStore('portfolio-images');
    const blob = await store.get(imageId);
    
    if (!blob) {
      return new Response('Image not found', { status: 404 });
    }

    // Return the blob with appropriate headers
    return new Response(blob, {
      headers: {
        'Content-Type': 'image/png', // Default to PNG, could be dynamic
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
