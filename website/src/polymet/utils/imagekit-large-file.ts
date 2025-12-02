// Upload large files (up to 25MB) without base64 conversion

interface ImageKitLargeFileResult {
  success: boolean;
  imageId: string;
  originalUrl: string;
  resizedUrl: string;
  url: string;
  error?: string;
}

export async function uploadLargeFileToImageKit(
  file: File,
  imageId: string
): Promise<ImageKitLargeFileResult> {
  const fileSizeMB = file.size / 1024 / 1024;
  console.log(`[ImageKit Large File] Uploading ${imageId}, size: ${fileSizeMB.toFixed(2)}MB`);

  try {
    // ImageKit supports up to 25MB
    if (fileSizeMB > 25) {
      return {
        success: false,
        imageId,
        originalUrl: '',
        resizedUrl: '',
        url: '',
        error: `File too large: ${fileSizeMB.toFixed(2)}MB. Maximum is 25MB.`
      };
    }

    // Create form data with the actual file (no base64 conversion!)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageId', imageId);

    console.log(`[ImageKit Large File] Uploading ${fileSizeMB.toFixed(2)}MB via multipart/form-data...`);

    // Upload through our optimized large file function
    const response = await fetch('/.netlify/functions/upload-large-file', {
      method: 'POST',
      body: formData // Send as multipart/form-data, NOT JSON
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.success && result.url) {
      console.log(`[ImageKit Large File] ✅ Successfully uploaded ${fileSizeMB.toFixed(2)}MB`);
      return {
        success: true,
        imageId,
        originalUrl: result.originalUrl,
        resizedUrl: result.resizedUrl,
        url: result.url
      };
    } else {
      throw new Error(result.error || 'Upload failed');
    }

  } catch (error) {
    console.error(`[ImageKit Large File] Error:`, error);
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
