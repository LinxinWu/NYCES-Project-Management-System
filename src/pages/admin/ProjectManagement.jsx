import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ProjectList from '../../components/admin/ProjectList';
import ProjectSearch from '../../components/admin/ProjectSearch';
import { useNavigate } from 'react-router-dom';

function ProjectManagement() {
  const [searchParams, setSearchParams] = useState({});
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Project Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/wizard')}
        >
          New Project
        </Button>
      </Box>
      
      <ProjectSearch onSearch={setSearchParams} />
      <ProjectList searchParams={searchParams} />
    </Box>
  );
}

export default ProjectManagement; 