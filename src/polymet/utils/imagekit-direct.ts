// Direct ImageKit upload utility - bypasses Netlify Functions for large files

interface ImageKitUploadResult {
  success: boolean;
  imageId: string;
  originalUrl: string;
  resizedUrl: string;
  url: string;
  error?: string;
}

export async function uploadToImageKitDirect(
  file: File, 
  imageId: string
): Promise<ImageKitUploadResult> {
  console.log(`[ImageKit Direct] Starting upload for ${imageId}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  
  try {
    // Get ImageKit credentials from environment or fallback
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_your_key_here';
    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/bvord1udre';
    
    // For direct upload, we need to get upload signature from our backend
    console.log(`[ImageKit Direct] Getting upload signature...`);
    
    const signatureResponse = await fetch('/.netlify/functions/imagekit-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: imageId })
    });
    
    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    const { signature, expire, token } = await signatureResponse.json();
    
    // Create form data for direct upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${imageId}.${file.type.split('/')[1] || 'jpg'}`);
    formData.append('folder', '/portfolio');
    formData.append('publicKey', publicKey);
    formData.append('signature', signature);
    formData.append('expire', expire.toString());
    formData.append('token', token);
    
    console.log(`[ImageKit Direct] Uploading directly to ImageKit...`);
    
    // Upload directly to ImageKit
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[ImageKit Direct] Upload failed:`, errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }
    
    const result = await uploadResponse.json();
    console.log(`[ImageKit Direct] ✅ Upload successful:`, result.url);
    
    // Generate optimized URL
    const cleanFilePath = result.filePath.startsWith('/') ? result.filePath.slice(1) : result.filePath;
    const optimizedUrl = `${urlEndpoint}/tr:w-1200,q-85,f-auto/${cleanFilePath}`;
    
    return {
      success: true,
      imageId,
      originalUrl: result.url,
      resizedUrl: optimizedUrl,
      url: optimizedUrl
    };
    
  } catch (error) {
    console.error(`[ImageKit Direct] Error:`, error);
    return {
      success: false,
      imageId,
      originalUrl: '',
      resizedUrl: '',
      url: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
