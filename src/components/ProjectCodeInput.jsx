import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/slices/notificationSlice';

export default function ProjectCodeInput({ open, onClose }) {
  const [projectCode, setProjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectCode.trim()) return;

    setLoading(true);
    try {
      const project = await projectService.getProject(projectCode.trim());
      if (project) {
        onClose();
        navigate(`/editor/${project.id}`);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      dispatch(showNotification({
        type: 'error',
        message: error.message === 'Project not found' 
          ? 'Project not found. Please check the code and try again.'
          : 'Error loading project. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Continue Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your project code to continue working on your design.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Project Code"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
            placeholder="Enter 10-digit code"
            inputProps={{ 
              maxLength: 10,
              style: { letterSpacing: '2px', textTransform: 'uppercase' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!projectCode.trim() || loading}
          >
            Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 