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
  const fileSizeMB = file.size / 1024 / 1024;
  console.log(`[ImageKit Direct] Starting upload for ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);
  
  // Check file size limit to prevent function crashes
  if (fileSizeMB > 10) {
    console.warn(`[ImageKit Direct] File too large: ${fileSizeMB.toFixed(2)}MB (max: 10MB)`);
    return {
      success: false,
      imageId,
      originalUrl: '',
      resizedUrl: '',
      url: '',
      error: `File too large: ${fileSizeMB.toFixed(2)}MB. Please compress to under 10MB first.`
    };
  }
  
  try {
    // Use the same approach as our working simple function - go through our backend
    console.log(`[ImageKit Direct] Using backend upload for authentication...`);
    
    // Convert file to base64 for backend upload
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    // Upload through our working backend function
    const uploadResponse = await fetch('/.netlify/functions/upload-to-imagekit-simple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageId,
        imageData: base64Data
      })
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error(`[ImageKit Direct] Upload failed:`, errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }
    
    const result = await uploadResponse.json();
    
    if (result.success && result.url) {
      console.log(`[ImageKit Direct] ✅ Upload successful:`, result.url);
      return {
        success: true,
        imageId,
        originalUrl: result.originalUrl || result.url,
        resizedUrl: result.resizedUrl || result.url,
        url: result.url
      };
    } else {
      throw new Error(result.error || 'Upload failed');
    }
    
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
