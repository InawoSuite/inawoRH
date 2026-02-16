import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    first_name: 'Admin',
    email: 'admin@gmail.com',
    _id: '1'
  },
  success: false,
  error: null
};

const profileSlice = createSlice({
  name: 'Profile', // Notez le P majuscule pour correspondre au state
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.success = true;
      state.error = null;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
      state.success = false;
    },
    resetProfile: (state) => {
      return initialState;
    }
  }
});

export const { updateProfile, setProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;