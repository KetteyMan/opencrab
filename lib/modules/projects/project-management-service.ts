import {
  createProject,
  deleteProject,
} from "@/lib/projects/project-store";

export type ProjectCreator = typeof createProject;
export type ProjectRemover = typeof deleteProject;

type ProjectManagementServiceDependencies = {
  create?: ProjectCreator;
  remove?: ProjectRemover;
};

export function createProjectManagementService(
  dependencies: ProjectManagementServiceDependencies = {},
) {
  const create = dependencies.create ?? createProject;
  const remove = dependencies.remove ?? deleteProject;

  return {
    create,
    remove,
  };
}

export const projectManagementService = createProjectManagementService();
