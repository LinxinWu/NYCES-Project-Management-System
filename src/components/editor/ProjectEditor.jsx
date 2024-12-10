import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CanvasEditor from './CanvasEditor';
import TextOverlayManager from './TextOverlayManager';
import VectorUpload from './VectorUpload';
import EditorToolbar from './EditorToolbar';
import ProjectPreview from '../project/ProjectPreview';
import { projectService } from '../../services/projectService';
import { showNotification } from '../../store/slices/notificationSlice';

function ProjectEditor() {
  const [canvas, setCanvas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const project = await projectService.loadProject(projectId);
      // Project data will be loaded into canvas via CanvasEditor
      setLoading(false);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load project',
      }));
    }
  };

  const handleSave = async () => {
    try {
      await projectService.saveCanvasState(projectId, canvas.toJSON());
      dispatch(showNotification({
        type: 'success',
        message: 'Project saved successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to save project',
      }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <EditorToolbar 
            canvas={canvas} 
            onSave={handleSave}
            onPreview={() => setPreviewOpen(true)}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper elevation={3}>
            <Box sx={{ p: 2 }}>
              <CanvasEditor onCanvasReady={setCanvas} projectId={projectId} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextOverlayManager canvas={canvas} />
            <VectorUpload canvas={canvas} projectId={projectId} />
          </Box>
        </Grid>
      </Grid>

      <ProjectPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        canvas={canvas}
        projectId={projectId}
      />
    </Box>
  );
}

export default ProjectEditor; 