import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/project';

interface ProjectState {
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

// Load project from localStorage (if available)
const savedProject = localStorage.getItem('currentProject');
const initialState: ProjectState = {
  currentProject: savedProject ? JSON.parse(savedProject) : null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject(state, action: PayloadAction<Project | null>) {
      state.currentProject = action.payload;
      if (action.payload) {
        localStorage.setItem('currentProject', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('currentProject');
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateProjectRoles(state, action: PayloadAction<Project['roles']>) {
      if (state.currentProject) {
        state.currentProject.roles = action.payload;
        localStorage.setItem('currentProject', JSON.stringify(state.currentProject));
      }
    }
  },
});

export const { setCurrentProject, setLoading, setError ,updateProjectRoles} = projectSlice.actions;
export default projectSlice.reducer;
