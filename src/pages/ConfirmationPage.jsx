import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { projectService } from '../services/projectService';

function ConfirmationPage() {
  const { projectCode } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectService.getProjectByCode(projectCode);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectCode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Project Submitted Successfully!
        </Typography>
        <Typography variant="h5" align="center" color="primary" sx={{ mb: 3 }}>
          Project Code: {projectCode}
        </Typography>
        <Typography paragraph>
          Please save your project code for future reference. You'll need it to check the status
          of your project or make any modifications.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" onClick={() => window.print()}>
            Print Details
          </Button>
          <Button variant="outlined" href="/">
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ConfirmationPage; 