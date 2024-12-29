import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { getTaskOfProject, updateTaskStatus } from "../apis/task"; // Your API functions
import { Task } from "../types/task"; // Define Task type in types
import { useParams } from "react-router-dom";

const grid = 8;

// Styling functions for draggables and droppables
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "#93c5fd" : "#3b82f6",
  color: "#ffffff",
  borderRadius: "8px",
  boxShadow: isDragging ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "#374151" : "transparent",
  padding: grid,
  minHeight: 400,
  width: 300,
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
});

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Record<'TO_DO' | 'IN_PROGRESS' | 'DONE', Task[]>>({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  // Load tasks from API
  const projectId = useParams().projectId;
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("projectId" + projectId);
      if (projectId === undefined) return;
      const data = await getTaskOfProject(projectId); // Replace with actual project ID
      setTasks({
        TO_DO: data.filter((task: Task) => task.status === "TO_DO"),
        IN_PROGRESS: data.filter((task: Task) => task.status === "IN_PROGRESS"),
        DONE: data.filter((task: Task) => task.status === "DONE"),
      });
    };
    fetchTasks();
  }, [projectId]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside a valid destination
    if (!destination) return;

    const sourceList = tasks[source.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE'];
    const destinationList = tasks[destination.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE'];

    // Move the task
    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status = destination.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE';
    destinationList.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });

    // API call to update status in the backend
    await updateTaskStatus(movedTask.taskId, movedTask.status);
  };

  return (
  // <div className="h-auto w-auto bg-transparent ">
    <div
  style={{
    display: "flex",
    justifyContent: "space-around",
    // background: "transparent",
    // overflowX: "auto", // Allows horizontal scrolling
    // overflowY: "auto", // Allows vertical scrolling
    flexWrap: "nowrap", // Prevent wrapping the columns
    padding: "16px", // Optional: padding around the columns for better spacing
    width: "100%", // Ensure the container takes up full width
    boxSizing: "border-box",
    // overflow: "auto",
     // Include padding/borders in width calculations
  }}
>
  <DragDropContext onDragEnd={onDragEnd}>
    {["TO_DO", "IN_PROGRESS", "DONE"].map((status) => (
      <Droppable key={status} droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{
              ...getListStyle(snapshot.isDraggingOver),
              minWidth: "300px", // Ensures a minimum width for each column
              marginRight: "16px", // Space between columns
              flexShrink: 0, // Prevents columns from shrinking in size
            }}
            {...provided.droppableProps}
          >
            <h2 style={{ textAlign: "center", color: "#ffffff", fontSize: "1.5rem", marginBottom: "16px" }}>
              {status.replace("_", " ")}
            </h2>
            {tasks[status as 'TO_DO' | 'IN_PROGRESS' | 'DONE'].map((task, index) => (
              <Draggable key={String(task.taskId)} draggableId={String(task.taskId)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <h6 style={{ fontSize: "1.2rem", color: "#000000" }}>{task.title}</h6>
                    <p style={{ fontSize: "1rem", color: "#d1d5db" }}>{task.description}</p>
                    <small style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
                      Priority: {task.priority.toLowerCase()}
                    </small>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))}
  </DragDropContext>
</div>
// </div>
    
  );
};

export default TaskBoard;
