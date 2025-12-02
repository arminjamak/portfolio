import ImageKit from 'imagekit-javascript';

interface DirectUploadResult {
  success: boolean;
  imageId: string;
  originalUrl: string;
  resizedUrl: string;
  url: string;
  error?: string;
}

interface AuthParams {
  publicKey: string;
  signature: string;
  expire: number;
  token: string;
  urlEndpoint: string;
  folder: string;
  useUniqueFileName: string;
}

// Initialize ImageKit instance (will be configured with auth params)
let imagekitInstance: ImageKit | null = null;

export async function uploadToImageKitDirect(
  file: File, 
  imageId: string,
  adminToken: string = 'admin-secret-key' // In production, get this from secure storage
): Promise<DirectUploadResult> {
  const fileSizeMB = file.size / 1024 / 1024;
  console.log(`[ImageKit Direct] Starting direct upload for ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);
  
  try {
    // ImageKit allows up to 25MB
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

    // Get authentication parameters from our backend
    console.log(`[ImageKit Direct] Getting authentication parameters...`);
    
    const authResponse = await fetch('/.netlify/functions/imagekit-upload-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileName: imageId,
        adminToken 
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Authentication failed: ${errorText}`);
    }

    const authParams: AuthParams = await authResponse.json();
    
    // Initialize ImageKit with the authentication parameters
    imagekitInstance = new ImageKit({
      publicKey: authParams.publicKey,
      urlEndpoint: authParams.urlEndpoint,
    });

    console.log(`[ImageKit Direct] Uploading ${fileSizeMB.toFixed(2)}MB directly to ImageKit...`);
    
    // Upload directly to ImageKit using the SDK
    const uploadResult = await imagekitInstance.upload({
      file: file,
      fileName: `${imageId}.${getFileExtension(file)}`,
      folder: authParams.folder,
      useUniqueFileName: authParams.useUniqueFileName === 'true',
      // Include authentication parameters
      signature: authParams.signature,
      expire: authParams.expire,
      token: authParams.token,
    });

    console.log(`[ImageKit Direct] ✅ Direct upload successful:`, uploadResult.url);

    // Generate optimized URL using ImageKit transformations
    const cleanFilePath = uploadResult.filePath.startsWith('/') ? uploadResult.filePath.slice(1) : uploadResult.filePath;
    const optimizedUrl = `${authParams.urlEndpoint}/tr:w-1200,q-85,f-auto/${cleanFilePath}`;

    return {
      success: true,
      imageId,
      originalUrl: uploadResult.url,
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

// Fallback method using FormData (if SDK doesn't work as expected)
export async function uploadToImageKitDirectFormData(
  file: File, 
  imageId: string,
  adminToken: string = 'admin-secret-key'
): Promise<DirectUploadResult> {
  const fileSizeMB = file.size / 1024 / 1024;
  console.log(`[ImageKit Direct FormData] Starting direct upload for ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);
  
  try {
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

    // Get authentication parameters from our backend
    const authResponse = await fetch('/.netlify/functions/imagekit-upload-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileName: imageId,
        adminToken 
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Authentication failed: ${errorText}`);
    }

    const authParams: AuthParams = await authResponse.json();
    
    // Create form data for direct upload to ImageKit
    // Must match exactly what was used to generate the signature
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `${imageId}.${getFileExtension(file)}`);
    formData.append('folder', authParams.folder);
    formData.append('publicKey', authParams.publicKey);
    formData.append('signature', authParams.signature);
    formData.append('expire', authParams.expire.toString());
    formData.append('token', authParams.token);
    formData.append('useUniqueFileName', authParams.useUniqueFileName);

    console.log(`[ImageKit Direct FormData] Uploading ${fileSizeMB.toFixed(2)}MB directly to ImageKit...`);
    
    // Direct upload to ImageKit (no Netlify Function involved)
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[ImageKit Direct FormData] Upload failed:`, errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || errorText);
      } catch {
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }
    }

    const result = await uploadResponse.json();
    console.log(`[ImageKit Direct FormData] ✅ Direct upload successful:`, result.url);

    // Generate optimized URL
    const cleanFilePath = result.filePath.startsWith('/') ? result.filePath.slice(1) : result.filePath;
    const optimizedUrl = `${authParams.urlEndpoint}/tr:w-1200,q-85,f-auto/${cleanFilePath}`;

    return {
      success: true,
      imageId,
      originalUrl: result.url,
      resizedUrl: optimizedUrl,
      url: optimizedUrl
    };

  } catch (error) {
    console.error(`[ImageKit Direct FormData] Error:`, error);
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
