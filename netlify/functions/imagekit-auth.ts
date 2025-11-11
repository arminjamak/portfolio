import type { Context } from '@netlify/functions';
import { createHmac } from 'crypto';

export default async (request: Request, context: Context) => {
  console.log('[imagekit-auth] Lightweight auth function started');
  
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { fileName } = await request.json();
    
    if (!fileName) {
      return new Response(JSON.stringify({ 
        error: 'Missing fileName' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check environment variables
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!publicKey || !privateKey) {
      console.error('[imagekit-auth] Missing ImageKit credentials');
      return new Response(JSON.stringify({
        error: 'Missing ImageKit credentials'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate authentication for client-side upload
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
    // Create signature string for ImageKit authentication
    const signatureString = `token=${token}&expire=${expire}`;
    const signature = createHmac('sha1', privateKey).update(signatureString).digest('hex');
    
    console.log(`[imagekit-auth] Generated auth for ${fileName} (expires in 1 hour)`);
    
    return new Response(JSON.stringify({
      publicKey,
      signature,
      expire,
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[imagekit-auth] Error:', error);
    return new Response(JSON.stringify({
      error: `Auth generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
