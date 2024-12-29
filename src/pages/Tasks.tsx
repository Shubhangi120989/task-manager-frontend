import React, {SVGProps, useEffect} from "react";
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
    Chip,
    Pagination,
    ChipProps,
    SortDescriptor,
    Radio,
    RadioGroup,
    Divider,
    DateInput,
    DateValue,
    // form,
    Progress,
    
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
import {useSelector } from "react-redux";
import { createTask, deleteTask, getTaskOfProject, updateTask, updateTaskStatus } from "../apis/task";
import { Task } from "../types/task";
// import { nav } from "framer-motion/client";
import { useNavigate, useParams } from "react-router-dom";
// import Canvas from "../components/Canvas";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
// import { set } from "lodash";
import { Spinner } from "@nextui-org/react";
// import { set } from "lodash";
// import { Skeleton } from "@nextui-org/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

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

export const columns = [
    {name: "TITLE", uid: "title"},
    {name: "DESCRIPTION", uid: "description"},
    {name:"CREATED AT",uid:"createdAt"},
    {name: "DEADLINE", uid: "dueDate", sortable: true},
    {name: "PRIORITY", uid: "priority",sortable:true},
    {name: "STATUS", uid: "status",sortable:true},
    {name:"UPDATED AT",uid:"updatedAt"},
    {name: "ACTIONS", uid: "actions"},
];

export const statusOptions = [
    {name: "TO_DO", uid: "TO_DO"},
    {name: "IN_PROGRESS", uid: "IN_PROGRESS"},
    {name: "DONE", uid: "DONE"},
];

export const priorityOptions = [
        {name: "Low", uid: "LOW"},
        {name: "Medium", uid: "MEDIUM"},
        {name: "High", uid: "HIGH"},
        {name: "Urgent", uid: "URGENT"},
]

// export const tasks=[
//         {
//                 taskId: "1",
//                 title: "Task 1",
//                 description: "Description 1",
//                 dueDate: "2022-01-01",
//                 tags: ["tag1","tag2"],
//                 status: "TO_DO",
//                 priority: "LOW",
//                 board_data: "data1"
//         },
//         {
//                 taskId: "2",
//                 title: "Task 2",
//                 description: "Description 2",
//                 dueDate: "2022-01-02",
//                 tags: ["tag1","tag2"],
//                 status: "IN_PROGRESS",
//                 priority: "MEDIUM",
//                 board_data: "data2"
//         },
//         {
//                 taskId: "3",
//                 title: "Task 3",
//                 description: "Description 3",
//                 dueDate: "2022-01-03",
//                 tags: ["tag1","tag2"],
//                 status: "DONE",
//                 priority: "HIGH",
//                 board_data: "data3"
//         }
// ]

const statusColorMap: Record<string, ChipProps["color"]> = {
    DONE: "success",
    TO_DO: "danger",
    IN_PROGRESS: "warning",
};

