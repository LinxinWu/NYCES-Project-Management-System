import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Paper,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject, updateProject } from '../../store/slices/projectSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { uploadService } from '../../services/uploadService';
import { projectSchema } from '../../utils/validation';
import FileUploadStep from './FileUploadStep';

const steps = ['Project Details', 'Upload Files', 'Review & Submit'];

function ProjectSubmissionForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    files: [],
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await projectSchema.validate(formData);
        const projectRef = await dispatch(createProject({
          ...formData,
          status: 'pending',
          createdAt: new Date()
        })).unwrap();
        
        const fileUrls = await uploadService.uploadFiles(formData.files, projectRef.id);
        
        await dispatch(updateProject({
          projectId: projectRef.id,
          updates: { fileUrls }
        }));

        dispatch(showNotification({
          type: 'success',
          message: 'Project submitted successfully'
        }));
        navigate('/admin/projects');
      } catch (error) {
        dispatch(showNotification({
          type: 'error',
          message: 'Failed to submit project'
        }));
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, mb: 4 }}>
        {activeStep === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Project Title"
              value={formData.title}
              onChange={handleChange('title')}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              margin="normal"
            />
          </Box>
        )}
        
        {activeStep === 1 && (
          <FileUploadStep
            files={formData.files}
            onFileChange={(files) => setFormData({ ...formData, files })}
            onFileDelete={(index) => {
              const newFiles = [...formData.files];
              newFiles.splice(index, 1);
              setFormData({ ...formData, files: newFiles });
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
}

export default ProjectSubmissionForm; 