import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileTextIcon, EditIcon, UploadIcon, LoaderIcon, SaveIcon, XIcon } from "lucide-react";
import { useAdmin } from "@/polymet/components/admin-context";
import {
  ContentEditor,
  ContentBlock,
} from "@/polymet/components/content-editor";
import { getAboutData, updateAboutData } from "@/polymet/data/about-data";

export function About() {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [profileImage, setProfileImage] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await getAboutData();
      setContent(data.content);
      setProfileImage(data.profileImage);
    };
    loadData();
  }, []);

  const handleSave = async (newContent: ContentBlock[]) => {
    await updateAboutData({ content: newContent });
    setContent(newContent);
    setIsEditing(false);
  };

  const handleImageUpload = async (file: File) => {
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
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
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
  };

  const handleSaveImage = async () => {
    await updateAboutData({ profileImage: tempImageUrl });
    setProfileImage(tempImageUrl);
    setIsEditingImage(false);
  };

  const handleCancelImage = () => {
    setTempImageUrl(profileImage);
    setIsEditingImage(false);
  };

  const handleEditImage = () => {
    setTempImageUrl(profileImage);
    setIsEditingImage(true);
  };
  const handleCVClick = () => {
    // Replace this URL with the actual Google Drive link
    window.open(
      "https://drive.google.com/file/d/YOUR_CV_FILE_ID/view",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border relative group">
              <img
                src={isEditingImage ? tempImageUrl : profileImage}
                alt="Armin Jamak"
                className="w-full h-full object-cover"
              />
              {isAdmin && !isEditing && !isEditingImage && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={handleEditImage}
                    variant="secondary"
                    size="sm"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Image
                  </Button>
                </div>
              )}
            </div>
            {isEditingImage && (
              <div className="space-y-3 p-4 bg-muted/50 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Upload an image (up to 20MB) or enter an external URL
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    className="flex-1"
                    disabled={isUploading}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadIcon className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveImage} size="sm" disabled={isUploading}>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancelImage} variant="outline" size="sm" disabled={isUploading}>
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <ContentEditor
                    initialContent={content}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {content.map((block) => {
                        if (block.type === "h1") {
                          return (
                            <h1
                              key={block.id}
                              className="text-4xl md:text-5xl font-bold tracking-tight"
                            >
                              {block.content}
                            </h1>
                          );
                        }
                        if (block.type === "h2") {
                          return (
                            <h2
                              key={block.id}
                              className="text-2xl md:text-3xl font-semibold"
                            >
                              {block.content}
                            </h2>
                          );
                        }
                        if (block.type === "image") {
                          return (
                            <img
                              key={block.id}
                              src={block.content}
                              alt="Content"
                              className="w-full rounded-lg"
                            />
                          );
                        }
                        return (
                          <p
                            key={block.id}
                            className="text-muted-foreground leading-relaxed"
                          >
                            {block.content}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {isAdmin && !isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="ml-4"
                >
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <Button size="lg" onClick={handleCVClick} className="group">
                <FileTextIcon className="mr-2 h-5 w-5" />
                View CV
              </Button>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="mailto:hello@arminjamak.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@arminjamak.com
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Tools Section */}
        <div className="mt-16 md:mt-24 space-y-8">
          <h2 className="text-3xl font-bold">Skills & Tools</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Design</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>User Research</li>
                <li>Information Architecture</li>
                <li>Interaction Design</li>
                <li>Visual Design</li>
                <li>Prototyping</li>
                <li>Design Systems</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Figma</li>
                <li>Adobe Creative Suite</li>
                <li>Sketch</li>
                <li>Principle</li>
                <li>Framer</li>
                <li>Miro</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Development</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>HTML & CSS</li>
                <li>JavaScript</li>
                <li>React</li>
                <li>Tailwind CSS</li>
                <li>Git</li>
                <li>Responsive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
