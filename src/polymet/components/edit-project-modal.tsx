import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/polymet/data/projects-data";
import { SaveIcon, TrashIcon, UploadIcon, LoaderIcon } from "lucide-react";

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSave: (updates: Partial<Project>) => Promise<void>;
  onDelete: () => void;
}

export function EditProjectModal({
  open,
  onOpenChange,
  project,
  onSave,
  onDelete,
}: EditProjectModalProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [category, setCategory] = useState(project?.category || "");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state with project prop when it changes
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setThumbnail(project.thumbnail);
    }
  }, [project]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        category,
        thumbnail,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
    setShowDeleteConfirm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 20MB for Netlify Blobs)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        alert(
          `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum file size is 20MB. For larger files, please use an external URL like Squarespace CDN or Framer.`
        );
        return;
      }

      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result as string;
          
          // Try to upload to Netlify Blobs immediately
          try {
            const imageId = `project-thumbnail-${project?.id || 'new'}-${Date.now()}`;
            const response = await fetch('/.netlify/functions/upload-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageId,
                imageData: dataUrl,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log(`[EditProjectModal] ✅ Uploaded thumbnail to Netlify Blobs: ${result.url}`);
              // Use the Netlify Blob URL instead of base64
              setThumbnail(result.url);
            } else {
              console.warn(`[EditProjectModal] Failed to upload to Netlify Blobs, using base64 fallback`);
              // Fallback to base64 if Netlify Blobs fails
              setThumbnail(dataUrl);
            }
          } catch (error) {
            console.warn(`[EditProjectModal] Error uploading to Netlify Blobs, using base64 fallback:`, error);
            // Fallback to base64 if Netlify Blobs fails
            setThumbnail(dataUrl);
          }
          
          setIsUploading(false);
        };
        reader.onerror = () => {
          alert("Error reading file. Please try again.");
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert("Error uploading file. Please try again.");
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold">Delete this project?</p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                project "{project?.title || "this project"}" and all its
                content.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category / Tagline</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., AI & Aviation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Cover Image</Label>
                <p className="text-xs text-muted-foreground">
                  You can upload files up to 20MB (including GIFs). For even
                  larger files, use an external URL (Squarespace CDN, Framer,
                  etc.).
                </p>
                <div className="space-y-3">
                  {thumbnail && (
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-border">
                      <img
                        src={thumbnail}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1"
                    />

                    <Button
                      variant="outline"
                      className="relative"
                      asChild
                      disabled={isUploading}
                    >
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {isUploading ? (
                          <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <UploadIcon className="h-4 w-4 mr-2" />
                        )}
                        {isUploading ? "Uploading..." : "Upload"}
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                          disabled={isUploading}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isUploading}>
                  {isSaving ? (
                    <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
