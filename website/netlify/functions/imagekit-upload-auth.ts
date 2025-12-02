import type { Context } from '@netlify/functions';
import { createHmac } from 'crypto';

export default async (request: Request, context: Context) => {
  console.log('[imagekit-upload-auth] Authentication function started');
  
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { fileName, adminToken } = await request.json();
    
    if (!fileName) {
      return new Response(JSON.stringify({ 
        error: 'Missing fileName' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic admin verification (you can enhance this with proper JWT tokens)
    // For now, we'll use a simple admin check - in production, implement proper auth
    const expectedAdminToken = process.env.ADMIN_TOKEN || 'admin-secret-key';
    if (adminToken !== expectedAdminToken) {
      console.log('[imagekit-upload-auth] Invalid admin token');
      return new Response(JSON.stringify({
        error: 'Unauthorized - admin access required'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check ImageKit environment variables
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error('[imagekit-upload-auth] Missing ImageKit credentials');
      return new Response(JSON.stringify({
        error: 'Missing ImageKit credentials'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate authentication parameters for client-side upload
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes from now (well under 1 hour limit)
    
    // Create signature according to ImageKit documentation
    // For client-side uploads, we need to include all parameters that will be sent
    const folder = '/portfolio';
    const useUniqueFileName = 'true';
    
    // Build the signature string according to ImageKit spec
    // The signature should be: token + expire + privateKey (NOT all params)
    const stringToSign = token + expire;
    
    const signature = createHmac('sha1', privateKey).update(stringToSign).digest('hex');
    
    console.log(`[imagekit-upload-auth] Generated auth for ${fileName} (expires in 1 hour)`);
    
    return new Response(JSON.stringify({
      publicKey,
      signature,
      expire,
      token,
      urlEndpoint,
      folder,
      useUniqueFileName
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('[imagekit-upload-auth] Error:', error);
    return new Response(JSON.stringify({
      error: `Auth generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
