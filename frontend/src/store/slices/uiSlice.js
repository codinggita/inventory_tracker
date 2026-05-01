import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  isSidebarOpen: true,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { toggleTheme, setSidebarOpen, addNotification } = uiSlice.actions;
export default uiSlice.reducer;
