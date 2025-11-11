import { storageService } from './storage-service';

// Fetch and sync images from deployed site to local IndexedDB
export const syncImagesFromDeployedSite = async (deployedUrl: string = 'https://armin.work'): Promise<void> => {
  console.log('[syncImagesFromDeployedSite] Starting image sync from deployed site...');
  
  try {
    // Fetch the deployed data.json
    console.log(`[syncImagesFromDeployedSite] Fetching data from ${deployedUrl}/data.json`);
    const response = await fetch(`${deployedUrl}/data.json`, {
      mode: 'cors',
      cache: 'no-cache',
    });
    if (!response.ok) {
      console.error(`[syncImagesFromDeployedSite] Failed to fetch deployed data.json: ${response.status} ${response.statusText}`);
      return;
    }

    const deployedData = await response.json();
    console.log('[syncImagesFromDeployedSite] Fetched deployed data');

    if (!deployedData.projects || !Array.isArray(deployedData.projects)) {
      console.error('[syncImagesFromDeployedSite] No projects found in deployed data');
      return;
    }

    let downloadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each project
    for (const project of deployedData.projects) {
      // Download thumbnail if it's a blob URL
      if (project.thumbnail && project.thumbnail.includes('/.netlify/blobs/')) {
        const imageId = extractImageIdFromBlobUrl(project.thumbnail);
        if (imageId) {
          const success = await downloadAndStoreImage(project.thumbnail, imageId);
          if (success) {
            downloadedCount++;
          } else {
            errorCount++;
          }
        }
      } else if (project.thumbnail && project.thumbnail.startsWith('http')) {
        // Download external URL
        const imageId = `${project.id}-thumbnail`;
        const success = await downloadAndStoreImage(project.thumbnail, imageId);
        if (success) {
          downloadedCount++;
        } else {
          errorCount++;
        }
      }

      // Download images array
      if (project.images && Array.isArray(project.images)) {
        for (let i = 0; i < project.images.length; i++) {
          const imageUrl = project.images[i];
          if (imageUrl && imageUrl.includes('/.netlify/blobs/')) {
            const imageId = extractImageIdFromBlobUrl(imageUrl);
            if (imageId) {
              const success = await downloadAndStoreImage(imageUrl, imageId);
              if (success) {
                downloadedCount++;
              } else {
                errorCount++;
              }
            }
          } else if (imageUrl && imageUrl.startsWith('http')) {
            const imageId = `${project.id}-image-${i}`;
            const success = await downloadAndStoreImage(imageUrl, imageId);
            if (success) {
              downloadedCount++;
            } else {
              errorCount++;
            }
          }
        }
      }

      // Download history images
      if (project.history && Array.isArray(project.history)) {
        for (let j = 0; j < project.history.length; j++) {
          const historyItem = project.history[j];
          if (historyItem.images && Array.isArray(historyItem.images)) {
            for (let k = 0; k < historyItem.images.length; k++) {
              const image = historyItem.images[k];
              if (image.url && image.url.includes('/.netlify/blobs/')) {
                const imageId = extractImageIdFromBlobUrl(image.url);
                if (imageId) {
                  const success = await downloadAndStoreImage(image.url, imageId);
                  if (success) {
                    downloadedCount++;
                  } else {
                    errorCount++;
                  }
                }
              } else if (image.url && image.url.startsWith('http')) {
                const imageId = `${project.id}-history-${j}-${k}`;
                const success = await downloadAndStoreImage(image.url, imageId);
                if (success) {
                  downloadedCount++;
                } else {
                  errorCount++;
                }
              }
            }
          }
        }
      }
    }

    console.log(`[syncImagesFromDeployedSite] ✅ Sync complete!`);
    console.log(`[syncImagesFromDeployedSite] Downloaded: ${downloadedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
    
    // Always update localStorage with the deployed data (which has external URLs instead of indexeddb: references)
    console.log('[syncImagesFromDeployedSite] Updating localStorage with deployed data...');
    localStorage.setItem('portfolio_projects_data', JSON.stringify(deployedData.projects));
    localStorage.setItem('portfolio_last_synced_timestamp', deployedData.timestamp);
    
    // Also update about and home data if present
    if (deployedData.about) {
      localStorage.setItem('portfolio_about_data', JSON.stringify(deployedData.about));
    }
    if (deployedData.home) {
      localStorage.setItem('portfolio_home_data', JSON.stringify(deployedData.home));
    }
    
    console.log('[syncImagesFromDeployedSite] ✅ localStorage updated with deployed data');
  } catch (error) {
    console.error('[syncImagesFromDeployedSite] Error syncing images:', error);
  }
};

// Extract image ID from Netlify Blob URL
const extractImageIdFromBlobUrl = (url: string): string | null => {
  const match = url.match(/\/\.netlify\/blobs\/get\/[^/]+\/(.+)$/);
  return match ? match[1] : null;
};

// Download image and store in IndexedDB
const downloadAndStoreImage = async (imageUrl: string, imageId: string): Promise<boolean> => {
  try {
    // Check if image already exists in IndexedDB
    const existing = await storageService.getImage(imageId);
    if (existing) {
      console.log(`[downloadAndStoreImage] ⏭️  Skipped (already exists): ${imageId}`);
      return true;
    }

    console.log(`[downloadAndStoreImage] Downloading: ${imageId} from ${imageUrl}`);
    
    // Fetch the image with CORS
    const response = await fetch(imageUrl, {
      mode: 'cors',
      cache: 'no-cache',
    });
    if (!response.ok) {
      console.error(`[downloadAndStoreImage] Failed to fetch: ${imageUrl} - ${response.status} ${response.statusText}`);
      return false;
    }

    // Convert to blob then to data URL
    const blob = await response.blob();
    console.log(`[downloadAndStoreImage] Downloaded blob: ${(blob.size / 1024).toFixed(0)}KB`);
    const dataUrl = await blobToDataUrl(blob);

    // Store in IndexedDB
    await storageService.saveImage(imageId, dataUrl);
    console.log(`[downloadAndStoreImage] ✅ Downloaded and stored: ${imageId} (${(dataUrl.length / 1024).toFixed(0)}KB)`);
    
    return true;
  } catch (error) {
    console.error(`[downloadAndStoreImage] Error downloading ${imageId}:`, error);
    return false;
  }
};

// Convert blob to data URL
const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
