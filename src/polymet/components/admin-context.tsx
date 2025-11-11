import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { syncToGitHub, exportAllData } from "@/polymet/data/sync-service";

interface AdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = "jamakarmin@gmail.com";
const ADMIN_PASSWORD = "Carbovaris2011";
const ADMIN_STORAGE_KEY = "portfolio_admin_auth";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = async () => {
    // Sync all data to GitHub before logging out
    try {
      console.log('[Admin Logout] Uploading images to Netlify Blobs and syncing to GitHub...');
      const allData = await exportAllData(); // Now async to handle Netlify Blobs upload
      const success = await syncToGitHub(allData, 'Update content from admin session with Netlify Blobs');
      if (success) {
        console.log('[Admin Logout] ✅ Data synced successfully with persistent images!');
      } else {
        console.error('[Admin Logout] ⚠️ Failed to sync data');
      }
    } catch (error) {
      console.error('[Admin Logout] Error syncing data:', error);
    }
    
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
