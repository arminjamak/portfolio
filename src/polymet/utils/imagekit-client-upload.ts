// True client-side direct upload to ImageKit (no Netlify Function limits)

interface ImageKitClientUploadResult {
  success: boolean;
  imageId: string;
  originalUrl: string;
  resizedUrl: string;
  url: string;
  error?: string;
}

export async function uploadToImageKitClient(
  file: File, 
  imageId: string
): Promise<ImageKitClientUploadResult> {
  const fileSizeMB = file.size / 1024 / 1024;
  console.log(`[ImageKit Client] Starting direct upload for ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);
  
  try {
    // ImageKit allows up to 25MB, so we can handle large files
    if (fileSizeMB > 25) {
      return {
        success: false,
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
        error: `File too large: ${fileSizeMB.toFixed(2)}MB. ImageKit maximum is 25MB.`
      };
    }

    // Get authentication token from our backend (lightweight request)
    console.log(`[ImageKit Client] Getting authentication token...`);
    
    const authResponse = await fetch('/.netlify/functions/imagekit-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: imageId })
    });

    if (!authResponse.ok) {
      throw new Error('Failed to get authentication token');
    }

    const { publicKey, signature, expire, token } = await authResponse.json();
    
    // Create form data for direct upload to ImageKit
    // Must match exactly what was used to generate the signature
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${imageId}.${getFileExtension(file)}`);
    formData.append('folder', '/portfolio');
    formData.append('publicKey', publicKey);
    formData.append('signature', signature);
    formData.append('expire', expire.toString());
    formData.append('token', token);
    formData.append('useUniqueFileName', 'true'); // Must match signature generation

    console.log(`[ImageKit Client] Uploading ${fileSizeMB.toFixed(2)}MB directly to ImageKit...`);
    
    // Direct upload to ImageKit (no Netlify Function involved)
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[ImageKit Client] Upload failed:`, errorText);
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || errorText);
      } catch {
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }
    }

    const result = await uploadResponse.json();
    console.log(`[ImageKit Client] ✅ Direct upload successful:`, result.url);

    // Generate optimized URL
    const urlEndpoint = 'https://ik.imagekit.io/bvord1udre';
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
    console.error(`[ImageKit Client] Error:`, error);
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

function getFileExtension(file: File): string {
  const mimeType = file.type;
  switch (mimeType) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/gif': return 'gif';
    case 'image/webp': return 'webp';
    case 'image/svg+xml': return 'svg';
    default: return 'jpg';
  }
}
