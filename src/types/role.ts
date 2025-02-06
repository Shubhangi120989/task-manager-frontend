import { Project } from "./project";
import { User } from "./user";

export interface Role{
    id: string,
    role: "VIEWER" | "EDITOR",
    user:User,
    project:Project


}