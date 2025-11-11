import type { Context } from '@netlify/functions';
import { createHmac } from 'crypto';

export default async (request: Request, context: Context) => {
  console.log('[imagekit-signature] Function started');
  
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
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!privateKey) {
      console.error('[imagekit-signature] Missing IMAGEKIT_PRIVATE_KEY');
      return new Response(JSON.stringify({
        error: 'Missing ImageKit credentials'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate signature for secure upload
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    
    // Create signature string
    const signatureString = `token=${token}&expire=${expire}&privateKey=${privateKey}`;
    const signature = createHmac('sha1', privateKey).update(signatureString).digest('hex');
    
    console.log(`[imagekit-signature] Generated signature for ${fileName}`);
    
    return new Response(JSON.stringify({
      signature,
      expire,
      token
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[imagekit-signature] Error:', error);
    return new Response(JSON.stringify({
      error: `Signature generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
