import React, {SVGProps, useEffect} from "react";
import { createProject, getAllProjects,deleteProject, updateProject } from "../apis/project";
import { Project } from "../types/project";

import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/projectSlice";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  // user,
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
 
  useDisclosure,
  // Checkbox,
  
  // Link,
} from "@nextui-org/react";
import {Spinner,Progress} from "@nextui-org/react";
// import { set } from "lodash";
import { toast } from "sonner";
// import { p, pre } from "framer-motion/client";
// import { set } from "lodash";
// import { use } from "framer-motion/client";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const columns = [
  {name: "ID", uid: "projectId", sortable: true},
  {name: "TITLE", uid: "title"},
  {name: "DESCRIPTION", uid: "description"},
  {name:"CREATED AT", uid:"createdAt",sortable:true},
  {name:"UPDATED AT",uid:"updatedAt"},
  {name: "ACTIONS", uid: "actions"},
];


export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const VerticalDotsIcon = ({size = 24, width, height, ...props}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};











const INITIAL_VISIBLE_COLUMNS = ["title", "description", "createdAt", "updatedAt", "actions"];

// type Project = (typeof projects)[0];

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ column: "createdAt", direction: "ascending" });
  const [projects, setProjects] = React.useState<Project[]>([]);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  // const [projectChanged, setProjectChanged] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  // const [editEnbaled, setEditEnabled] = React.useState(false);
  // const [onCreate, setOnCreate] = React.useState(false);
  const pages = Math.ceil(projects.length / rowsPerPage);
  const [editProjectId, setEditProjectId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [uploadLoading, setUploadLoading] = React.useState(false);


  const dispatch = useDispatch();
  const navigate=useNavigate();

  const handleOnViewClick=(project: Project)=>{
    dispatch(setCurrentProject(project));
    navigate(`/projects/${project.projectId}`);



  }

  const createNewProject = async () => {
    setLoading(()=>true);
    try{
      // if (!onCreate) {
      //   setOnCreate(true);
      // }else{
      //   setOnCreate(false);
      // }
      const response = await createProject(title,description);
      console.log(response);
      setProjects([...projects,response]);
      onOpenChange();
    }catch(error){
      console.error('Error creating project:',error);
      toast.error("Error creating project: "+(error as any).message);
  }
  setLoading(()=>false);
  }

  // console.log("projects before deleteing",projects);

  const deleteProjectApp=async(projectId: string)=>{
    setUploadLoading(()=>true);
    try{
      const response = await deleteProject(projectId);
      console.log(response);
      setProjects((projects)=>projects.filter(project => project.projectId !== projectId));
      // if(projectChanged){
      //   setProjectChanged((prev)=>!prev);

      // }else{
      //   setProjectChanged(true);
      // }
      // setProjectChanged((prev)=>!prev);
      
    }catch(error){
      console.error('Error deleting project:',error);
      toast.error("Error deleting project: "+(error as any).message);
  }
  console.log("projects after deleteing",projects);
  setUploadLoading(()=>false);
}

  React.useEffect(() => {
    async function fetchProjects() {
      setLoading(()=>true);
      try {
        const response = await getAllProjects();
        console.log(response);

        setProjects(response);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setLoading(()=>false);
    }

    fetchProjects();
  }, []);

  React.useEffect(() => {
    setTitle("");
    setDescription("");
  }, []);


  const editProject=(projectId:string,title:string,description:string)=>{
    setEditProjectId(()=>projectId);
    console.log("In the edit project function");
    onOpen();
    setTitle(title);
    setDescription(description);
    // setEditProjectId(()=>null);

    // setTitle(projects.filter(project => project.projectId === projectId)[0].title);
    //   setDescription(projects.filter(project => project.projectId === projectId)[0].description);
    

  }

  const editProjectClicked=async()=>{
    setLoading(()=>true);
    if (editProjectId) {
      const response = await updateProject(editProjectId, title, description);
      console.log(response);
      // setEditEnabled(false);

      setProjects((projects) => projects.map((project) => project.projectId === editProjectId ? response : project));
      setEditProjectId(null);

      // if(projectChanged){
      //   setProjectChanged(false);

      // }else{
      //   setProjectChanged(true);
      // }
      // setProjectChanged(true);
      onOpenChange();
      setTitle("");
      setDescription("");
      setLoading(()=>false);

    }
    
  }

  useEffect(()=>{
    if(!isOpen){
      setEditProjectId(()=>null);
      setTitle("");
      setDescription("");
    }
  },[isOpen]);



  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) =>
      project.title.toLowerCase().includes(filterValue.toLowerCase())

    );

  }, [filterValue, projects]);
