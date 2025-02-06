import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Tasks from "./Tasks";
import Kanban from "../components/Kanban";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Task } from "../types/task";
import { getTaskOfProject } from "../apis/task";
import { Action, hasPermission, RoleType } from "../types/projectPermissions";
import { useSelector } from "react-redux";
import Collaborators from "../components/Collaborators";


export default function App() {
  const [selected, setSelected] = React.useState("lists");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const projectId = useParams().projectId;
  const [isOutletVisible, setIsOutletVisible] = useState(false);
  const currentProject = useSelector((state: { project: { currentProject: any } }) => state.project.currentProject);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      console.log("projectId" + projectId);
      if (projectId === undefined) return;
      const data = await getTaskOfProject(projectId);
      setTasks(data);
      setLoading(() => false);
    };
    fetchTasks();
  }, [projectId]);

  const location = useLocation();
  useEffect(() => {
    // Check if the current route should render the Outlet
    setIsOutletVisible(location.pathname.includes("task"));
  }, [location]);

  const params = useParams(); // Fixed typo from 'prams' to 'params'
  const role: RoleType = params.role as RoleType;

  function capitalize(s: string): string {
    return s.replace(/\b\w/g, char => char.toUpperCase());
  }

  return (
    <>
      {isOutletVisible ? (
        <Outlet />
      ) : (
        <div className="flex w-full flex-col p-5">
          <div className="text-2xl font-bold mb-4 pl-4 text-cyan-600 text-center">{currentProject?.title?capitalize(currentProject.title):null}</div>
          <Tabs
            aria-label="Options"
            color="primary"
            variant="bordered"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key.toString())}
            className="text-lg"
          >
            <Tab
              key="list"
              title={
                <div className="flex items-center space-x-2">
                  <span>List</span>
                </div>
              }
            >
              <div className="border-t border-gray-300 mt-4 pt-4">
                <Tasks tasks={tasks} setTasks={setTasks} loading={loading} setLoading={setLoading} />
              </div>
            </Tab>
            {hasPermission("Task", role, Action.UPDATE) && (
              <Tab
                key="kanban"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Kanban Board</span>
                  </div>
                }
              >
                <div className="border-t border-gray-300 mt-4 pt-4">
                  <Kanban tasks={tasks} setTasks={setTasks} />
                </div>
              </Tab>
            )}

{hasPermission("Project", role, Action.VIEW_ROLES) && (
              <Tab
                key="collaborators"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Collaborators</span>
                  </div>
                }
              >
                <div className="border-t border-gray-300 mt-4 pt-4">
                  <Collaborators/>
                </div>
              </Tab>
            )}
          </Tabs>
        </div>
      )}
    </>
  );
}
