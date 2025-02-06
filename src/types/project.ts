import { Role } from "./role";
import { User } from "./user";

export interface Project {
    projectId: string;
    title: string;
    user: User;
    description: string;
    createdAt: string;
    updatedAt?: string;
    roles?: Role[];
  }