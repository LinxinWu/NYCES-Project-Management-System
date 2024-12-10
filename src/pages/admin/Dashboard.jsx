import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ProjectAnalytics from '../../components/admin/ProjectAnalytics';
import RecentProjects from '../../components/admin/RecentProjects';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const [totalSnap, pendingSnap, completedSnap] = await Promise.all([
        getDocs(projectsRef),
        getDocs(query(projectsRef, where('status', '==', 'pending'))),
        getDocs(query(projectsRef, where('status', '==', 'completed'))),
      ]);

      setStats({
        total: totalSnap.size,
        pending: pendingSnap.size,
        completed: completedSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <ProjectAnalytics stats={stats} />
        </Grid>

        <Grid item xs={12}>
          <RecentProjects />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 