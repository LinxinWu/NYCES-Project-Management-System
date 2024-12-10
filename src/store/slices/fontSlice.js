import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  availableFonts: [],
  loading: false,
  error: null
};

const fontSlice = createSlice({
  name: 'fonts',
  initialState,
  reducers: {
    setFonts: (state, action) => {
      state.availableFonts = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setFonts, setLoading, setError } = fontSlice.actions;
export default fontSlice.reducer; 