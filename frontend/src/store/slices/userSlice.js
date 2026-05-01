import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  preferences: JSON.parse(localStorage.getItem('userPreferences')) || {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    clearUser: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, updatePreferences, clearUser } = userSlice.actions;
export default userSlice.reducer;
