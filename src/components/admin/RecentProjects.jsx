import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

function RecentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'), limit(5));
      const snapshot = await getDocs(q);
      
      setProjects(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    } catch (error) {
      console.error('Error fetching recent projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Projects
      </Typography>

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
                <TableCell>{project.status}</TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RecentProjects; 