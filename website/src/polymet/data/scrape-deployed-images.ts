import { storageService } from './storage-service';

// Scrape all images from the deployed site by actually loading the pages
export const scrapeDeployedImages = async (deployedUrl: string = 'https://armin.work'): Promise<void> => {
  console.log('[scrapeDeployedImages] Starting comprehensive image scrape...');
  
  try {
    // Fetch the deployed data.json to get project IDs
    const response = await fetch(`${deployedUrl}/data.json`);
    if (!response.ok) {
      console.error('[scrapeDeployedImages] Failed to fetch data.json');
      return;
    }

    const data = await response.json();
    const projects = data.projects || [];
    
    let scrapedCount = 0;
    let errorCount = 0;

    // For each project, fetch the actual page HTML and extract images
    for (const project of projects) {
      console.log(`[scrapeDeployedImages] Scraping project: ${project.title}`);
      
      try {
        // Fetch the project detail page
        const pageResponse = await fetch(`${deployedUrl}/work/${project.id}`, {
          mode: 'cors',
          cache: 'no-cache',
        });
        
        if (!pageResponse.ok) {
          console.error(`[scrapeDeployedImages] Failed to fetch page for ${project.id}`);
          continue;
        }

        const html = await pageResponse.text();
        
        // Extract all img src attributes from the HTML
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match;
        const imageUrls = new Set<string>();
        
        while ((match = imgRegex.exec(html)) !== null) {
          const imgUrl = match[1];
          // Skip data URLs and very small images (likely icons)
          if (!imgUrl.startsWith('data:') && !imgUrl.includes('icon') && !imgUrl.includes('logo')) {
            // Make absolute URL if relative
            const absoluteUrl = imgUrl.startsWith('http') ? imgUrl : `${deployedUrl}${imgUrl}`;
            imageUrls.add(absoluteUrl);
          }
        }

        console.log(`[scrapeDeployedImages] Found ${imageUrls.size} images on ${project.id} page`);

        // Download each unique image
        for (const imageUrl of imageUrls) {
          const imageId = generateImageIdFromUrl(imageUrl, project.id);
          const success = await downloadAndStoreImage(imageUrl, imageId);
          if (success) {
            scrapedCount++;
          } else {
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`[scrapeDeployedImages] Error scraping ${project.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[scrapeDeployedImages] ✅ Scrape complete!`);
    console.log(`[scrapeDeployedImages] Scraped: ${scrapedCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('[scrapeDeployedImages] Error:', error);
  }
};

// Generate a unique image ID from URL
const generateImageIdFromUrl = (url: string, projectId: string): string => {
  // Extract filename or create hash from URL
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1].split('?')[0];
  return `${projectId}-scraped-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`;
};

// Download image and store in IndexedDB
const downloadAndStoreImage = async (imageUrl: string, imageId: string): Promise<boolean> => {
  try {
    // Check if image already exists
    const existing = await storageService.getImage(imageId);
    if (existing) {
      console.log(`[downloadAndStoreImage] ⏭️  Skipped (exists): ${imageId}`);
      return true;
    }

    console.log(`[downloadAndStoreImage] Downloading: ${imageUrl}`);
    
    const response = await fetch(imageUrl, {
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      console.error(`[downloadAndStoreImage] Failed: ${response.status}`);
      return false;
    }

    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    
    await storageService.saveImage(imageId, dataUrl);
    console.log(`[downloadAndStoreImage] ✅ Stored: ${imageId} (${(blob.size / 1024).toFixed(0)}KB)`);
    
    return true;
  } catch (error) {
    console.error(`[downloadAndStoreImage] Error:`, error);
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
