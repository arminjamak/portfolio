import { syncToGitHub, exportAllData } from './sync-service';

// LocalStorage key
const STORAGE_KEY = "portfolio_home_data";

export interface HomeData {
  title: string;
  subtitle: string;
}

const defaultHomeData: HomeData = {
  title: "Product Designer",
  subtitle: "Creating meaningful digital experiences that solve real problems and delight users.",
};

// Load home data from localStorage or use default data
const loadHomeData = (): HomeData => {
  if (typeof window === "undefined") return defaultHomeData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading home data from localStorage:", error);
  }
  return defaultHomeData;
};

// Save home data to localStorage
const saveHomeData = async (data: HomeData): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving home data to localStorage:", error);
  }

  // Sync to GitHub in production
  try {
    const allData = exportAllData();
    await syncToGitHub(allData, 'Update home data from admin panel');
  } catch (error) {
    console.error('Error syncing to GitHub:', error);
    // Don't fail the save if GitHub sync fails
  }
};

// Initialize home data
export let homeData: HomeData = loadHomeData();

export const getHomeData = (): HomeData => {
  homeData = loadHomeData();
  return homeData;
};

export const updateHomeData = async (updates: Partial<HomeData>): Promise<void> => {
  homeData = { ...homeData, ...updates };
  await saveHomeData(homeData);
};

// Reset to default data (useful for testing)
export const resetHomeData = (): void => {
  homeData = { ...defaultHomeData };
  saveHomeData(homeData);
};
