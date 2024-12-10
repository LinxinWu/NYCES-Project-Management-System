import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';

export const createProject = createAsyncThunk(
  'project/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const project = await projectService.createProject(projectData);
      return project;
    } catch (error) {
      return rejectWithValue('Failed to create project');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    currentProject: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentProject: (state, action) => {
      console.log('Setting current project:', action.payload);
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        const project = {
          ...action.payload,
          createdAt: new Date(action.payload.createdAt).toISOString()
        };
        state.currentProject = project;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer; 