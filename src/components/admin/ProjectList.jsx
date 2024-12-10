import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ProjectSearch from './ProjectSearch';
import { showNotification } from '../../store/slices/notificationSlice';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (filters = {}) => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      let filteredProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply filters
      if (filters.searchTerm) {
        filteredProjects = filteredProjects.filter(project => 
          project.projectCode.includes(filters.searchTerm) ||
          project.userDetails?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      if (filters.status && filters.status !== 'all') {
        filteredProjects = filteredProjects.filter(project => 
          project.status === filters.status
        );
      }

      setProjects(filteredProjects);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to fetch projects',
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <ProjectSearch onSearch={fetchProjects} />
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Code</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.projectCode}</TableCell>
                <TableCell>{project.userDetails?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(project.createdAt?.toDate()).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/projects/${project.id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/editor/${project.id}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ProjectList; 