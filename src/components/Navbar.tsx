import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
import {User} from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentUser, setError, setLoading } from '../redux/userSlice';
import { getCurrentUser } from "../apis/user";
import { useNavigate, Link as RouterLink, useLocation} from "react-router-dom";
import { logoutUser } from "../apis/user";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Button,
  } from "@nextui-org/react";
import { toast } from "sonner";
  
  export const AcmeLogo = () => {
    return (
      <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };
  
  export const SearchIcon = ({size = 24, strokeWidth = 1.5, width, height, ...props}: {size?: number, strokeWidth?: number, width?: number, height?: number, [key: string]: any}) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={height || size}
        role="presentation"
        viewBox="0 0 24 24"
        width={width || size}
        {...props}
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  };
  
  export default function App() {
    const currentUser = useSelector((state: { user: { currentUser: any } }) => state.user.currentUser);
    // const currentProject = useSelector((state: { project: { currentProject: any } }) => state.project.currentProject);
    const dispatch = useDispatch();
    // const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const fetchUser = async () => {
          dispatch(setLoading(true));
          try {
            const currentUser = await getCurrentUser();
            console.log(currentUser);
            if (currentUser) {
              dispatch(setCurrentUser(currentUser));
              // navigate('/projects');
    
            }
          } catch (error) {
            
            dispatch(setError("An error occurred while fetching the user"));
    
            console.log("error occurred while fetching");
          }
          dispatch(setLoading(false));
        };
        fetchUser();
      }, [dispatch]);
    
   

    function capitalize(s: string): string {
      return s.replace(/\b\w/g, char => char.toUpperCase());
    }
    const handleLogout = async () => {
        await logoutUser();
        toast.success("Logged out successfully");
        // window.location.href = "/";
        dispatch(setCurrentUser(null));
        navigate('/');
        
    }
    // const handleClick=()=>{
    //   navigate('/');
    // }



    return (
      <Navbar isBordered>
        {/* <Toaster position="top-right" richColors/> */}
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            {/* <AcmeLogo /> */}
            <RouterLink to="/"><p className="hidden sm:block font-bold text-inherit">TASK MANAGER</p></RouterLink>
           
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-3">
            {currentUser && (
            <NavbarItem isActive={location.pathname === "/projects"}>
              <RouterLink 
              aria-current="page" 
              color="primary" 
              to="/projects"
              style={{ fontWeight: window.location.pathname === "/projects" ? 'bold' : 'normal', textDecoration: window.location.pathname === "/projects" ? 'underline' : 'none' }}
              >
              PROJECTS
              </RouterLink>
              {/* <RouterLink 
          to="/projects"
          style={{ 
            fontWeight: location.pathname === "/projects" ? 'bold' : 'normal', 
            textDecoration: location.pathname === "/projects" ? 'underline' : 'none' 
          }}
        >
          PROJECTS
        </RouterLink> */}
            </NavbarItem>
            )}
            {/* {currentProject && (
            <NavbarItem isActive={window.location.pathname === `/projects/${currentProject.id}`}>
              <Link 
              aria-current="page" 
              color="primary" 
              href={`/projects/${currentProject.id}`}
              style={{ fontWeight: window.location.pathname === `/projects/${currentProject.id}` ? 'bold' : 'normal', textDecoration: window.location.pathname === `/projects/${currentProject.id}` ? 'underline' : 'none' }}
              >
              Tasks
              </Link>
            </NavbarItem>
            )} */}
            {/* <NavbarItem>
              <Link color="foreground" href="#">
                Integrations
              </Link>
            </NavbarItem> */}
          </NavbarContent>
        </NavbarContent>
  
        <NavbarContent as="div" className="items-center" justify="end">
          {/* <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search..."
            size="sm"
            startContent={<SearchIcon size={18} width={18} height={18} />}
            type="search"
          /> */}
            {currentUser ? (
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                <div className="flex items-center gap-4 cursor-pointer">
                {/* <p className="font-semibold text-sm text-default-500">{capitalize(currentUser.name)}</p> */}
                {/* <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={currentUser.avatarUrl}
                /> */}
                <User
            avatarProps={{
            src: currentUser.avatarUrl,
            }}
            description={currentUser.bio}
            name={capitalize(currentUser.name)}
          />
                </div>
                </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{currentUser.username}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            ) : (
            <NavbarItem>
              <Button as={Link} color="primary" href="/login" variant="flat">
              Sign Up
              </Button>
            </NavbarItem>
            )}
        </NavbarContent>
      </Navbar>
    );
  }