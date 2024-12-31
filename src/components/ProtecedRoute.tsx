import { Progress} from "@nextui-org/react";
// import React, { useEffect } from "react";
import {  useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// import { setCurrentUser, setError, setLoading } from "../redux/userSlice";
// import { getCurrentUser } from "../apis/user";

const ProtectedRoute: React.FC = () => {
  const currentUser = useSelector((state: { user: { currentUser: any } }) => state.user.currentUser);
  const loading = useSelector((state: { user: { loading: boolean } }) => state.user.loading);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchUser = async () => {
//       dispatch(setLoading(true)); // Set loading state
//       try {
//         const currentUser = await getCurrentUser(); // Fetch the user
//         if (currentUser) {
//           dispatch(setCurrentUser(currentUser)); // Update Redux store
//         }
//       } catch (error) {
//         dispatch(setError("An error occurred while fetching the user"));
//         console.error("Error fetching user:", error);
//       }
//       dispatch(setLoading(false)); // Loading is complete
//     };

//     fetchUser();
//   }, [dispatch]);

  // Handle the loading state
  if (loading) {
    return <Progress isIndeterminate aria-label="Loading..." className="fixed top-0 left-0 w-full z-50" size="sm" />
  }

  // After loading, check if the user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render the child components if the user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;

