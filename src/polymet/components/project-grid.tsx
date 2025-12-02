import { ProjectCard } from "@/polymet/components/project-card";
import { Project } from "@/polymet/data/projects-data";

interface ProjectGridProps {
  projects: Project[];
  isAdmin?: boolean;
  onEditProject?: (project: Project) => void;
}

export function ProjectGrid({
  projects,
  isAdmin,
  onEditProject,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isAdmin={isAdmin}
          onEdit={() => onEditProject?.(project)}
        />
      ))}
    </div>
  );
}
