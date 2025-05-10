import { useState, useCallback } from "react";
import { Project } from "@shared/schema";

export function useProject() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  return {
    selectedProject,
    setSelectedProject: selectProject,
  };
}
