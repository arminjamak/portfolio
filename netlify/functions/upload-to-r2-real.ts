import type { Context } from '@netlify/functions';
import { createHmac } from 'crypto';

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { imageId, imageData } = await request.json();
    
    if (!imageId || !imageData) {
      return new Response('Missing imageId or imageData', { status: 400 });
    }

    console.log(`[upload-to-r2-real] Uploading ${imageId} to Cloudflare R2...`);

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log(`[upload-to-r2-real] Buffer size: ${buffer.length} bytes (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);

    // Check required environment variables
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    
    if (!accountId || !bucketName || !accessKeyId || !secretAccessKey) {
      console.error('[upload-to-r2-real] Missing environment variables:', {
        accountId: !!accountId,
        bucketName: !!bucketName,
        accessKeyId: !!accessKeyId,
        secretAccessKey: !!secretAccessKey
      });
      return new Response('Missing Cloudflare R2 S3 credentials', { status: 500 });
    }

    // AWS Signature V4 implementation for R2
    const region = 'auto';
    const service = 's3';
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}/${bucketName}/${imageId}`;
    
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const amzDate = now.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z';
    
    // Create canonical request
    const method = 'PUT';
    const canonicalUri = `/${bucketName}/${imageId}`;
    const canonicalQueryString = '';
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const payloadHash = 'UNSIGNED-PAYLOAD';
    
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    
    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${createHmac('sha256', '').update(canonicalRequest).digest('hex')}`;
    
    // Calculate signature
    const kDate = createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
    const kRegion = createHmac('sha256', kDate).update(region).digest();
    const kService = createHmac('sha256', kRegion).update(service).digest();
    const kSigning = createHmac('sha256', kService).update('aws4_request').digest();
    const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');
    
    // Create authorization header
    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    console.log(`[upload-to-r2-real] Uploading to: ${endpoint}`);
    
    // Upload to R2
    const r2Response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Host': host,
        'Authorization': authorizationHeader,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!r2Response.ok) {
      const errorText = await r2Response.text();
      console.error(`[upload-to-r2-real] R2 upload failed (${r2Response.status}):`, errorText);
      return new Response(`R2 upload failed: ${errorText}`, { status: 500 });
    }

    console.log(`[upload-to-r2-real] ✅ Successfully uploaded to R2`);

    // Generate the public URLs
    const r2Domain = process.env.CLOUDFLARE_R2_DOMAIN || `pub-${accountId}.r2.dev`;
    const imagesDomain = process.env.CLOUDFLARE_IMAGES_DOMAIN || 'your-domain.com';
    
    const publicUrl = `https://${r2Domain}/${imageId}`;
    const resizedUrl = `https://${imagesDomain}/cdn-cgi/image/width=1200,quality=85,format=auto/${publicUrl}`;

    console.log(`[upload-to-r2-real] Generated URLs:`);
    console.log(`[upload-to-r2-real] - Original: ${publicUrl}`);
    console.log(`[upload-to-r2-real] - Resized: ${resizedUrl}`);

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
    console.error('[upload-to-r2-real] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
