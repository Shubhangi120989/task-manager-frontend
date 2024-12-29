import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/project';  // Import the User type

interface ProjectState {
  currentProject: Project | null;  // Using the User type here
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject(state, action: PayloadAction<Project>) {
      state.currentProject = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCurrentProject, setLoading, setError } = projectSlice.actions;

export default projectSlice.reducer;
