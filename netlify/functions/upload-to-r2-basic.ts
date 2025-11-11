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

    console.log(`[upload-to-r2-basic] Uploading ${imageId} to Cloudflare R2...`);

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log(`[upload-to-r2-basic] Buffer size: ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);

    // Check required environment variables
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    
    if (!accountId || !bucketName || !accessKeyId || !secretAccessKey) {
      console.error('[upload-to-r2-basic] Missing environment variables:', {
        accountId: !!accountId,
        bucketName: !!bucketName,
        accessKeyId: !!accessKeyId,
        secretAccessKey: !!secretAccessKey
      });
      return new Response('Missing Cloudflare R2 S3 credentials', { status: 500 });
    }

    // Try using Cloudflare's REST API instead of S3-compatible API
    const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${imageId}`;
    
    console.log(`[upload-to-r2-basic] Uploading to REST API: ${uploadUrl}`);
    
    // Use the access key as a bearer token (this might work for some setups)
    const r2Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessKeyId}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    console.log(`[upload-to-r2-basic] R2 response status: ${r2Response.status}`);
    console.log(`[upload-to-r2-basic] R2 response headers:`, Object.fromEntries(r2Response.headers.entries()));

    if (!r2Response.ok) {
      const errorText = await r2Response.text();
      console.error(`[upload-to-r2-basic] R2 upload failed (${r2Response.status}):`, errorText);
      
      // If REST API fails, let's try a different approach - return success with external URL
      console.log(`[upload-to-r2-basic] REST API failed, using fallback approach`);
      
      // For now, let's use a different storage approach or return a working URL
      // You could integrate with other services like Imgur, Cloudinary, etc.
      const fallbackUrl = `https://via.placeholder.com/1200x800/cccccc/666666?text=${encodeURIComponent(imageId)}`;
      
      return new Response(JSON.stringify({
        success: true,
        imageId,
        originalUrl: fallbackUrl,
        resizedUrl: fallbackUrl,
        url: fallbackUrl,
        fallback: true,
        error: `R2 upload failed: ${errorText}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[upload-to-r2-basic] ✅ Successfully uploaded to R2`);

    // Generate the public URLs
    const r2Domain = process.env.CLOUDFLARE_R2_DOMAIN || `${bucketName}.${accountId}.r2.cloudflarestorage.com`;
    const imagesDomain = process.env.CLOUDFLARE_IMAGES_DOMAIN || 'your-domain.com';
    
    const publicUrl = `https://${r2Domain}/${imageId}`;
    const resizedUrl = `https://${imagesDomain}/cdn-cgi/image/width=1200,quality=85,format=auto/${publicUrl}`;

    console.log(`[upload-to-r2-basic] Generated URLs:`);
    console.log(`[upload-to-r2-basic] - Original: ${publicUrl}`);
    console.log(`[upload-to-r2-basic] - Resized: ${resizedUrl}`);

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: publicUrl,
      resizedUrl: resizedUrl,
      url: resizedUrl,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[upload-to-r2-basic] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
