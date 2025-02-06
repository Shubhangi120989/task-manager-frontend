import React, { useEffect, useState } from "react";
import {Tabs, Tab} from "@nextui-org/react";
import Projects from "./Project";
import { Project } from "../types/project";
import { getAllProjects, getProjectsWithEditPersmission, getProjectsWithViewPermission } from "../apis/project";
import { RoleType } from "../types/projectPermissions";
export default function App() {
    const [selected, setSelected] = React.useState("own");
    const [ownedProjects,setOwnedProjects] = useState<Project[]>([]);
    const [editableProjects,setEditableProjects] = useState<Project[]>([]);
    const [viewableProjects,setViewableProjects] = useState<Project[]>([]);

    const [loading,setLoading] = useState<boolean>(false);
    useEffect(() => {
      const fetchOwnedProjects = async () => {
      const data = await getAllProjects();
      setOwnedProjects(()=>data);
      };

      const fetchEditableProjects = async () => {
      const data = await getProjectsWithEditPersmission();
      setEditableProjects(()=>data);
      };

      const fetchViewableProjects = async () => {
      const data = await getProjectsWithViewPermission();
      setViewableProjects(()=>data);
      };

      const fetchAllProjects = async () => {
      setLoading(true);
      await Promise.all([fetchOwnedProjects(), fetchEditableProjects(), fetchViewableProjects()]);
      setLoading(false);
      };

      fetchAllProjects();
    }, []);

  
    return (
      <>
      
    {/* //   isOutletVisible ? <Outlet /> : <div className="flex w-full flex-col p-5"> */}
       
        <Tabs aria-label="Options" color="primary" variant="bordered" selectedKey={selected} onSelectionChange={(key) => setSelected(key.toString())} className=" text-lg">
          <Tab key="own" title={
              <div className="flex items-center space-x-2">
                <span>Owned Projects</span>
              </div>
            }>
            <div className="border-t border-gray-300 mt-4 pt-4">
              <Projects projects={ownedProjects} setProjects={setOwnedProjects} loading={loading} setLoading={setLoading} roleInProject={RoleType.OWNER}/>
            </div>
          </Tab>
          <Tab key="edit" title={
              <div className="flex items-center space-x-2">
                <span>Editable Projects</span>
              </div>
            }>
            <div className="border-t border-gray-300 mt-4 pt-4">
            <Projects projects={editableProjects} setProjects={setEditableProjects} loading={loading} setLoading={setLoading} roleInProject={RoleType.EDITOR}/>
            </div>
          </Tab>

          <Tab key="view" title={
              <div className="flex items-center space-x-2">
                <span>Viewable Projects</span>
              </div>
            }>
            <div className="border-t border-gray-300 mt-4 pt-4">
            <Projects projects={viewableProjects} setProjects={setViewableProjects} loading={loading} setLoading={setLoading} roleInProject={RoleType.VIEWER}/>
            </div>
          </Tab>
        </Tabs>
      
      </>
    );
  }
  
  