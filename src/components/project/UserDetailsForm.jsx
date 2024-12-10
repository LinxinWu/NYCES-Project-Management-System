import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../store/slices/projectSlice';
import { projectService } from '../../services/projectService';
import { useNavigate } from 'react-router-dom';

function UserDetailsForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    appointmentTime: new Date(),
    projectType: 'walk-in',
    materialMake: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setUserDetails(formData));
      const result = await projectService.createProject({
        userDetails: formData,
      });
      navigate(`/confirmation/${result.projectCode}`);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Project Details
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          margin="normal"
          required
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Appointment Time"
            value={formData.appointmentTime}
            onChange={(newValue) => setFormData({ ...formData, appointmentTime: newValue })}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Project Type</InputLabel>
          <Select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            label="Project Type"
          >
            <MenuItem value="walk-in">Walk-in</MenuItem>
            <MenuItem value="mail-in">Mail-in</MenuItem>
            <MenuItem value="bulk-sample">Bulk Sample</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Material Make"
          value={formData.materialMake}
          onChange={(e) => setFormData({ ...formData, materialMake: e.target.value })}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Submit Project
        </Button>
      </Box>
    </Paper>
  );
}

export default UserDetailsForm; 