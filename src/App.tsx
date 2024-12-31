// import { useState } from 'react'
import './App.css'
// import {Button} from "@nextui-org/react";
// import  LoginPage  from "./pages/login.tsx";
// import { Outlet } from 'react-router-dom';
// import { getCurrentUser } from './apis/user.ts';
// 
// import RegisterPage  from './pages/Register.tsx';

// import Projects from './pages/Project.tsx';


// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar'; // Assuming you have a Navbar component
import {useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { setCurrentUser, setError, setLoading } from './redux/userSlice.ts';
import { useNavigate } from 'react-router-dom';
// import { use } from 'framer-motion/client';

function App() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     dispatch(setLoading(true));
  //     try {
  //       const currentUser = await getCurrentUser();
  //       console.log(currentUser);
  //       if (currentUser) {
  //         dispatch(setCurrentUser(currentUser));
  //         navigate('/projects');

  //       }
  //     } catch (error) {
        
  //       dispatch(setError("An error occurred while fetching the user"));

  //       console.log("error occurred while fetching");
  //     }
  //     dispatch(setLoading(false));
  //   };
  //   fetchUser();
  // }, [dispatch]);

const currentUser = useSelector((state: { user: { currentUser: any } }) => state.user.currentUser);

  useEffect(() => {
    if(currentUser){
      navigate('/projects');
    }
  }, [currentUser]);

  return (
    <></>
  );
}

export default App;

