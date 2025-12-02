// Quick fix for projects with broken IndexedDB references
import { getProjects } from './projects-data';

const STORAGE_KEY = 'portfolio_projects_data';

export async function fixBrokenProjects() {
  console.log('[fixBrokenProjects] Starting fix for broken project references...');
  
  try {
    const projects = await getProjects();
    console.log(`[fixBrokenProjects] Found ${projects.length} projects`);
    
    let fixedCount = 0;
    
    for (const project of projects) {
      let needsUpdate = false;
      
      // Fix broken thumbnail references
      if (project.thumbnail && project.thumbnail.startsWith('indexeddb:')) {
        console.log(`[fixBrokenProjects] Fixing broken thumbnail for project: ${project.title}`);
        project.thumbnail = ''; // Clear broken reference
        needsUpdate = true;
      }
      
      // Fix broken image references in images array
      for (let i = 0; i < project.images.length; i++) {
        if (project.images[i] && project.images[i].startsWith('indexeddb:')) {
          console.log(`[fixBrokenProjects] Fixing broken image ${i} for project: ${project.title}`);
          project.images[i] = ''; // Clear broken reference
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        fixedCount++;
      }
    }
    
    if (fixedCount > 0) {
      // Save directly to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      console.log(`[fixBrokenProjects] ✅ Fixed ${fixedCount} projects with broken references`);
    } else {
      console.log(`[fixBrokenProjects] ✅ No broken references found`);
    }
    
    return { fixed: fixedCount, total: projects.length };
    
  } catch (error) {
    console.error('[fixBrokenProjects] Error:', error);
    throw error;
  }
}

// Make it available globally for manual execution
(window as any).fixBrokenProjects = fixBrokenProjects;
