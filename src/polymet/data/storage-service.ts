// IndexedDB storage service for large files
const DB_NAME = "PortfolioStorage";
const DB_VERSION = 1;
const STORE_NAME = "images";

class StorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async saveImage(id: string, dataUrl: string): Promise<void> {
    if (!this.db) await this.init();

    const sizeMB = (dataUrl.length / 1024 / 1024).toFixed(2);
    console.log(`[IndexedDB] Saving image: ${id} (${sizeMB}MB)`);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id, dataUrl, timestamp: Date.now() });

      request.onsuccess = () => {
        console.log(`[IndexedDB] ✅ Image saved successfully: ${id}`);
        resolve();
      };
      request.onerror = () => {
        console.error(
          `[IndexedDB] ❌ Failed to save image: ${id}`,
          request.error
        );
        reject(request.error);
      };
    });
  }

  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const sizeMB = (result.dataUrl.length / 1024 / 1024).toFixed(2);
          console.log(`[IndexedDB] ✅ Image retrieved: ${id} (${sizeMB}MB)`);
          resolve(result.dataUrl);
        } else {
          console.warn(`[IndexedDB] ⚠️ Image not found: ${id}`);
          resolve(null);
        }
      };
      request.onerror = () => {
        console.error(
          `[IndexedDB] ❌ Failed to retrieve image: ${id}`,
          request.error
        );
        reject(request.error);
      };
    });
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllImageIds(): Promise<string[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        const keys = request.result as string[];
        console.log(`[IndexedDB] Total images stored: ${keys.length}`, keys);
        resolve(keys);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllImages(): Promise<
    Array<{ id: string; dataUrl: string; timestamp: number }>
  > {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const images = request.result;
        console.log(
          `[IndexedDB] Retrieved ${images.length} images from database`
        );
        resolve(images);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const storageService = new StorageService();

// Helper function to check if a URL is a data URL (base64)
export function isDataUrl(url: string): boolean {
  return url.startsWith("data:");
}

// Helper function to generate a unique ID for an image
export function generateImageId(
  projectId: string,
  type: "thumbnail" | "image"
): string {
  return `${projectId}-${type}-${Date.now()}`;
}

// Helper function to convert file to data URL
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to get file size in MB
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}
