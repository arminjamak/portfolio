import { ContentBlock } from "@/polymet/components/content-editor";
import { storageService, isDataUrl } from "@/polymet/data/storage-service";

export interface AboutData {
  content: ContentBlock[];
  profileImage: string;
  skills?: {
    design: string[];
    tools: string[];
    development: string[];
  };
}

const defaultAboutData: AboutData = {
  content: [
    { id: "1", type: "h1", content: "About Me" },
    {
      id: "2",
      type: "body",
      content: "Product Designer based in San Francisco",
    },
    {
      id: "3",
      type: "body",
      content:
        "I'm Armin Jamak, a product designer with over 8 years of experience creating digital products that people love to use. My approach combines strategic thinking with meticulous attention to detail, always keeping the user at the center of every decision.",
    },
    {
      id: "4",
      type: "body",
      content:
        "Throughout my career, I've had the privilege of working with startups and established companies across various industries—from fintech and healthcare to education and e-commerce. I believe great design is invisible; it solves problems so elegantly that users don't have to think about it.",
    },
    {
      id: "5",
      type: "body",
      content:
        "My design process is rooted in research and iteration. I start by deeply understanding the problem space through user interviews, data analysis, and competitive research. Then I explore multiple solutions through sketching and prototyping, testing early and often to validate assumptions and refine the experience.",
    },
    {
      id: "6",
      type: "body",
      content:
        "When I'm not designing, you can find me exploring the city's coffee shops, reading about psychology and behavioral economics, or experimenting with generative art and creative coding.",
    },
  ],

  profileImage: "https://github.com/yusufhilmi.png",
  
  skills: {
    design: ["User Research", "Information Architecture", "Interaction Design", "Visual Design", "Prototyping", "Design Systems"],
    tools: ["Figma", "Adobe Creative Suite", "Sketch", "Principle", "Framer", "Miro"],
    development: ["HTML & CSS", "JavaScript", "React", "Tailwind CSS", "Git", "Responsive Design"]
  }
};

// LocalStorage key
const STORAGE_KEY = "portfolio_about_data";

// Load about data from localStorage or use default data
const loadAboutData = async (): Promise<AboutData> => {
  if (typeof window === "undefined") return defaultAboutData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      
      // Load profile image from IndexedDB if it's a reference
      if (data.profileImage && data.profileImage.startsWith("indexeddb:")) {
        const imageId = data.profileImage.replace("indexeddb:", "");
        console.log(`[loadAboutData] Loading profile image from IndexedDB: ${imageId}`);
        const dataUrl = await storageService.getImage(imageId);
        if (dataUrl) {
          console.log(`[loadAboutData] ✅ Profile image loaded from IndexedDB`);
          data.profileImage = dataUrl;
        } else {
          console.warn(`[loadAboutData] ⚠️ Profile image not found in IndexedDB, using default`);
          data.profileImage = defaultAboutData.profileImage;
        }
      }
      
      return data;
    }
  } catch (error) {
    console.error("Error loading about data from localStorage:", error);
  }
  return defaultAboutData;
};

// Save about data to localStorage and IndexedDB
const saveAboutData = async (data: AboutData): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    console.log("[saveAboutData] Starting save process...");
    const dataToSave = JSON.parse(JSON.stringify(data));

    // Save profile image to IndexedDB if it's a data URL
    if (dataToSave.profileImage && isDataUrl(dataToSave.profileImage)) {
      const imageId = "about-profile-image";
      console.log(`[saveAboutData] Saving profile image to IndexedDB: ${imageId}`);
      await storageService.saveImage(imageId, dataToSave.profileImage);
      dataToSave.profileImage = `indexeddb:${imageId}`;
      console.log(`[saveAboutData] Profile image saved successfully to IndexedDB`);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log("[saveAboutData] ✅ Data saved to localStorage");
  } catch (error) {
    console.error("Error saving about data to localStorage:", error);
  }

  // Note: GitHub sync now happens only on admin logout to reduce build frequency
};

// Initialize about data
export let aboutData: AboutData = defaultAboutData;

// Load data on initialization
if (typeof window !== "undefined") {
  loadAboutData().then((data) => {
    aboutData = data;
  });
}

export const getAboutData = async (): Promise<AboutData> => {
  aboutData = await loadAboutData();
  return aboutData;
};

export const updateAboutData = async (updates: Partial<AboutData>): Promise<void> => {
  aboutData = { ...aboutData, ...updates };
  await saveAboutData(aboutData);
};

// Reset to default data (useful for testing)
export const resetAboutData = async (): Promise<void> => {
  aboutData = { ...defaultAboutData };
  await saveAboutData(aboutData);
};
