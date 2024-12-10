import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { projectService } from '../../services/projectService';
import { showNotification } from '../../store/slices/notificationSlice';

function ProjectStatusManager({ project, onStatusUpdate }) {
  const [status, setStatus] = useState(project.status);
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleStatusChange = async () => {
    try {
      await projectService.updateProjectStatus(project.id, {
        status,
        statusNotes: notes,
        updatedAt: new Date(),
      });

      onStatusUpdate?.();
      setDialogOpen(false);

      dispatch(showNotification({
        type: 'success',
        message: 'Project status updated successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to update project status',
      }));
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="small"
          onClick={() => setDialogOpen(true)}
        >
          Update
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Project Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Status Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProjectStatusManager; 