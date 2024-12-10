import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { showNotification } from '../../store/slices/notificationSlice';
import ProjectStatusManager from './ProjectStatusManager';
import { exportService } from '../../services/exportService';

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }
      setProject({ id: projectDoc.id, ...projectDoc.data() });
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load project',
      }));
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      if (format === 'pdf') {
        await exportService.exportToPDF(project.canvasData, projectId);
      } else {
        await exportService.exportToVector(project.canvasData, projectId);
      }
      dispatch(showNotification({
        type: 'success',
        message: `Project exported as ${format.toUpperCase()}`,
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: `Failed to export as ${format.toUpperCase()}`,
      }));
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Project Details
          </Typography>
          <Typography color="textSecondary">
            Code: {project.projectCode}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography>Name: {project.userDetails?.name}</Typography>
            <Typography>Email: {project.userDetails?.email}</Typography>
            <Typography>Phone: {project.userDetails?.phone}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Project Status
          </Typography>
          <ProjectStatusManager 
            project={project}
            onStatusUpdate={loadProject}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/editor/${project.id}`)}
            >
              Edit Project
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleExport('vector')}
            >
              Export Vector
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProjectDetails; 