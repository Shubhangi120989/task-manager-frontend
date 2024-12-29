import React from "react";
import {Tabs, Tab} from "@nextui-org/react";
import Tasks from "./Tasks";
import Kanban from "../components/Kanban";

export default function App() {
  const [selected, setSelected] = React.useState("photos");

  return (
    <div className="flex w-full flex-col p-5">
      <Tabs aria-label="Options" color="primary" variant="bordered" selectedKey={selected} onSelectionChange={(key) => setSelected(key.toString())} className=" text-lg">
        <Tab key="list" title={
            <div className="flex items-center space-x-2">
              <span>List</span>
            </div>
          }>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <Tasks />
          </div>
        </Tab>
        <Tab key="kanban" title={
            <div className="flex items-center space-x-2">
              <span>Kanban Board</span>
            </div>
          }>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <Kanban />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

