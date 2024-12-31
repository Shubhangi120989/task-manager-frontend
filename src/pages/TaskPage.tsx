import React, { useEffect, useState } from "react";
import {Tabs, Tab} from "@nextui-org/react";
import Tasks from "./Tasks";
import Kanban from "../components/Kanban";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Task } from "../types/task";
import { getTaskOfProject } from "../apis/task";
// import { set } from "lodash";

export default function App() {
  const [selected, setSelected] = React.useState("lists");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const projectId = useParams().projectId;
  const [isOutletVisible, setIsOutletVisible] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      console.log("projectId" + projectId);
      if (projectId === undefined) return;
      const data = await getTaskOfProject(projectId);
      setTasks(data);
      setLoading(()=>false);
      
    };
    fetchTasks();
  }, [projectId]);
  const location = useLocation();
  useEffect(() => {
    // Check if the current route should render the Outlet
    setIsOutletVisible(location.pathname.includes("task"));
  }, [location]);




  return (
    <>
    {isOutletVisible?<Outlet />:<div className="flex w-full flex-col p-5">
     
      <Tabs aria-label="Options" color="primary" variant="bordered" selectedKey={selected} onSelectionChange={(key) => setSelected(key.toString())} className=" text-lg">
        <Tab key="list" title={
            <div className="flex items-center space-x-2">
              <span>List</span>
            </div>
          }>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <Tasks tasks={tasks} setTasks={setTasks} loading={loading} setLoading={setLoading}/>
          </div>
        </Tab>
        <Tab key="kanban" title={
            <div className="flex items-center space-x-2">
              <span>Kanban Board</span>
            </div>
          }>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <Kanban tasks={tasks}  setTasks={setTasks}/>
          </div>
        </Tab>
      </Tabs>
    </div>}
    </>
  );
}

