import type { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  console.log('[upload-large-file] Function started for large file upload');
  
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check environment variables
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    
    if (!privateKey || !urlEndpoint) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing ImageKit credentials'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get the multipart form data directly (no base64 conversion!)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const imageId = formData.get('imageId') as string;
    
    if (!file || !imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing file or imageId'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fileSizeMB = file.size / 1024 / 1024;
    console.log(`[upload-large-file] Processing ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);

    // Create new form data for ImageKit with the original file (no conversion!)
    const imagekitFormData = new FormData();
    imagekitFormData.append('file', file);
    imagekitFormData.append('fileName', `${imageId}.${file.type.split('/')[1] || 'jpg'}`);
    imagekitFormData.append('folder', '/portfolio');

    // Create basic auth header
    const auth = Buffer.from(`${privateKey}:`).toString('base64');

    console.log(`[upload-large-file] Uploading ${fileSizeMB.toFixed(2)}MB to ImageKit...`);

    // Upload to ImageKit
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: imagekitFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[upload-large-file] Upload failed:`, errorText);
      return new Response(JSON.stringify({
        success: false,
        error: `ImageKit upload failed: ${errorText}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await uploadResponse.json();
    console.log(`[upload-large-file] ✅ Successfully uploaded ${fileSizeMB.toFixed(2)}MB`);

    // Generate optimized URL
    const cleanFilePath = result.filePath.startsWith('/') ? result.filePath.slice(1) : result.filePath;
    const optimizedUrl = `${urlEndpoint}/tr:w-1200,q-85,f-auto/${cleanFilePath}`;

    return new Response(JSON.stringify({
      success: true,
      imageId,
      originalUrl: result.url,
      resizedUrl: optimizedUrl,
      url: optimizedUrl
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[upload-large-file] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
