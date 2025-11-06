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

// Export all data for GitHub sync
export const exportAllData = () => {
  const data: any = {
    timestamp: new Date().toISOString(),
    projects: {},
    about: {},
    home: {},
  };

  // Export projects data
  try {
    const projectsData = localStorage.getItem('portfolio_projects_data');
    if (projectsData) {
      data.projects = JSON.parse(projectsData);
    }
  } catch (error) {
    console.error('[exportAllData] Error exporting projects:', error);
  }

  // Export about data
  try {
    const aboutData = localStorage.getItem('portfolio_about_data');
    if (aboutData) {
      data.about = JSON.parse(aboutData);
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

  return data;
};
