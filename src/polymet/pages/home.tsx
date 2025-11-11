import { useState, useEffect } from "react";
import { ProjectGrid } from "@/polymet/components/project-grid";
import {
  getProjects,
  Project,
  updateProject,
  deleteProject,
  addProject,
  resetProjectsData,
} from "@/polymet/data/projects-data";
import { getHomeData, updateHomeData } from "@/polymet/data/home-data";
import { useAdmin } from "@/polymet/components/admin-context";
import { AddProjectModal } from "@/polymet/components/add-project-modal";
import { EditProjectModal } from "@/polymet/components/edit-project-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, RotateCcwIcon, EditIcon, SaveIcon, XIcon } from "lucide-react";
import { fixBrokenProjects } from "@/polymet/data/fix-projects";

export function Home() {
  const { isAdmin } = useAdmin();
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerData, setHeaderData] = useState({ title: "", subtitle: "" });

  // Load projects and home data on mount
  useEffect(() => {
    const loadData = async () => {
      // Fix any broken IndexedDB references first
      try {
        await fixBrokenProjects();
      } catch (error) {
        console.warn('[Home] Failed to fix broken projects:', error);
      }
      
      const loadedProjects = await getProjects();
      setProjects(loadedProjects);
      const homeData = getHomeData();
      setHeaderData(homeData);
    };
    loadData();
  }, []);

  const handleAddProject = async (project: {
    title: string;
    category: string;
    thumbnail: string;
  }) => {
    await addProject(project);
    const updatedProjects = await getProjects();
    setProjects(updatedProjects);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditProjectModalOpen(true);
  };

  const handleSaveProject = async (updates: Partial<Project>) => {
    if (selectedProject) {
      await updateProject(selectedProject.id, updates);
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
      // Find the updated project from the fresh data
      const updatedProject = updatedProjects.find(
        (p) => p.id === selectedProject.id
      );
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  const handleDeleteProject = async () => {
    if (selectedProject) {
      await deleteProject(selectedProject.id);
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
      setEditProjectModalOpen(false);
    }
  };

  const handleSaveHeader = async () => {
    await updateHomeData(headerData);
    setIsEditingHeader(false);
  };

  const handleCancelHeader = () => {
    const homeData = getHomeData();
    setHeaderData(homeData);
    setIsEditingHeader(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="space-y-8 md:space-y-12">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              {isEditingHeader ? (
                <div className="space-y-4">
                  <Input
                    value={headerData.title}
                    onChange={(e) =>
                      setHeaderData({ ...headerData, title: e.target.value })
                    }
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight h-auto py-2 px-3 border-2"
                    placeholder="Title"
                  />
                  <Textarea
                    value={headerData.subtitle}
                    onChange={(e) =>
                      setHeaderData({ ...headerData, subtitle: e.target.value })
                    }
                    className="text-lg md:text-xl text-muted-foreground resize-none border-2"
                    rows={2}
                    placeholder="Subtitle"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveHeader} size="sm">
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelHeader} variant="outline" size="sm">
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {headerData.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                    {headerData.subtitle}
                  </p>
                </>
              )}
            </div>
            {isAdmin && !isEditingHeader && (
              <Button
                onClick={() => setIsEditingHeader(true)}
                variant="outline"
                size="sm"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {isAdmin && !isEditingHeader && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (
                      confirm(
                        "Reset all projects to default? This will remove all your changes."
                      )
                    ) {
                      await resetProjectsData();
                      const updatedProjects = await getProjects();
                      setProjects(updatedProjects);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCcwIcon className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={() => setAddProjectModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Project
                </Button>
              </div>
            )}
          </div>
        </div>

        <ProjectGrid
          projects={projects}
          isAdmin={isAdmin}
          onEditProject={handleEditProject}
        />
      </div>

      <AddProjectModal
        open={addProjectModalOpen}
        onOpenChange={setAddProjectModalOpen}
        onAddProject={handleAddProject}
      />

      {selectedProject && (
        <EditProjectModal
          key={selectedProject.id}
          open={editProjectModalOpen}
          onOpenChange={setEditProjectModalOpen}
          project={selectedProject}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
}
