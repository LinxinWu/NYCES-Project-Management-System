import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

function ProjectLookup() {
  const [projectCode, setProjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const project = await projectService.getProjectByCode(projectCode);
      navigate(`/editor/${project.id}`);
    } catch (error) {
      setError('Project not found. Please check the code and try again.');
      dispatch(showNotification({
        type: 'error',
        message: 'Project not found',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Continue Existing Project
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Project Code"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
          disabled={loading}
          placeholder="Enter your 10-digit project code"
          helperText="Example: 1234567890"
          error={!!error}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !projectCode.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <Search />}
        >
          Look Up Project
        </Button>
      </Box>
    </Paper>
  );
}

export default ProjectLookup; 