const priorityColorMap: Record<string, ChipProps["color"]> = {
    LOW: "success",
    MEDIUM: "primary",
    HIGH: "warning",
    URGENT: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["title", "description", "status", "priority", "dueDate","actions"];

// type Task = (typeof tasks)[0];

export default function App() {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
    const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set(["all"]));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });
    const [tasks, setTasks] = React.useState<Task[]>([]);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [taskPriority, setTaskPriority] = React.useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("LOW");
    const [taskDeadlineDate, setTaskDeadlineDate] = React.useState<DateValue | null | undefined>(null);
    const [editTaskId, setEditTaskId] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<"TO_DO"|"DONE"|"IN_PROGRESS">( "TO_DO"); 
    const[loading,setLoading]=React.useState(false); 
    const [deleteLoading,setDeleteLoading]=React.useState(false);   
    
    const params = useParams(); // Fixed typo from 'prams' to 'params'
    const projectId = params.projectId;
    





    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns.has("all")) return columns;

        return columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...tasks];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((task) =>
                task.title.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        console.log("filteredUsers",filteredUsers);
        console.log("statusFilter",statusFilter);
        if (!statusFilter.has("all") && statusFilter.size !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((task) =>
                statusFilter.has(task.status),
            );
        }
        console.log("filteredUsers 2",filteredUsers);

        return filteredUsers;
    }, [tasks, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const priorityOrder = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const statusOrder = ["DONE", "IN_PROGRESS", "TO_DO"];

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Task, b: Task) => {
            let first, second, cmp;
            if (sortDescriptor.column === "priority") {
                first = priorityOrder.indexOf(a.priority);
                second = priorityOrder.indexOf(b.priority);
            } else if (sortDescriptor.column === "status") {
                first = statusOrder.indexOf(a.status);
                second = statusOrder.indexOf(b.status);
            } else {
                first = a[sortDescriptor.column as keyof Task] as unknown as number;
                second = b[sortDescriptor.column as keyof Task] as unknown as number;
            }
            cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((task: Task, columnKey: React.Key) => {
        const cellValue = task[columnKey as keyof Task];

        switch (columnKey) {
            case "title":
                return (
                        <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );
            case "description":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );
            case "status":
                return (

                    <Dropdown>
                            <DropdownTrigger>
                            <Chip className="capitalize cursor-pointer" color={statusColorMap[task.status]} size="sm" variant="flat">
                                     {cellValue}
                              </Chip>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="done" onPress={()=>handleStatusChange(task.taskId,"DONE",task.status)}><Chip className="capitalize cursor-pointer" color={statusColorMap["DONE"]} size="sm" variant="flat">
                                     DONE
                              </Chip></DropdownItem>
                                <DropdownItem key="in_progress" onPress={()=>handleStatusChange(task.taskId,"IN_PROGRESS",task.status)}><Chip className="capitalize cursor-pointer" color={statusColorMap["IN_PROGRESS"]} size="sm" variant="flat">
                                     IN_PROGRESS
                              </Chip></DropdownItem>
                                <DropdownItem key="to_do" onPress={()=>handleStatusChange(task.taskId,"TO_DO",task.status)}><Chip className="capitalize cursor-pointer" color={statusColorMap["TO_DO"]} size="sm" variant="flat">
                                     TO_DO
                              </Chip></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>





                    
                );
                case "priority":
                        return (
                            <Chip className="capitalize" color={priorityColorMap[task.priority]} size="sm" variant="flat">
                                {cellValue}
                            </Chip>
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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="view" onPress={()=>handleViewClick(task.taskId)}>View Board</DropdownItem>
                                <DropdownItem key="edit" onPress={()=>handleEditClick(task)}>Edit</DropdownItem>
                                <DropdownItem key="delete" onPress={()=>handleDeleteTask(task.taskId)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

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

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by title..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={Array.from(statusFilter)}
                                selectionMode="multiple"
                                onSelectionChange={(keys) => {
                                    const filteredKeys = Array.from(keys).filter(key => key !== "all");
                                    setStatusFilter(new Set(filteredKeys as string[]));
                                }}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={Array.from(visibleColumns)}
                                selectionMode="multiple"
                                onSelectionChange={(keys) => setVisibleColumns(new Set(Array.from(keys) as string[]))}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {tasks.length} tasks</span>
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
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        tasks.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {`${filteredItems.length} items`}
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
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    


    // const dispatch=useDispatch();
    const currentProject = useSelector((state: { project: { currentProject: any } }) => state.project.currentProject);
    const navigate=useNavigate();
    console.log("current Project",currentProject);
    const fetchTasks = React.useCallback(async (projectId: string) => {
        setLoading(() => true);
        const response = await getTaskOfProject(projectId);
        console.log(response);
        setTasks(response);
        setLoading(() => false);
    }, []);

    useEffect(() => {
        if (currentProject) {
            fetchTasks(currentProject.projectId);
        } else if (projectId) {
            fetchTasks(projectId);
        }
    }, []);

    useEffect(()=>{
        if(!isOpen){
            setEditTaskId(null);
            setTitle("");
            setDescription("");
            setTaskPriority("LOW");
            setTaskDeadlineDate(null);
        }

    },[isOpen])
    


    const handleViewClick = (taskId: string) => {
        
        navigate(`/task/${taskId}`);
    }

    const createNewTask=async()=>{
        setLoading(()=>true);
        console.log(taskDeadlineDate)
        const timeZone = 'UTC'; // Specify the desired timezone, e.g., 'UTC' or your local timezone
        const jsDate = taskDeadlineDate ? taskDeadlineDate.toDate(timeZone) : null; // Convert to JavaScript Date
        const formattedDate = jsDate ? jsDate.toISOString().split('T')[0] : null; 
        console.log(formattedDate);
        if(!projectId){
            return;

        }
        if(formattedDate){
            
            const response= await createTask(projectId,{
                taskId: "", // Generate or assign a unique taskId
                title,
                description,
                dueDate: formattedDate?.toString(),
                priority: taskPriority,
                status: "TO_DO",
                tags: [], // Add appropriate tags if any
                boardData: null // Add appropriate board data if any
            });
            console.log(response);
            setTasks([...tasks,response])
        }else{
            const response= await createTask(projectId,{
                taskId: "", // Generate or assign a unique taskId
                title,
                description,
                dueDate: null,
                priority: taskPriority,
                status: "TO_DO",
                tags: [], // Add appropriate tags if any
                boardData: null // Add appropriate board data if any
            });
            console.log(response);
            setTasks([...tasks,response])
        }
        setLoading(()=>false);
        onOpenChange();

   


    }


    const handleDeleteTask=async(taskId:String)=>{
        setDeleteLoading(()=>true);
        const response=await deleteTask(taskId);
        console.log(response);
        setTasks((tasks)=>tasks.filter((task)=>task.taskId!==taskId));
        // onOpenChange();
        setDeleteLoading(()=>false);

    }


    const handleEditClick=(task:Task)=>{
        setEditTaskId(()=>task.taskId);
        console.log("In the edit project function");
        onOpen();
        setTitle(task.title);
        setDescription(task.description);
        setTaskPriority(task.priority);
        setStatus(task.status);
        if(task.dueDate){
        const [year, month, day] = task.dueDate.split('-').map(Number); // Extract year, month, day

        const taskDeadline = new CalendarDate(year, month, day);
        setTaskDeadlineDate(taskDeadline);
        }


    }

    const editButtonClickHandle=async()=>{
        setLoading(()=>true);


        const timeZone = 'UTC'; // Specify the desired timezone, e.g., 'UTC' or your local timezone
        const jsDate = taskDeadlineDate ? taskDeadlineDate.toDate(timeZone) : null; // Convert to JavaScript Date
        const formattedDate = jsDate ? jsDate.toISOString().split('T')[0] : null; 
        if(!editTaskId){
            return;
        }

        // if(formattedDate){
            const response=await updateTask(editTaskId,{
                taskId: editTaskId, // Generate or assign a unique taskId
                title,
                description,
                dueDate: formattedDate?.toString()||null,
                priority: taskPriority,
                status: status,
                tags: [], // Add appropriate tags if any
                boardData: null // Add appropriate board data if any
            })
            console.log(response);
            setTasks((tasks)=>tasks.map((task)=>task.taskId===editTaskId?response:task))
        // }
        // const response=await updateTask(editTaskId,{})
        setLoading(()=>false);

        onOpenChange();

    }

    const handleStatusChange=async(taskId:string,status:string,taskStatus:string)=>{
        if(status!==taskStatus){
            setDeleteLoading(()=>true);
            const response=await updateTaskStatus(taskId,status);
            console.log(response)
            setTasks((tasks) =>
                tasks.map((task) =>
                  task.taskId === taskId ? { ...task, status: status as "TO_DO" | "DONE" | "IN_PROGRESS" } : task
                )
              );
              setDeleteLoading(()=>false);
              

        }
        

    }





    return (
        <>
        {deleteLoading&&<Progress isIndeterminate aria-label="Loading..." className="fixed top-0 left-0 w-full z-50" size="sm" />}
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
            wrapper: "max-h-[382px]",
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

           <TableBody emptyContent={loading?<Spinner/>:"No task found"} items={sortedItems}>
            {(item) => (
            <TableRow key={item.taskId} className="hover:bg-default-100">
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
          <ModalHeader className="flex flex-col gap-1">{editTaskId!==null?"Edit the Task":"Create New Task"}</ModalHeader>
            <ModalBody>
            <Input
            label={<span>Task Title <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter the Title"
            variant="bordered"
            value={title}
            onValueChange={setTitle}
            />
            <Input
            label="Task Description"
            placeholder="Enter the Description"
            variant="bordered"
            value={description}
            onValueChange={setDescription}
            />


        <RadioGroup
              color="success"
              size="sm"
              value={taskPriority}
              onValueChange={(value: string) => {
            const validPriorities = [
              "LOW",
              "MEDIUM",
              "HIGH",
              "URGENT",
            ] as const;
            if (
              validPriorities.includes(
            value as (typeof validPriorities)[number]
              )
            ) {
              setTaskPriority(
            value as "LOW" | "MEDIUM" | "HIGH" | "URGENT"
              );
            } else {
              console.warn(`Invalid priority value: ${value}`);
            }
              }}
              label="Set the priority of this task"
              orientation="horizontal"
            >
              <Radio value="URGENT">Urgent</Radio>
              <Radio value="HIGH">High</Radio>
              <Radio value="MEDIUM">Medium</Radio>
              <Radio value="LOW">Low</Radio>
            </RadioGroup>
            <Divider />
            <DateInput
              size="sm"
              value={taskDeadlineDate}
              onChange={(e) => setTaskDeadlineDate(e)}
              label="Deadline Date"
              minValue={today(getLocalTimeZone())}
            />





            </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
            Close
            </Button>
            {loading?<Spinner/>:<Button color="primary" isDisabled={!title} onPress={editTaskId!==null?editButtonClickHandle:createNewTask}>
           {(editTaskId!==null?"Edit Task":"Create Task")}
            </Button>}
          </ModalFooter>
          </>
        );
        }}
          </ModalContent>
          </Modal>






        </>
    );
}

