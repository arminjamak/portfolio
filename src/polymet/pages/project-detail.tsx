import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProjectById,
  getProjects,
  updateProject,
} from "@/polymet/data/projects-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedLogo } from "@/polymet/components/animated-logo";
import { ArrowLeftIcon, EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useAdmin } from "@/polymet/components/admin-context";
import {
  ContentEditor,
  ContentBlock,
} from "@/polymet/components/content-editor";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    year: "",
    client: "",
    role: "",
    category: "",
  });
  const justSavedMetadata = useRef(false);

  // Load projects data
  useEffect(() => {
    const loadData = async () => {
      const projects = await getProjects();
      setProjectsData(projects);
    };
    loadData();
  }, []);

  // Reload project when id changes
  useEffect(() => {
    const loadProject = async () => {
      console.log("\n[loadProject useEffect] 🔄 Loading project with id:", id);
      setLoading(true);
      const freshProject = await getProjectById(id || "");
      console.log("[loadProject useEffect] ✅ Project loaded:", {
        id: freshProject?.id,
        title: freshProject?.title,
        year: freshProject?.year,
        client: freshProject?.client,
        role: freshProject?.role,
        category: freshProject?.category,
      });
      console.log(
        "[loadProject useEffect] 🔍 FULL PROJECT DATA:",
        freshProject
      );
      setProject(freshProject);
      setLoading(false);
    };
    loadProject();
  }, [id]);

  // Initialize content from project history and metadata
  useEffect(() => {
    if (project) {
      console.log(
        "\n[useEffect] 🔄 Project changed, updating content and metadata"
      );
      console.log("[useEffect] isAdmin:", isAdmin);
      console.log("[useEffect] isEditingMeta:", isEditingMeta);
      console.log("[useEffect] Project data loaded:", {
        title: project.title,
        description: project.description,
        year: project.year,
        client: project.client,
        role: project.role,
        category: project.category,
        historyLength: project.history.length,
      });

      // Always re-initialize content from project history when project changes
      console.log("[useEffect] Initializing content from project history");
      const blocks: ContentBlock[] = [];
      project.history.forEach((phase: any, index: number) => {
        // Handle special markers
        if (phase.phase === "__DIVIDER__") {
          blocks.push({
            id: `phase-${index}-divider`,
            type: "divider",
            content: "",
          });
        } else if (phase.phase === "__SPACER__") {
          blocks.push({
            id: `phase-${index}-spacer`,
            type: "spacer",
            content: "",
          });
        } else if (phase.phase === "__TEXT__") {
          // Standalone text block without heading
          blocks.push({
            id: `phase-${index}-text`,
            type: "body",
            content: phase.content,
          });
        } else if (phase.phase === "__IMAGE__") {
          // Standalone image block(s) without heading
          if (phase.images) {
            phase.images.forEach((image: any, imageIndex: number) => {
              blocks.push({
                id: `phase-${index}-image-${imageIndex}`,
                type: "image",
                content: image.url,
                caption: image.caption,
              });
            });
          }
        } else {
          // Regular phase with title and content
          blocks.push({
            id: `phase-${index}-title`,
            type: "h1",
            content: phase.phase,
          });
          blocks.push({
            id: `phase-${index}-content`,
            type: "body",
            content: phase.content,
          });
          if (phase.images) {
            phase.images.forEach((image: any, imageIndex: number) => {
              blocks.push({
                id: `phase-${index}-image-${imageIndex}`,
                type: "image",
                content: image.url,
                caption: image.caption,
              });
            });
          }
        }
      });
      console.log("[useEffect] Created", blocks.length, "content blocks");
      setContent(blocks);

      // Only sync metadata if we're NOT in edit mode AND we didn't just save
      if (!isEditingMeta && !justSavedMetadata.current) {
        const newMetadata = {
          title: project.title,
          description: project.description,
          year: project.year,
          client: project.client,
          role: project.role,
          category: project.category,
        };
        console.log(
          "[useEffect] 📋 Syncing metadata state with project data:",
          newMetadata
        );
        setMetadata(newMetadata);
        console.log("[useEffect] ✅ Metadata sync complete\n");
      } else if (justSavedMetadata.current) {
        console.log(
          "[useEffect] ⏭️ Skipping metadata sync (just saved metadata)\n"
        );
        justSavedMetadata.current = false; // Reset the flag
      } else {
        console.log(
          "[useEffect] ⏭️ Skipping metadata sync (edit mode active)\n"
        );
      }
    }
  }, [project, isEditingMeta]);

  const handleSave = async (newContent: ContentBlock[]) => {
    console.log("\n\n🔵🔵🔵 SAVE BUTTON CLICKED! 🔵🔵🔵\n");
    console.log(
      "[handleSave] 🔵 SAVE STARTED with",
      newContent.length,
      "blocks"
    );

    if (!project) {
      console.error("[handleSave] ❌ No project found!");
      return;
    }

    try {
      // Convert content blocks back to history format
      const history: { phase: string; content: string; images?: { url: string; caption?: string }[] }[] = [];
      let currentPhase: {
        phase: string;
        content: string;
        images?: { url: string; caption?: string }[];
      } | null = null;

      newContent.forEach((block, index) => {
        console.log(
          `[handleSave] Processing block ${index}:`,
          block.type,
          block.content ? block.content.substring(0, 50) : "(empty)"
        );

        if (block.type === "h1" || block.type === "h2") {
          // Save previous phase if exists
          if (currentPhase) {
            console.log("[handleSave] Saving phase:", currentPhase.phase);
            history.push(currentPhase);
          }
          // Start new phase
          currentPhase = {
            phase: block.content,
            content: "",
          };
        } else if (block.type === "body") {
          if (currentPhase) {
            // Add to existing phase
            currentPhase.content = block.content;
          } else {
            // Standalone body text without a heading - create a phase with empty title
            history.push({
              phase: "__TEXT__",
              content: block.content,
            });
          }
        } else if (block.type === "image") {
          const newImage = {
            url: block.content,
            caption: block.caption,
          };
          if (currentPhase) {
            // Add to existing phase
            if (!currentPhase.images) {
              currentPhase.images = [];
            }
            currentPhase.images.push(newImage);
          } else {
            // Standalone image without a heading, create a new phase for it
            history.push({
              phase: "__IMAGE__",
              content: "",
              images: [newImage],
            });
          }
        } else if (block.type === "divider" || block.type === "spacer") {
          // Dividers and spacers need to be saved as standalone phases
          if (currentPhase) {
            console.log("[handleSave] Saving phase before divider/spacer:", currentPhase.phase);
            history.push(currentPhase);
            currentPhase = null;
          }
          // Create a special phase for divider/spacer
          history.push({
            phase: block.type === "divider" ? "__DIVIDER__" : "__SPACER__",
            content: "",
          });
        }
      });

      // Save last phase
      if (currentPhase) {
        console.log("[handleSave] Saving final phase:", currentPhase.phase);
        history.push(currentPhase);
      }

      console.log(
        "[handleSave] ✅ Converted to",
        history.length,
        "history phases"
      );
      console.log("[handleSave] 🔄 Calling updateProject...");

      // Update project in localStorage
      await updateProject(project.id, { history });

      console.log("[handleSave] ✅ updateProject completed");
      console.log("[handleSave] 🔄 Reloading project from localStorage...");

      // Reload project from localStorage
      const updatedProject = await getProjectById(project.id);

      console.log("[handleSave] ✅ Project reloaded:", {
        title: updatedProject?.title,
        historyLength: updatedProject?.history.length,
      });

      setProject(updatedProject);
      setContent(newContent);
      setIsEditing(false);

      console.log("[handleSave] 🎉 SAVE COMPLETE!");
    } catch (error) {
      console.error("[handleSave] ❌ ERROR:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleSaveMeta = async () => {
    console.log("\n\n🟢🟢🟢 METADATA SAVE CLICKED! 🟢🟢🟢\n");
    console.log("[handleSaveMeta] 🔵 METADATA SAVE STARTED");
    console.log("[handleSaveMeta] Current metadata state:", metadata);
    console.log("[handleSaveMeta] Project ID:", project?.id);

    if (!project) {
      console.error("[handleSaveMeta] ❌ No project found!");
      return;
    }

    try {
      console.log("[handleSaveMeta] 📝 Saving these updates:", {
        title: metadata.title,
        description: metadata.description,
        year: metadata.year,
        client: metadata.client,
        role: metadata.role,
        category: metadata.category,
      });

      // Set the flag to prevent useEffect from overwriting
      justSavedMetadata.current = true;
      console.log("[handleSaveMeta] 🚩 Set justSavedMetadata flag to true");

      await updateProject(project.id, metadata);

      console.log("[handleSaveMeta] ✅ updateProject completed");
      console.log("[handleSaveMeta] 🔄 Reloading project from localStorage...");

      // Reload project from localStorage
      const updatedProject = await getProjectById(project.id);

      console.log("[handleSaveMeta] ✅ Project reloaded from localStorage:", {
        title: updatedProject?.title,
        description: updatedProject?.description,
        year: updatedProject?.year,
        client: updatedProject?.client,
        role: updatedProject?.role,
        category: updatedProject?.category,
      });

      setProject(updatedProject);

      // Update metadata state with the fresh data from localStorage
      const freshMetadata = {
        title: updatedProject?.title || "",
        description: updatedProject?.description || "",
        year: updatedProject?.year || "",
        client: updatedProject?.client || "",
        role: updatedProject?.role || "",
        category: updatedProject?.category || "",
      };
      console.log(
        "[handleSaveMeta] 📋 Setting metadata state to:",
        freshMetadata
      );
      setMetadata(freshMetadata);

      setIsEditingMeta(false);
      console.log("[handleSaveMeta] 🎉 METADATA SAVE COMPLETE!\n\n");
    } catch (error) {
      console.error("[handleSaveMeta] ❌ ERROR:", error);
      alert("Failed to save metadata. Please try again.");
    }
  };

  const handleCancelMeta = () => {
    if (project) {
      setMetadata({
        title: project.title,
        description: project.description,
        year: project.year,
        client: project.client,
        role: project.role,
        category: project.category,
      });
    }
    setIsEditingMeta(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="text-center">
          <div style={{ transform: 'scale(2)' }}>
            <AnimatedLogo />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Project not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="group">
            <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Work
          </Button>
        </Link>

        {/* Project Header */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              {isEditingMeta ? (
                <div className="space-y-4">
                  <Input
                    value={metadata.title}
                    onChange={(e) =>
                      setMetadata({ ...metadata, title: e.target.value })
                    }
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight h-auto py-2 px-3 border-2"
                    placeholder="Project Title"
                  />

                  <Textarea
                    value={metadata.description}
                    onChange={(e) =>
                      setMetadata({ ...metadata, description: e.target.value })
                    }
                    className="text-lg md:text-xl text-muted-foreground resize-none border-2"
                    rows={3}
                    placeholder="Project Description"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {metadata.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                    {metadata.description}
                  </p>
                </>
              )}
            </div>
            {isAdmin && !isEditingMeta && (
              <Button
                onClick={() => {
                  console.log("\n\n📝📝📝 EDIT METADATA CLICKED! 📝📝📝\n");
                  console.log("[Edit Button] isAdmin:", isAdmin);
                  console.log("[Edit Button] isEditingMeta:", isEditingMeta);
                  console.log("[Edit Button] Setting isEditingMeta to true");
                  console.log("[Edit Button] Current metadata:", metadata);
                  setIsEditingMeta(true);
                }}
                variant="outline"
                size="sm"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Project Meta */}
          <div className="space-y-4">
            {isEditingMeta ? (
              <div className="space-y-4 py-6 border-y border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Year
                    </label>
                    <Input
                      value={metadata.year}
                      onChange={(e) =>
                        setMetadata({ ...metadata, year: e.target.value })
                      }
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Client
                    </label>
                    <Input
                      value={metadata.client}
                      onChange={(e) =>
                        setMetadata({ ...metadata, client: e.target.value })
                      }
                      placeholder="Client Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Role
                    </label>
                    <Input
                      value={metadata.role}
                      onChange={(e) =>
                        setMetadata({ ...metadata, role: e.target.value })
                      }
                      placeholder="Your Role"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Category
                    </label>
                    <Input
                      value={metadata.category}
                      onChange={(e) =>
                        setMetadata({ ...metadata, category: e.target.value })
                      }
                      placeholder="Category"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(
                        "\n\n💾💾💾 SAVE METADATA BUTTON CLICKED! 💾💾💾\n"
                      );
                      console.log("[Save Button] About to call handleSaveMeta");
                      console.log("[Save Button] Current metadata:", metadata);
                      handleSaveMeta();
                    }}
                    size="sm"
                    type="button"
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("\n\n❌❌❌ CANCEL BUTTON CLICKED! ❌❌❌\n");
                      handleCancelMeta();
                    }}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Year</p>
                  <p className="font-medium">{metadata.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Client</p>
                  <p className="font-medium">{metadata.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <p className="font-medium">{metadata.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">{metadata.category}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Content */}
        <div className="space-y-12">
          {isAdmin && !isEditing && (
            <div className="flex items-center justify-end">
              <Button
                onClick={() => {
                  console.log("\n\n✏️✏️✏️ EDIT CONTENT CLICKED! ✏️✏️✏️\n");
                  setIsEditing(true);
                }}
                variant="outline"
                size="sm"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
            </div>
          )}
          {isEditing ? (
            <ContentEditor
              initialContent={content}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-12">
              {content.map((block, index) => {
                const prevBlock = content[index - 1];
                const isParagraphAfterHeading =
                  block.type === "body" &&
                  (prevBlock?.type === "h1" || prevBlock?.type === "h2");

                if (block.type === "h1") {
                  return (
                    <h1 key={block.id} className="text-3xl font-bold">
                      {block.content}
                    </h1>
                  );
                }
                if (block.type === "h2") {
                  return (
                    <h2 key={block.id} className="text-xl font-semibold">
                      {block.content}
                    </h2>
                  );
                }
                if (block.type === "divider") {
                  return (
                    <div key={block.id} className="py-6">
                      <div className="border-t border-border" />
                    </div>
                  );
                }
                if (block.type === "spacer") {
                  return (
                    <div key={block.id} className="py-12">
                      {/* Empty space */}
                    </div>
                  );
                }
                if (block.type === "image") {
                  return (
                    <div key={block.id} className="space-y-2">
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img
                          src={block.content} // This is the image URL
                          alt={block.caption || "Project image"}
                          className="w-full h-auto"
                        />
                      </div>
                      {block.caption && (
                        <p className="text-sm text-muted-foreground text-left">
                          {block.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                return (
                  <p
                    key={block.id}
                    className="text-muted-foreground leading-relaxed max-w-4xl"
                    style={
                      isParagraphAfterHeading
                        ? { marginTop: "24px" }
                        : undefined
                    }
                  >
                    {block.content}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Navigation */}
        <div className="pt-12 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {projectsData.map((proj) =>
              proj.id === id ? (
                <span
                  key={proj.id}
                  className="text-muted-foreground cursor-default"
                >
                  {proj.title}
                </span>
              ) : (
                <Link
                  key={proj.id}
                  to={`/work/${proj.id}`}
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  {proj.title}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
