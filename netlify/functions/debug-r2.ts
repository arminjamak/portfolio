import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  try {
    console.log('[debug-r2] Starting debug...');
    
    // Check environment variables
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const r2Domain = process.env.CLOUDFLARE_R2_DOMAIN;
    const imagesDomain = process.env.CLOUDFLARE_IMAGES_DOMAIN;
    
    console.log('[debug-r2] Environment variables check:', {
      accountId: accountId ? `${accountId.slice(0, 8)}...` : 'MISSING',
      bucketName: bucketName || 'MISSING',
      accessKeyId: accessKeyId ? `${accessKeyId.slice(0, 8)}...` : 'MISSING',
      secretAccessKey: secretAccessKey ? `${secretAccessKey.slice(0, 8)}...` : 'MISSING',
      r2Domain: r2Domain || 'MISSING',
      imagesDomain: imagesDomain || 'MISSING'
    });
    
    // Test basic fetch to R2 endpoint
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const testUrl = `https://${host}/${bucketName}/`;
    
    console.log('[debug-r2] Testing basic connection to:', testUrl);
    
    try {
      const testResponse = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Netlify-Function-Debug'
        }
      });
      
      console.log('[debug-r2] Test response status:', testResponse.status);
      console.log('[debug-r2] Test response headers:', Object.fromEntries(testResponse.headers.entries()));
      
      const responseText = await testResponse.text();
      console.log('[debug-r2] Test response body (first 200 chars):', responseText.slice(0, 200));
      
    } catch (fetchError) {
      console.error('[debug-r2] Test fetch error:', fetchError);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Debug complete - check function logs',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('[debug-r2] Debug error:', error);
    return new Response(JSON.stringify({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
