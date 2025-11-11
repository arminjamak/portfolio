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

    console.log(`[upload-to-r2] Uploading ${imageId} to Cloudflare R2...`);

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log(`[upload-to-r2] Buffer size: ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);

    // Upload to Cloudflare R2
    const r2Response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${process.env.CLOUDFLARE_R2_BUCKET}/objects/${imageId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_R2_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!r2Response.ok) {
      const errorText = await r2Response.text();
      console.error(`[upload-to-r2] R2 upload failed:`, errorText);
      return new Response(`R2 upload failed: ${errorText}`, { status: 500 });
    }

    console.log(`[upload-to-r2] ✅ Successfully uploaded to R2`);

    // Generate the public URL with Cloudflare Image Resizing
    const publicUrl = `https://${process.env.CLOUDFLARE_R2_DOMAIN}/${imageId}`;
    const resizedUrl = `https://${process.env.CLOUDFLARE_IMAGES_DOMAIN}/cdn-cgi/image/width=1200,quality=85,format=auto/${publicUrl}`;

    console.log(`[upload-to-r2] Generated URLs:`);
    console.log(`[upload-to-r2] - Original: ${publicUrl}`);
    console.log(`[upload-to-r2] - Resized: ${resizedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: publicUrl,
      resizedUrl: resizedUrl,
      url: resizedUrl, // Use resized as default
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[upload-to-r2] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
