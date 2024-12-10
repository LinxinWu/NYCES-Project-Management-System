import { useState } from 'react';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProjectTypeSelection from '../components/wizard/ProjectTypeSelection';
import MaterialSelection from '../components/wizard/MaterialSelection';
import SizeSelection from '../components/wizard/SizeSelection';
import { createProject } from '../store/slices/projectSlice';

const steps = ['Project Type', 'Material', 'Size & Options'];

function ProjectWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState({
    type: '',
    material: '',
    size: '',
    options: {},
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const project = await dispatch(createProject(projectData)).unwrap();
      navigate(`/editor/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProjectTypeSelection
            value={projectData.type}
            onChange={(type) => setProjectData({ ...projectData, type })}
          />
        );
      case 1:
        return (
          <MaterialSelection
            value={projectData.material}
            onChange={(material) => setProjectData({ ...projectData, material })}
            projectType={projectData.type}
          />
        );
      case 2:
        return (
          <SizeSelection
            value={projectData.size}
            options={projectData.options}
            onChange={(size, options) => setProjectData({ ...projectData, size, options })}
            material={projectData.material}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Create Project' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProjectWizard; 