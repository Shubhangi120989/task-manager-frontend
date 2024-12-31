// redux/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/user';  // Import the User type

interface UserState {
  currentUser: User | null;  // Using the User type here
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: true,
  error: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User|null>) {
      state.currentUser = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCurrentUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
