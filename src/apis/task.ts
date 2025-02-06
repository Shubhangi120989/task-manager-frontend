import { Task } from "../types/task";
import client from "./client";

export const createTask = async (projectId:String,task: Task) => {
    try{
        const response = await client.post<Task>(`/tasks/${projectId}`,task);
        return response.data;
    }
    catch(error){
        console.error("Error creating task:", error);
        throw error;
    }
};

export const getTaskOfProject = async (projectId:String) => {
    try{
        const response = await client.get<Task[]>(`/tasks/${projectId}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const deleteTask = async (taskId:String) => {
    try{
        const response = await client.delete<string>(`/tasks/${taskId}`);
        return response.data;
    }
    catch(error){
        console.error("Error deleting task:", error);
        throw error;
    }
}

export const updateTask = async (taskId:string,task:Task) => {
    try{
        const response = await client.patch<Task>(`/tasks/${taskId}`,task);
        return response.data;
    }
    catch(error){
        console.error("Error updating task:", error);
        throw error;
    }
}

export const updateTaskStatus = async (taskId:String,status:string) => {
    try{
        const response = await client.patch<Task>(`/tasks/${taskId}`,{status});
        return response.data;
    }
    catch(error){
        console.error("Error updating task status:", error);
        throw error;
    }
}

export const getTaskById = async (taskId:String) => {    
    try{
        const response = await client.get<Task>(`/tasks/get-by-id/${taskId}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching task:", error);
        throw error;
    }
}

export const setBoardData = async (taskId:String,boardData:string) => {
    try{
        const response = await client.post<String>(`/tasks/${taskId}/saveBoard`,boardData);
        return response.data;
    }
    catch(error){
        console.error("Error saving board data:", error);
        throw error;
    }
}

export const getBoardData = async (taskId:String) => {
    try{
        const response = await client.get<string>(`/tasks/${taskId}/getBoard`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching board data:", error);
        throw error;
    }
}


// export const getAllTasks = async()=>{
//     try{
//         const response = await client.get<Task[]>(`/tasks`);
//         return response.data;
//     }
//     catch(error){
//         console.error("Error fetching tasks:", error);
//         throw error;
//     }
// }

