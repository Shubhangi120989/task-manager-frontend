// import { form } from "@nextui-org/react";
import client from "./client";

import { Project} from "../types/project";
import { RoleType } from "../types/projectPermissions";
import { Role } from "../types/role";

// const API_BASE_URL = "http://localhost:8080/api"; // Update this as per your backend URL

/**
 * Get all projects for the logged-in user.
 */
export async function getAllProjects(): Promise<Project[]> {
    try {
        const response = await client.get<Project[]>(`/projects`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

/**
 * Get a project by its ID.
 * @param projectId - ID of the project to fetch
 */
export async function getProjectById(projectId: number): Promise<Project> {
    try {
        const response = await client.get<Project>(`/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with ID ${projectId}:`, error);
        throw error;
    }
}

/**
 * Create a new project.
 * @param title - Title of the new project
 * @param description - Description of the new project
 */
export async function createProject(title: string, description: string): Promise<Project> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    try {
        const response = await client.post<Project>(
            `/projects`,formData,{headers:{"Content-Type":"multipart/form-data"}    
           
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}

/**
 * Delete a project by its ID.
 * @param projectId - ID of the project to delete
 */
export async function deleteProject(projectId: String): Promise<string> {
    try {
        const response = await client.delete<string>(`/projects/${projectId}`,);
        return response.data;
    } catch (error) {
        console.error(`Error deleting project with ID ${projectId}:`, error);
        throw error;
    }
}

/**
 * Update a project.
 * @param projectId - ID of the project to update
 * @param title - Updated title of the project
 * @param description - Updated description of the project
 */
export async function updateProject(
    projectId: String,
    title: string,
    description: string
): Promise<Project> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    try {
        const response = await client.patch<Project>(
            `/projects/${projectId}`,
            formData, // Request body is null since we're using @RequestParam in the backend
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating project with ID ${projectId}:`, error);
        throw error;
    }
}

export async function addRole(projectId: string,username:string,role:RoleType): Promise<Role> {
    try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("role", role);
        const response = await client.post<Role>(
        `/projects/${projectId}/add-role`,formData,{headers:{"Content-Type":"multipart/form-data"}}
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating project with ID ${projectId}:`, error);
        throw error;
    }
}


export async function getProjectsWithViewPermission():Promise<Project[]>{
    try{
        const response = await client.get<Project[]>(`/projects/view`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export async function getProjectsWithEditPersmission():Promise<Project[]>{
    try{
        const response = await client.get<Project[]>(`/projects/edit`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching projects:", error);
        throw error;
    }
} 


export async function deleteRole(roleId: string): Promise<string> {
    try {
        const response = await client.delete<string>(`/delete-role/${roleId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting role with ID ${roleId}:`, error);
        throw error;
    }
}

export async function deleteRoleByProject(projectId:string):Promise<string>{
    try{
        const response = await client.delete<string>(`/delete-role/project/${projectId}`);
        return response.data;
    }
    catch(error){
        console.error(`Error deleting role with ID ${projectId}:`, error);
        throw error;
    }
}


// type Role= "VIEWER"|"EDITOR"|"OWNER";


