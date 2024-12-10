import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
  open: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    hideNotification: (state) => {
      state.open = false;
      state.message = null;
      state.type = null;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 