// Clear old IndexedDB and localStorage data to force fresh ImageKit uploads

export async function clearOldImageData() {
  console.log('[clearOldImageData] Starting cleanup of old image data...');
  
  try {
    // Clear IndexedDB
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      const deleteDB = indexedDB.deleteDatabase('PortfolioStorage');
      deleteDB.onsuccess = () => {
        console.log('[clearOldImageData] ✅ IndexedDB cleared');
      };
      deleteDB.onerror = (error) => {
        console.error('[clearOldImageData] Error clearing IndexedDB:', error);
      };
    }
    
    // Clear projects from localStorage to force reload
    localStorage.removeItem('polymet-projects');
    console.log('[clearOldImageData] ✅ Projects cleared from localStorage');
    
    // Clear about data
    localStorage.removeItem('polymet-about');
    console.log('[clearOldImageData] ✅ About data cleared from localStorage');
    
    console.log('[clearOldImageData] ✅ Cleanup complete! Refresh the page to start fresh.');
    
    return {
      success: true,
      message: 'Old image data cleared. Refresh the page to start fresh with ImageKit uploads.'
    };
    
  } catch (error) {
    console.error('[clearOldImageData] Error during cleanup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Make it available globally for manual execution
(window as any).clearOldImageData = clearOldImageData;
