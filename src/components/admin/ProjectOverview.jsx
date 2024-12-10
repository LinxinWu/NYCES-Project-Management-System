import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Download, Edit, Preview } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { projectService } from '../../services/projectService';
import { exportService } from '../../services/exportService';
import { showNotification } from '../../store/slices/notificationSlice';
import ProjectStatusManager from './ProjectStatusManager';

function ProjectOverview() {
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
      const projectData = await projectService.loadProject(projectId);
      setProject(projectData);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load project',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      if (type === 'pdf') {
        await exportService.exportToPDF(project.canvasData, projectId);
      } else {
        await exportService.exportToVector(project.canvasData, projectId);
      }
      dispatch(showNotification({
        type: 'success',
        message: `Project exported as ${type.toUpperCase()} successfully`,
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: `Failed to export as ${type.toUpperCase()}`,
      }));
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Project Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Project Code</Typography>
            <Typography>{project.projectCode}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Status</Typography>
            <ProjectStatusManager 
              project={project} 
              onStatusUpdate={loadProject}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Customer Details</Typography>
            <Typography>{project.userDetails?.name}</Typography>
            <Typography>{project.userDetails?.email}</Typography>
            <Typography>{project.userDetails?.phone}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Project Type</Typography>
            <Chip label={project.userDetails?.projectType} />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={project.previewImage}
              alt="Project Preview"
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                  startIcon={<Edit />}
                  variant="contained"
                  onClick={() => navigate(`/editor/${projectId}`)}
                >
                  Edit Project
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  onClick={() => handleExport('pdf')}
                >
                  Export PDF
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  onClick={() => handleExport('vector')}
                >
                  Export Vector
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProjectOverview; 