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

  // Check if we've already initialized from deployment
  const initialized = localStorage.getItem('portfolio_data_initialized');
  if (initialized) {
    console.log('[initializeDataFromDeployment] Already initialized');
    return;
  }

  const deployedData = await loadDeployedData();
  if (!deployedData) {
    console.log('[initializeDataFromDeployment] No deployed data, skipping initialization');
    return;
  }

  // Merge deployed data with localStorage
  try {
    // Projects
    if (deployedData.projects && Object.keys(deployedData.projects).length > 0) {
      const existingProjects = localStorage.getItem('portfolio_projects_data');
      if (!existingProjects) {
        console.log('[initializeDataFromDeployment] Initializing projects from deployment');
        localStorage.setItem('portfolio_projects_data', JSON.stringify(deployedData.projects));
      }
    }

    // About
    if (deployedData.about && Object.keys(deployedData.about).length > 0) {
      const existingAbout = localStorage.getItem('portfolio_about_data');
      if (!existingAbout) {
        console.log('[initializeDataFromDeployment] Initializing about from deployment');
        localStorage.setItem('portfolio_about_data', JSON.stringify(deployedData.about));
      }
    }

    // Home
    if (deployedData.home && Object.keys(deployedData.home).length > 0) {
      const existingHome = localStorage.getItem('portfolio_home_data');
      if (!existingHome) {
        console.log('[initializeDataFromDeployment] Initializing home from deployment');
        localStorage.setItem('portfolio_home_data', JSON.stringify(deployedData.home));
      }
    }

    // Mark as initialized
    localStorage.setItem('portfolio_data_initialized', 'true');
    console.log('[initializeDataFromDeployment] ✅ Data initialization complete');
  } catch (error) {
    console.error('[initializeDataFromDeployment] Error initializing data:', error);
  }
};
