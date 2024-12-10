import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { settingsService } from '../../services/settingsService';
import { settingsSchema } from '../../utils/validation';

function Settings() {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    notificationsEnabled: true,
    autoApproval: false,
    maxProjectSize: 10,
    defaultProjectStatus: 'pending',
    emailTemplates: {
      projectSubmission: true,
      statusUpdate: true,
      completion: true,
    },
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await settingsService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load settings'
      }));
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsSchema.validate(settings, { abortEarly: false });
      await settingsService.updateSettings(settings);
      dispatch(showNotification({
        type: 'success',
        message: 'Settings updated successfully'
      }));
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to update settings'
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <Typography variant="h6" gutterBottom>
            Company Information
          </Typography>
          
          <TextField
            fullWidth
            label="Company Name"
            value={settings.companyName}
            onChange={handleChange('companyName')}
            error={!!errors.companyName}
            helperText={errors.companyName}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={settings.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* Project Settings */}
          <Typography variant="h6" gutterBottom>
            Project Settings
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Default Project Status</InputLabel>
            <Select
              value={settings.defaultProjectStatus}
              onChange={handleChange('defaultProjectStatus')}
              label="Default Project Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Max Project Size (MB)"
            type="number"
            value={settings.maxProjectSize}
            onChange={handleChange('maxProjectSize')}
            margin="normal"
          />
          
          <Divider sx={{ my: 3 }} />
          
          {/* Notification Settings */}
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.notificationsEnabled}
                onChange={handleChange('notificationsEnabled')}
              />
            }
            label="Enable Email Notifications"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoApproval}
                onChange={handleChange('autoApproval')}
              />
            }
            label="Auto-approve New Projects"
          />
          
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained">
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Settings; 