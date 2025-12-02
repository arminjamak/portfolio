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
import { Project } from "@/polymet/data/projects-data";
import { SaveIcon, TrashIcon, UploadIcon, LoaderIcon } from "lucide-react";
import { uploadToImageKitDirectFormData } from "@/polymet/utils/imagekit-direct-upload";

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
      console.log(`[EditProjectModal] Saving project with thumbnail: ${thumbnail}`);
      await onSave({
        title,
        category,
        thumbnail,
      });
      console.log(`[EditProjectModal] ✅ Project saved successfully`);
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
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Generate unique ID for upload
      const imageId = `project-thumbnail-${project?.id || 'new'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileSizeMB = file.size / 1024 / 1024;
      console.log(`[EditProjectModal] Direct uploading ${imageId} to ImageKit (${fileSizeMB.toFixed(2)}MB)...`);
      
      // Use direct client-side upload to ImageKit
      const result = await uploadToImageKitDirectFormData(file, imageId);
      
      if (result.success && result.url) {
        console.log(`[EditProjectModal] ✅ Direct upload successful: ${result.resizedUrl}`);
        setThumbnail(result.resizedUrl);
      } else {
        console.error(`[EditProjectModal] Direct upload failed: ${result.error}`);
        alert(`Upload failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error(`[EditProjectModal] Direct upload error:`, error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
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
                  You can upload files up to 25MB (including GIFs) directly to ImageKit. For even
                  larger files, use an external URL (Squarespace CDN, Framer, etc.).
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
