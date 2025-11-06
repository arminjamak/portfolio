import { Link } from "react-router-dom";
import { Project } from "@/polymet/data/projects-data";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export function ProjectCard({ project, isAdmin, onEdit }: ProjectCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <Link
      to={`/work/${project.id}`}
      className="group block overflow-hidden rounded-lg bg-card border border-border hover:border-foreground/20 transition-all duration-300 relative"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {isAdmin && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button onClick={handleEditClick} size="lg" className="shadow-lg">
              <EditIcon className="h-5 w-5 mr-2" />
              Edit Project
            </Button>
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground">{project.category}</p>
      </div>
    </Link>
  );
}
