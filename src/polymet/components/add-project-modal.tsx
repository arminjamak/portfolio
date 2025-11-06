import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon, LoaderIcon } from "lucide-react";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: {
    title: string;
    category: string;
    thumbnail: string;
  }) => void;
}

export function AddProjectModal({
  open,
  onOpenChange,
  onAddProject,
}: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 20MB)
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        alert(
          `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum file size is 20MB. For larger files, please use an external URL.`
        );
        return;
      }

      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setImageUrl(dataUrl);
          setImagePreview(dataUrl);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !imageUrl) {
      alert("Please fill in all fields");
      return;
    }

    onAddProject({
      title,
      category,
      thumbnail: imageUrl,
    });

    // Reset form
    setTitle("");
    setCategory("");
    setImageUrl("");
    setImagePreview("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project by filling in the details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Tagline / Category</Label>
            <Input
              id="category"
              placeholder="e.g., AI Avatar Editor"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover Image</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                placeholder="Enter image URL or upload a file"
                value={imageUrl}
                onChange={handleImageChange}
                required
                className="flex-1"
              />

              <Button
                type="button"
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
                    onChange={handleFileUpload}
                    className="sr-only"
                    disabled={isUploading}
                  />
                </label>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              You can upload files up to 20MB (including GIFs) or enter an image
              URL
            </p>
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="border border-border rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={() => setImagePreview("")}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <UploadIcon className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
