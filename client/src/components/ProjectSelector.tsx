import React, { useEffect } from "react";
import { Project } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface ProjectSelectorProps {
  selectedProject: Project | null;
  onProjectChange: (project: Project) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProject, onProjectChange }) => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Set the first project as selected when data loads
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      onProjectChange(projects[0]);
    }
  }, [projects, selectedProject, onProjectChange]);

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4 flex items-center">
      <div className="relative flex-1 max-w-md">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 border-r border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <select 
            className="w-full py-2 px-3 focus:outline-none text-sm"
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const project = projects?.find(p => p.id === selectedId) || null;
              if (project) onProjectChange(project);
            }}
            value={selectedProject?.id || ""}
            disabled={isLoading || !projects?.length}
          >
            {isLoading && <option>Loading projects...</option>}
            {error && <option>Error loading projects</option>}
            {!isLoading && !error && !projects?.length && <option>No projects available</option>}
            
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.path})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-2">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Project
        </button>
        <button className="bg-metamask-blue hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ethereum Mainnet
        </button>
      </div>
    </div>
  );
};

export default ProjectSelector;
