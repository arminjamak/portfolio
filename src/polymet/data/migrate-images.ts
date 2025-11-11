// Migration utility to convert existing base64 images to Netlify Blobs
export const migrateBase64ImagesToBlobs = async (): Promise<void> => {
  console.log('[Migration] 🚀 Starting IndexedDB + base64 to Netlify Blobs migration...');
  
  try {
    // First, clear localStorage to avoid quota issues
    console.log('[Migration] Clearing localStorage to avoid quota issues...');
    localStorage.removeItem('portfolio_projects_data');
    localStorage.removeItem('portfolio_about_data');
    localStorage.removeItem('portfolio_home_data');
    
    // Load fresh data from data.json (this will trigger IndexedDB loading)
    console.log('[Migration] Loading fresh data from data.json...');
    const response = await fetch('/data.json');
    const freshData = await response.json();
    
    // Wait a moment for IndexedDB loading to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Now migrate any IndexedDB images that were loaded
    console.log('[Migration] Checking for IndexedDB images to migrate...');
    
    // Get all images from IndexedDB - use correct database name
    const dbRequest = indexedDB.open('PortfolioStorage', 1);
    
    dbRequest.onsuccess = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log('[Migration] Available object stores:', Array.from(db.objectStoreNames));
      
      // Try different possible store names
      let storeName = 'images';
      if (!db.objectStoreNames.contains('images')) {
        if (db.objectStoreNames.contains('portfolioImages')) {
          storeName = 'portfolioImages';
        } else if (db.objectStoreNames.length > 0) {
          storeName = db.objectStoreNames[0];
        } else {
          console.log('[Migration] No object stores found in IndexedDB');
          alert('No images found in IndexedDB to migrate.');
          return;
        }
      }
      
      console.log(`[Migration] Using object store: ${storeName}`);
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = async () => {
        const allImages = getAllRequest.result;
        console.log(`[Migration] Found ${allImages.length} images in IndexedDB`);
        
        let migratedCount = 0;
        for (const imageRecord of allImages) {
          try {
            console.log(`[Migration] Migrating ${imageRecord.id} (${(imageRecord.dataUrl.length / 1024 / 1024).toFixed(1)}MB)...`);
            
            const imageId = `migrated-${imageRecord.id}-${Date.now()}`;
            const uploadResponse = await fetch('/.netlify/functions/upload-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageId,
                imageData: imageRecord.dataUrl,
              }),
            });
            
            if (uploadResponse.ok) {
              const result = await uploadResponse.json();
              console.log(`[Migration] ✅ Migrated ${imageRecord.id} to: ${result.url}`);
              migratedCount++;
              
              // Update the corresponding project in localStorage
              const projectsData = localStorage.getItem('portfolio_projects_data') || '[]';
              const projects = JSON.parse(projectsData);
              
              // Find and update the project that uses this image
              for (const project of projects) {
                if (project.thumbnail && project.thumbnail.includes(imageRecord.id)) {
                  project.thumbnail = result.url;
                  console.log(`[Migration] Updated ${project.title} thumbnail`);
                }
              }
              
              localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
            }
          } catch (error) {
            console.warn(`[Migration] Failed to migrate ${imageRecord.id}:`, error);
          }
        }
        
        console.log(`[Migration] 🎉 Migration complete! Migrated ${migratedCount}/${allImages.length} images`);
        alert(`✅ Migration complete!\n\n${migratedCount} images migrated to Netlify Blobs.\nStorage quota issue should be fixed.\n\nRefresh the page to see the results.`);
      };
    };
    
    dbRequest.onerror = () => {
      console.error('[Migration] Failed to access IndexedDB');
      alert('❌ Migration failed: Could not access IndexedDB');
    };
    
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    alert('❌ Migration failed. Check console for details.');
  }
};

const migrateObjectImages = async (obj: any, context: string): Promise<any> => {
  if (typeof obj === 'string' && obj.startsWith('data:image/')) {
    console.log(`[Migration] Converting base64 image in ${context}...`);
    const imageId = `migrated-${context}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const response = await fetch('/.netlify/functions/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          imageData: obj,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`[Migration] ✅ Converted base64 to: ${result.url}`);
        return result.url;
      } else {
        console.warn(`[Migration] Failed to upload ${imageId}, keeping base64`);
        return obj;
      }
    } catch (error) {
      console.warn(`[Migration] Error uploading ${imageId}:`, error);
      return obj;
    }
  }
  
  if (Array.isArray(obj)) {
    const results = await Promise.all(obj.map((item, index) => 
      migrateObjectImages(item, `${context}[${index}]`)
    ));
    return results;
  }
  
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await migrateObjectImages(value, `${context}.${key}`);
    }
    return result;
  }
  
  return obj;
};

// Add migration button to admin panel
export const addMigrationButton = () => {
  if (typeof window === 'undefined') return;
  
  // Only add if not already added
  if (document.getElementById('migration-button')) return;
  
  const button = document.createElement('button');
  button.id = 'migration-button';
  button.innerHTML = '🚀 Fix Storage Quota (Migrate Images)';
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #dc3545;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  
  button.onclick = () => {
    if (confirm('🚀 URGENT: Fix storage quota by migrating large images to Netlify Blobs?\n\nThis will:\n✅ Convert 20MB+ images to small URLs\n✅ Fix QuotaExceededError\n✅ Make images load on mobile\n\nThis may take 2-3 minutes.')) {
      button.innerHTML = '⏳ Migrating...';
      button.disabled = true;
      migrateBase64ImagesToBlobs().finally(() => {
        button.innerHTML = '✅ Migration Complete';
        setTimeout(() => {
          button.remove();
        }, 3000);
      });
    }
  };
  
  document.body.appendChild(button);
};

// Also make it available globally for manual execution
if (typeof window !== 'undefined') {
  (window as any).migrateImages = migrateBase64ImagesToBlobs;
}
