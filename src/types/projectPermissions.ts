// import { s } from "framer-motion/client";

export enum Action {
    CREATE = "CREATE",
    VIEW = "VIEW",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    ADD_USER = "ADD_USER",
    VIEW_ROLES= "VIEW_ROLES",
  }
  
 export enum RoleType {
    VIEWER = "VIEWER",
    EDITOR = "EDITOR",
    OWNER = "OWNER",
  }
  
  const projectPermissions: Record<RoleType, Set<Action>> = {
    [RoleType.VIEWER]: new Set([Action.VIEW,Action.VIEW_ROLES]), // Can view and view roles
    [RoleType.EDITOR]: new Set([Action.VIEW, Action.UPDATE,Action.VIEW_ROLES]),
    [RoleType.OWNER]: new Set(Object.values(Action)), // All actions
  };
  
  const taskPermissions: Record<RoleType, Set<Action>> = {
    [RoleType.VIEWER]: new Set([Action.VIEW]),
    [RoleType.EDITOR]: new Set([Action.VIEW, Action.UPDATE, Action.CREATE, Action.DELETE]),
    [RoleType.OWNER]: new Set(Object.values(Action)), // All actions
  };

  const rolePermissions: Record<RoleType, Set<Action>> = {
    [RoleType.VIEWER]: new Set([Action.VIEW]), // Can view and view roles
    [RoleType.EDITOR]: new Set([Action.VIEW,]),
    [RoleType.OWNER]: new Set([Action.DELETE]), // All actions
  };
  
export const hasPermission = (
    resourceType: "Project" | "Task" |"Role",
    role: RoleType,
    action: Action
  ): boolean => {
    // const permissions = resourceType === "Project" ? projectPermissions : taskPermissions;
    // return permissions[role]?.has(action) || false;
    switch (resourceType) {
      case "Project":
        return projectPermissions[role]?.has(action) || false;
      case "Task":
        return taskPermissions[role]?.has(action) || false;
      case "Role":
        return rolePermissions[role]?.has(action) || false;
      default:
        return false;
    }
  };
  