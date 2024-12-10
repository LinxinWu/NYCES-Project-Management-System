import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import fontReducer from './slices/fontSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    fonts: fontReducer,
    notification: notificationReducer
  }
}); 