console.log(filteredProjects);
console.log(filterValue);
console.log("projects:",projects);
// console.log("items",items);
  const sortedProjects = React.useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (sortDescriptor.direction === "ascending") {
        const dateA = a[sortDescriptor.column as keyof Project] ? new Date(a[sortDescriptor.column as keyof Project] as string | number) : new Date(0);
        const dateB = b[sortDescriptor.column as keyof Project] ? new Date(b[sortDescriptor.column as keyof Project] as string | number) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      } else {
        const dateA = a[sortDescriptor.column as keyof Project] ? new Date(a[sortDescriptor.column as keyof Project] as string | number) : new Date(0);
        const dateB = b[sortDescriptor.column as keyof Project] ? new Date(b[sortDescriptor.column as keyof Project] as string | number) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, [filteredProjects, sortDescriptor]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedProjects.slice(start, end);
  }, [page, rowsPerPage, sortedProjects]);
console.log("items",items);
  const renderCell = React.useCallback((project: Project, columnKey: React.Key) => {
    const cellValue = project[columnKey as keyof Project];

    switch (columnKey) {
      case "title":
      return (
        <div className="flex flex-col">
        <p className="text-bold text-small capitalize cursor-pointer" onClick={() => handleOnViewClick(project)}>{cellValue}</p>
        </div>
      );
      case "description":
      return (
        <div className="flex flex-col">
        <p className="text-bold text-small capitalize cursor-pointer" onClick={() => handleOnViewClick(project)}>{cellValue}</p>
        </div>
      );
      case "createdAt":
      case "updatedAt":
      if(!cellValue) return null;
      const date = new Date(cellValue as string);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      return (
        <div className="flex flex-col">
        <p className="text-bold text-small">{formattedDate}</p>
        </div>
      );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view" onPress={()=>handleOnViewClick(project)}>View Tasks</DropdownItem>
                <DropdownItem key="edit" onPress={()=>editProject(project.projectId,project.title,project.description)}>Edit</DropdownItem>
                <DropdownItem key="delete" onPress={()=>deleteProjectApp(project.projectId)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
             
            }}
            placeholder="Search by title..."
            // size="sm"
            startContent={<SearchIcon />}
            value={filterValue}
            // variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <>
            <Button onPress={onOpen} color="primary"  endContent={<PlusIcon />} >
              Add New
            </Button>

            
      </>




          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {filteredProjects.length} projects</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, filteredProjects.length]);

  // const bottomContent = React.useMemo(() => {
  //   return (
  //     <div className="py-2 px-2 flex justify-between items-center">
  //       <Pagination
  //         showControls
  //         classNames={{
  //           cursor: "bg-foreground text-background",
  //         }}
  //         color="default"
  //         page={page}
  //         total={pages}
  //         variant="light"
  //         onChange={setPage}
  //       />
  //     </div>
  //   );
  // }, [page, pages]);


  const bottomContent = React.useMemo(() => {
    return (
        <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
                {`${items.length} items`}
            </span>
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
            {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                    Previous
                </Button>
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                    Next
                </Button>
            </div> */}
        </div>
    );
}, [items.length, page, pages]);


  // const classNames = React.useMemo(
  //   () => ({
  //     wrapper: ["max-h-[382px]", "max-w-3xl", "p-4"],
  //     th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
  //     td: [
  //       "group-data-[first=true]/tr:first:before:rounded-none",
  //       "group-data-[first=true]/tr:last:before:rounded-none",
  //       "group-data-[middle=true]/tr:before:rounded-none",
  //       "group-data-[last=true]/tr:first:before:rounded-none",
  //       "group-data-[last=true]/tr:last:before:rounded-none",
  //     ],
  //   }),
  //   [],
  // );

  return (


    <div className="flex flex-col gap-4 pt-8 p-5">
      {uploadLoading&&<Progress isIndeterminate aria-label="Loading..." className="fixed top-0 left-0 w-full z-50" size="sm" />}
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
          wrapper: "overflow-x-auto max-h-[382px] p-2",
          
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={loading?<Spinner/>:"No projects found"} items={items}>
        {(item) => (
          <TableRow key={item.projectId} className="hover:bg-default-100">
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>


    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => {
        

        return (
          <>
          <ModalHeader className="flex flex-col gap-1">{editProjectId!==null?"Edit the project":"Create New Project"}</ModalHeader>
            <ModalBody>
            <Input
            label={<span>Title <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter the Title"
            variant="bordered"
            value={title}
            onValueChange={setTitle}
            />
            <Input
            label="Description"
            placeholder="Enter the Description"
            variant="bordered"
            value={description}
            onValueChange={setDescription}
            />
            </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
            Close
            </Button>
            {loading?<Spinner/>:<Button color="primary" onPress={editProjectId==null?createNewProject:editProjectClicked} isDisabled={!title}>
           {editProjectId!==null?"Edit":"Create"}
            </Button>}
          </ModalFooter>
          </>
        );
        }}
      </ModalContent>
      </Modal>




    

    </div>


  );
}
