import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  PendingActions,
  CheckCircle,
  Schedule,
  People,
} from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

function DashboardStats() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    completedProjects: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      
      // Get total projects
      const totalSnapshot = await getDocs(projectsRef);
      const total = totalSnapshot.size;

      // Get pending projects
      const pendingSnapshot = await getDocs(
        query(projectsRef, where('status', '==', 'pending'))
      );
      const pending = pendingSnapshot.size;

      // Get completed projects
      const completedSnapshot = await getDocs(
        query(projectsRef, where('status', '==', 'completed'))
      );
      const completed = completedSnapshot.size;

      // Get unique customers
      const customers = new Set();
      totalSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userDetails?.email) {
          customers.add(data.userDetails.email);
        }
      });

      setStats({
        totalProjects: total,
        pendingProjects: pending,
        completedProjects: completed,
        totalCustomers: customers.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PendingActions color="primary" />
            <Box>
              <Typography variant="h4">{stats.totalProjects}</Typography>
              <Typography color="textSecondary">Total Projects</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Schedule color="warning" />
            <Box>
              <Typography variant="h4">{stats.pendingProjects}</Typography>
              <Typography color="textSecondary">Pending Projects</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle color="success" />
            <Box>
              <Typography variant="h4">{stats.completedProjects}</Typography>
              <Typography color="textSecondary">Completed Projects</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <People color="info" />
            <Box>
              <Typography variant="h4">{stats.totalCustomers}</Typography>
              <Typography color="textSecondary">Total Customers</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardStats; 