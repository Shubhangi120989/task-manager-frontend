export interface Task {
    taskId: string ;
    title: string;
    description: string ;
    dueDate: string | null;
    tags: string[] ;
    status: "TO_DO" | "IN_PROGRESS" | "DONE" ;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    boardData: string | null;

}