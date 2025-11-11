// Migration utility to convert existing base64 images to Netlify Blobs
export const migrateBase64ImagesToBlobs = async (): Promise<void> => {
  console.log('[Migration] Starting base64 to Netlify Blobs migration...');
  
  try {
    // Migrate projects data
    const projectsData = localStorage.getItem('portfolio_projects_data');
    if (projectsData) {
      const projects = JSON.parse(projectsData);
      const migratedProjects = await migrateObjectImages(projects, 'projects');
      localStorage.setItem('portfolio_projects_data', JSON.stringify(migratedProjects));
      console.log('[Migration] ✅ Projects data migrated');
    }

    // Migrate about data
    const aboutData = localStorage.getItem('portfolio_about_data');
    if (aboutData) {
      const about = JSON.parse(aboutData);
      const migratedAbout = await migrateObjectImages(about, 'about');
      localStorage.setItem('portfolio_about_data', JSON.stringify(migratedAbout));
      console.log('[Migration] ✅ About data migrated');
    }

    // Migrate home data
    const homeData = localStorage.getItem('portfolio_home_data');
    if (homeData) {
      const home = JSON.parse(homeData);
      const migratedHome = await migrateObjectImages(home, 'home');
      localStorage.setItem('portfolio_home_data', JSON.stringify(migratedHome));
      console.log('[Migration] ✅ Home data migrated');
    }

    console.log('[Migration] 🎉 All data migrated successfully!');
    alert('Images migrated to Netlify Blobs! Please refresh the page.');
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    alert('Error during migration. Check console for details.');
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
  button.innerHTML = '🔄 Migrate Images to Blobs';
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  `;
  
  button.onclick = () => {
    if (confirm('Migrate all base64 images to Netlify Blobs? This may take a few minutes.')) {
      migrateBase64ImagesToBlobs();
    }
  };
  
  document.body.appendChild(button);
};
