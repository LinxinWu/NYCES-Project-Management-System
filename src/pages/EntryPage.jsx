import { Typography, Container, Box, Button, Stack, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add, FolderOpen } from '@mui/icons-material';
import { useState } from 'react';
import ProjectCodeInput from '../components/ProjectCodeInput';

function EntryPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openProjectInput, setOpenProjectInput] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 4,
          py: 8
        }}
      >
        {/* Hero Section */}
        <Box sx={{ maxWidth: 800, width: '100%' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #60a5fa 30%, #818cf8 90%)'
                : 'linear-gradient(45deg, #2563eb 30%, #4f46e5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Project Designer
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 6,
              fontWeight: 400
            }}
          >
            Transform your ideas into precision laser engravings
          </Typography>
        </Box>

        {/* Action Cards */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ width: '100%', maxWidth: 1000 }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => navigate('/wizard')}
          >
            <Add sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Start New Project
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Create a new design with our intuitive tool
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              fullWidth
            >
              Create Project
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
            onClick={() => setOpenProjectInput(true)}
          >
            <FolderOpen sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Continue Project
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Resume work on your existing projects using your project code.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FolderOpen />}
              fullWidth
            >
              Continue Project
            </Button>
          </Paper>
        </Stack>

        {/* Additional Info */}
        <Box sx={{ maxWidth: 800, mt: 4 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider'
            }}
          >
            Professional laser engraving services for all materials. 
            Design your custom engravings with our easy-to-use tools.
          </Typography>
        </Box>

        <ProjectCodeInput 
          open={openProjectInput} 
          onClose={() => setOpenProjectInput(false)} 
        />
      </Box>
    </Container>
  );
}

export default EntryPage; 