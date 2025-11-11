import { storageService } from './storage-service';

// Service to sync data to GitHub via Netlify function
export const syncToGitHub = async (data: any, message: string = 'Update content'): Promise<boolean> => {
  // Only sync in production
  if (import.meta.env.DEV) {
    console.log('[syncToGitHub] Skipping sync in development mode');
    return true;
  }

  try {
    const response = await fetch('/.netlify/functions/update-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: data,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[syncToGitHub] Failed to sync:', error);
      return false;
    }

    const result = await response.json();
    console.log('[syncToGitHub] Successfully synced to GitHub:', result);
    return true;
  } catch (error) {
    console.error('[syncToGitHub] Error syncing to GitHub:', error);
    return false;
  }
};

// Upload image to Netlify Blobs
const uploadImageToNetlifyBlobs = async (imageId: string, dataUrl: string): Promise<string | null> => {
  try {
    console.log(`[uploadImageToNetlifyBlobs] Uploading ${imageId}...`);
    
    const response = await fetch('/.netlify/functions/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageId,
        imageData: dataUrl,
      }),
    });

    if (!response.ok) {
      console.error(`[uploadImageToNetlifyBlobs] Failed to upload ${imageId}: ${response.status}`);
      return null;
    }

    const result = await response.json();
    console.log(`[uploadImageToNetlifyBlobs] ✅ Uploaded ${imageId} -> ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`[uploadImageToNetlifyBlobs] Error uploading ${imageId}:`, error);
    return null;
  }
};

// Replace indexeddb: references and base64 data URLs with Netlify Blob URLs
const replaceImageReferencesWithBlobUrls = async (obj: any): Promise<any> => {
  if (typeof obj === 'string') {
    // Handle indexeddb: references
    if (obj.startsWith('indexeddb:')) {
      const imageId = obj.replace('indexeddb:', '');
      const dataUrl = await storageService.getImage(imageId);
      
      if (dataUrl) {
        const blobUrl = await uploadImageToNetlifyBlobs(imageId, dataUrl);
        return blobUrl || obj; // Return original if upload fails
      }
      return obj;
    }
    
    // Handle base64 data URLs (data:image/...)
    if (obj.startsWith('data:image/')) {
      const imageId = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[replaceIndexedDBReferences] Found base64 image, uploading as ${imageId}...`);
      const blobUrl = await uploadImageToNetlifyBlobs(imageId, obj);
      return blobUrl || obj; // Return original if upload fails
    }
  }
  
  if (Array.isArray(obj)) {
    const results = await Promise.all(obj.map(item => replaceImageReferencesWithBlobUrls(item)));
    return results;
  }
  
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await replaceImageReferencesWithBlobUrls(value);
    }
    return result;
  }
  
  return obj;
};

// Export all data for GitHub sync (now async to handle Netlify Blobs)
export const exportAllData = async (): Promise<any> => {
  console.log('[exportAllData] Starting data export with Netlify Blobs upload...');
  
  const data: any = {
    timestamp: new Date().toISOString(),
    projects: [],
    about: {},
    home: {},
  };

  // Export projects data and upload images
  try {
    const projectsData = localStorage.getItem('portfolio_projects_data');
    if (projectsData) {
      const projects = JSON.parse(projectsData);
      console.log('[exportAllData] Processing projects for Netlify Blobs upload...');
      data.projects = await replaceImageReferencesWithBlobUrls(projects);
    }
  } catch (error) {
    console.error('[exportAllData] Error exporting projects:', error);
  }

  // Export about data and upload images
  try {
    const aboutData = localStorage.getItem('portfolio_about_data');
    if (aboutData) {
      const about = JSON.parse(aboutData);
      console.log('[exportAllData] Processing about data for Netlify Blobs upload...');
      data.about = await replaceImageReferencesWithBlobUrls(about);
    }
  } catch (error) {
    console.error('[exportAllData] Error exporting about:', error);
  }

  // Export home data
  try {
    const homeData = localStorage.getItem('portfolio_home_data');
    if (homeData) {
      data.home = JSON.parse(homeData);
    }
  } catch (error) {
    console.error('[exportAllData] Error exporting home:', error);
  }

  console.log('[exportAllData] ✅ Data export complete with Netlify Blobs URLs');
  return data;
};
