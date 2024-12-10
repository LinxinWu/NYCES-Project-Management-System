import { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../store/slices/projectSlice';
import { 
  ArrowBack, 
  TextFields, 
  Upload,
  InsertDriveFile
} from '@mui/icons-material';

function ProjectWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    backgroundImage: null,
    vectorFile: null
  });
  const [preview, setPreview] = useState({
    backgroundUrl: null,
    vectorUrl: null
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const steps = [
    'Choose Project Type',
    'Upload Picture of the item',
    formData.type === 'vector' ? 'Upload Vector File' : null
  ].filter(Boolean);

  const handleTypeSelect = async (type) => {
    setFormData({ ...formData, type });
    setActiveStep(1);
  };

  const handleFileSelect = (file, type) => {
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    
    if (type === 'background') {
      setFormData(prev => ({ ...prev, backgroundImage: file }));
      setPreview(prev => ({ ...prev, backgroundUrl: url }));
    } else {
      setFormData(prev => ({ ...prev, vectorFile: file }));
      setPreview(prev => ({ ...prev, vectorUrl: url }));
    }
  };

  const handleConfirmUpload = () => {
    if (activeStep === 1) {
      if (formData.type === 'vector') {
        setActiveStep(2);
      } else {
        handleCreateProject();
      }
    } else {
      handleCreateProject();
    }
  };

  const handleCreateProject = async () => {
    try {
      const action = await dispatch(createProject({
        type: formData.type,
        status: 'draft',
        createdAt: new Date().toISOString()
      }));
      if (createProject.fulfilled.match(action)) {
        navigate(`/editor/${action.payload.id}`, {
          state: {
            backgroundImage: formData.backgroundImage,
            vectorFile: formData.vectorFile
          }
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
              Choose Your Project Type
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3 
            }}>
              {[
                {
                  type: 'text-only',
                  title: 'Text Only',
                  description: 'Create an engraving with text elements only',
                  icon: <TextFields sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                },
                {
                  type: 'vector',
                  title: 'Vector Design',
                  description: 'Upload your vector graphic for engraving',
                  icon: <InsertDriveFile sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                }
              ].map((option) => (
                <Paper
                  key={option.type}
                  elevation={0}
                  onClick={() => handleTypeSelect(option.type)}
                  sx={{
                    p: 4,
                    cursor: 'pointer',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[4]
                    }
                  }}
                >
                  {option.icon}
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {option.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        );

      case 1:
      case 2:
        const isVectorStep = step === 2;
        const currentPreview = isVectorStep ? preview.vectorUrl : preview.backgroundUrl;
        const currentFile = isVectorStep ? formData.vectorFile : formData.backgroundImage;

        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              {isVectorStep ? 'Upload Vector File' : 'Upload Picture of the item'}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              {isVectorStep 
                ? 'Upload your SVG vector file for engraving'
                : 'Upload a picture of the item you want to engrave'
              }
            </Typography>
            
            {!currentFile ? (
              <label htmlFor={isVectorStep ? "vector-upload" : "background-upload"}>
                <input
                  accept={isVectorStep ? ".svg" : "image/*"}
                  type="file"
                  style={{ display: 'none' }}
                  id={isVectorStep ? "vector-upload" : "background-upload"}
                  onChange={(e) => handleFileSelect(e.target.files[0], isVectorStep ? 'vector' : 'background')}
                />
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Click to Upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isVectorStep ? 'SVG files only' : 'JPG, PNG, WebP supported'}
                  </Typography>
                </Paper>
              </label>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 3,
                    overflow: 'hidden'
                  }}
                >
                  {isVectorStep ? (
                    <object
                      data={currentPreview}
                      type="image/svg+xml"
                      style={{ width: '100%', height: '300px' }}
                    >
                      SVG Preview
                    </object>
                  ) : (
                    <img
                      src={currentPreview}
                      alt="Background Preview"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </Paper>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (isVectorStep) {
                        setFormData(prev => ({ ...prev, vectorFile: null }));
                        setPreview(prev => ({ ...prev, vectorUrl: null }));
                      } else {
                        setFormData(prev => ({ ...prev, backgroundImage: null }));
                        setPreview(prev => ({ ...prev, backgroundUrl: null }));
                      }
                    }}
                  >
                    Choose Different File
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirmUpload}
                  >
                    Continue with this File
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ width: '100%', p: { xs: 2, md: 3 }, mt: 4 }}>
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-label': {
              typography: 'body2'
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        {activeStep > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep((prev) => prev - 1)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover'
                }
              }}
            >
              Back
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ProjectWizard; 