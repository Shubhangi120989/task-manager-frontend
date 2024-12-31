import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  //  getTaskOfProject, 
  updateTaskStatus } from "../apis/task"; // Your API functions
import { Task } from "../types/task"; // Define Task type in types
// import { useParams } from "react-router-dom";

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
interface KanbanProps {

    tasks: Task[];
  
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  
  }
  
const Kanban: React.FC<KanbanProps> = ({ tasks }) => {
  const [tasksList, setTasksList] = useState<Record<'TO_DO' | 'IN_PROGRESS' | 'DONE', Task[]>>({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  // Load tasks from prop data
  useEffect(() => {
    setTasksList({
      TO_DO: tasks.filter((task: Task) => task.status === "TO_DO"),
      IN_PROGRESS: tasks.filter((task: Task) => task.status === "IN_PROGRESS"),
      DONE: tasks.filter((task: Task) => task.status === "DONE"),
    });
  }, [tasks]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside a valid destination
    if (!destination) return;

    const sourceList = tasksList[source.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE'];
    const destinationList = tasksList[destination.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE'];

    // Move the task
    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status = destination.droppableId as 'TO_DO' | 'IN_PROGRESS' | 'DONE';
    destinationList.splice(destination.index, 0, movedTask);

    setTasksList({
      ...tasksList,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });

    // API call to update status in the backend
    await updateTaskStatus(movedTask.taskId, movedTask.status);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "nowrap",
        padding: "16px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "auto",
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
                  minWidth: "300px",
                  marginRight: "16px",
                  flexShrink: 0,
                }}
                {...provided.droppableProps}
              >
                <h2 style={{ textAlign: "center", color: "#ffffff", fontSize: "1.5rem", marginBottom: "16px" }}>
                  {status.replace("_", " ")}
                </h2>
                {tasksList[status as 'TO_DO' | 'IN_PROGRESS' | 'DONE'].map((task, index) => (
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
  );
};

export default Kanban;
