// Service to load initial data from public/data.json (deployed data)
// and merge with localStorage (local edits)

export const loadDeployedData = async (): Promise<any> => {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      console.log('[loadDeployedData] No deployed data found, using defaults');
      return null;
    }
    const data = await response.json();
    console.log('[loadDeployedData] Loaded deployed data:', data);
    return data;
  } catch (error) {
    console.error('[loadDeployedData] Error loading deployed data:', error);
    return null;
  }
};

export const initializeDataFromDeployment = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  const deployedData = await loadDeployedData();
  if (!deployedData) {
    console.log('[initializeDataFromDeployment] No deployed data, using defaults');
    return;
  }

  // Get the deployed data timestamp
  const deployedTimestamp = deployedData.timestamp;
  const lastSyncedTimestamp = localStorage.getItem('portfolio_last_synced_timestamp');

  // If deployed data is newer than what we have, update localStorage
  if (!lastSyncedTimestamp || deployedTimestamp > lastSyncedTimestamp) {
    console.log('[initializeDataFromDeployment] Deployed data is newer, updating localStorage');
    
    try {
      // Projects
      if (deployedData.projects && Array.isArray(deployedData.projects) && deployedData.projects.length > 0) {
        console.log('[initializeDataFromDeployment] Updating projects from deployment');
        localStorage.setItem('portfolio_projects_data', JSON.stringify(deployedData.projects));
      }

      // About
      if (deployedData.about && Object.keys(deployedData.about).length > 0) {
        console.log('[initializeDataFromDeployment] Updating about from deployment');
        localStorage.setItem('portfolio_about_data', JSON.stringify(deployedData.about));
      }

      // Home
      if (deployedData.home && Object.keys(deployedData.home).length > 0) {
        console.log('[initializeDataFromDeployment] Updating home from deployment');
        localStorage.setItem('portfolio_home_data', JSON.stringify(deployedData.home));
      }

      // Update the last synced timestamp
      localStorage.setItem('portfolio_last_synced_timestamp', deployedTimestamp);
      console.log('[initializeDataFromDeployment] ✅ Data updated from deployment');
    } catch (error) {
      console.error('[initializeDataFromDeployment] Error updating data:', error);
    }
  } else {
    console.log('[initializeDataFromDeployment] Local data is up to date');
  }
};
