import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrashIcon,
  ImageIcon,
  TypeIcon,
  GripVerticalIcon,
  MinusIcon,
  UploadIcon,
  LoaderIcon,
  PlusCircleIcon,
  SpaceIcon,
} from "lucide-react";
import { uploadToImageKitDirectFormData } from "@/polymet/utils/imagekit-direct-upload";
import { isVideoUrl } from "@/polymet/utils/media-utils";

export interface ContentBlock {
  id: string;
  type: "h1" | "h2" | "body" | "image" | "divider" | "spacer";
  content: string;
  caption?: string; // Optional caption for images
}

interface ContentEditorProps {
  initialContent: ContentBlock[];
  onSave: (content: ContentBlock[]) => void;
  onCancel: () => void;
}

export function ContentEditor({
  initialContent,
  onSave,
  onCancel,
}: ContentEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingBlocks, setUploadingBlocks] = useState<Set<string>>(
    new Set()
  );
  const [showInsertMenu, setShowInsertMenu] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "body",
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const addImageBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "image",
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const addDividerBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "divider",
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const addSpacerBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: "spacer",
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };

  const insertBlockAt = (
    index: number,
    type: "body" | "image" | "divider" | "spacer"
  ) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: "",
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    setBlocks(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleSave = () => {
    console.log("\n\n🟣🟣🟣 ContentEditor handleSave CLICKED! 🟣🟣🟣");
    console.log("[ContentEditor] Calling onSave with", blocks.length, "blocks");
    onSave(blocks);
    console.log("[ContentEditor] onSave called successfully");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    setBlocks(newBlocks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    // Check file size (ImageKit supports up to 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      alert(
        `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum file size is 25MB for direct uploads.`
      );
      return;
    }

    // Mark block as uploading
    setUploadingBlocks((prev) => new Set(prev).add(blockId));

    try {
      const imageId = `content-${blockId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[ContentEditor] Direct uploading ${imageId} to ImageKit...`);
      
      // Use direct client-side upload to ImageKit
      const result = await uploadToImageKitDirectFormData(file, imageId);
      
      if (result.success) {
        console.log(`[ContentEditor] ✅ Direct upload successful: ${result.resizedUrl}`);
        updateBlock(blockId, { content: result.resizedUrl });
      } else {
        console.error(`[ContentEditor] Direct upload failed: ${result.error}`);
        alert(`Upload failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      // Remove from uploading set
      setUploadingBlocks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
    }
  };

  const triggerFileInput = (blockId: string) => {
    fileInputRefs.current[blockId]?.click();
  };

  return (
    <div className="space-y-6 bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Content</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addTextBlock}>
            <TypeIcon className="mr-2 h-4 w-4" />
            Add Text
          </Button>
          <Button variant="outline" size="sm" onClick={addImageBlock}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <Button variant="outline" size="sm" onClick={addDividerBlock}>
            <MinusIcon className="mr-2 h-4 w-4" />
            Add Divider
          </Button>
          <Button variant="outline" size="sm" onClick={addSpacerBlock}>
            <SpaceIcon className="mr-2 h-4 w-4" />
            Add Spacer
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={`container-${block.id}`}>
            <div
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-muted/50 border border-border rounded-lg p-4 space-y-3 cursor-move transition-all ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
            <div className="flex items-center gap-3">
              <GripVerticalIcon className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />

              <span className="text-sm text-muted-foreground">
                Block {index + 1}
              </span>
              <div className="ml-auto flex items-center gap-2">
                {block.type !== "image" && block.type !== "divider" && block.type !== "spacer" && (
                  <Select
                    value={block.type}
                    onValueChange={(value: any) =>
                      updateBlock(block.id, { type: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h1">Heading 1</SelectItem>
                      <SelectItem value="h2">Heading 2</SelectItem>
                      <SelectItem value="body">Body Text</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {block.type === "divider" && (
                  <span className="text-sm text-muted-foreground">Divider</span>
                )}
                {block.type === "spacer" && (
                  <span className="text-sm text-muted-foreground">Spacer</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlock(block.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {block.type === "divider" ? (
              <div className="py-2">
                <div className="border-t border-border" />
              </div>
            ) : block.type === "spacer" ? (
              <div className="py-6">
                <div className="text-center text-sm text-muted-foreground">
                  Empty Space
                </div>
              </div>
            ) : block.type === "image" ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  You can upload files up to 25MB (including GIFs and MP4 videos) directly to ImageKit. For even
                  larger files, use an external URL (Squarespace CDN, Framer, etc.).
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, { content: e.target.value })
                    }
                    className="flex-1"
                    disabled={uploadingBlocks.has(block.id)}
                  />

                  <input
                    ref={(el) => {
                      fileInputRefs.current[block.id] = el;
                    }}
                    type="file"
                    className="hidden"
                    data-testid="image-upload-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(block.id, file);
                    }}
                    disabled={uploadingBlocks.has(block.id)}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerFileInput(block.id)}
                    disabled={uploadingBlocks.has(block.id)}
                  >
                    {uploadingBlocks.has(block.id) ? (
                      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadIcon className="mr-2 h-4 w-4" />
                    )}
                    {uploadingBlocks.has(block.id)
                      ? "Uploading..."
                      : block.content
                        ? "Replace Image"
                        : "Upload Image"}
                  </Button>
                </div>

                {block.content && (
                  <div className="border border-border rounded overflow-hidden">
                    {isVideoUrl(block.content) ? (
                      <video
                        src={block.content}
                        className="w-full h-48 object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={block.content}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                )}
                
                <Input
                  placeholder="Image caption (optional)"
                  value={block.caption || ""}
                  onChange={(e) =>
                    updateBlock(block.id, { caption: e.target.value })
                  }
                  className="text-sm"
                  disabled={uploadingBlocks.has(block.id)}
                />
              </div>
            ) : block.type === "body" ? (
              <Textarea
                placeholder="Enter text content..."
                value={block.content}
                onChange={(e) =>
                  updateBlock(block.id, { content: e.target.value })
                }
                rows={4}
              />
            ) : (
              <Input
                placeholder={`Enter ${block.type === "h1" ? "heading 1" : "heading 2"} text...`}
                value={block.content}
                onChange={(e) =>
                  updateBlock(block.id, { content: e.target.value })
                }
              />
            )}
          </div>
          
          {/* Insert menu after each block */}
          <div
            className="relative h-4 group"
            onMouseLeave={() => {
              setShowInsertMenu(null);
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full border-t border-transparent group-hover:border-border/50 transition-colors" />
              <div className="absolute">
                {showInsertMenu === index + 1 ? (
                  <div className="flex gap-1 bg-background border border-border rounded-lg shadow-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        insertBlockAt(index + 1, "body");
                        setShowInsertMenu(null);
                      }}
                      className="h-7 px-2"
                    >
                      <TypeIcon className="h-3 w-3 mr-1" />
                      Text
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        insertBlockAt(index + 1, "image");
                        setShowInsertMenu(null);
                      }}
                      className="h-7 px-2"
                    >
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        insertBlockAt(index + 1, "divider");
                        setShowInsertMenu(null);
                      }}
                      className="h-7 px-2"
                    >
                      <MinusIcon className="h-3 w-3 mr-1" />
                      Divider
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        insertBlockAt(index + 1, "spacer");
                        setShowInsertMenu(null);
                      }}
                      className="h-7 px-2"
                    >
                      <SpaceIcon className="h-3 w-3 mr-1" />
                      Spacer
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInsertMenu(index + 1)}
                    className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border hover:bg-muted"
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>
              No content blocks yet. Add text or image blocks to get started.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={uploadingBlocks.size > 0}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={uploadingBlocks.size > 0}>
          {uploadingBlocks.size > 0 ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Uploading images...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
