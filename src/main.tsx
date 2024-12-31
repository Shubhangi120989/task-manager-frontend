import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import {NextUIProvider} from "@nextui-org/react";
// import { Route } from 'react-router-dom'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/Register.tsx'
import Projects from './pages/Project.tsx'
// import Board from './components/Board.tsx'
// import Tasks from './pages/Tasks.tsx'
import Canvas from './components/Canvas.tsx'
// import Kanban from './components/Kanban.tsx'
import TaskPage from './pages/TaskPage.tsx'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/ProtecedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <Toaster position="top-right" richColors />
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<TaskPage />}>
                <Route path="task/:taskId" element={<Canvas />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </Provider>
    </NextUIProvider>
  </StrictMode>
)
