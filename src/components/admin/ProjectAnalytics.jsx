import { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import StatCard from './StatCard';

function ProjectAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const [total, pending, completed] = await Promise.all([
        getDocs(projectsRef),
        getDocs(query(projectsRef, where('status', '==', 'pending'))),
        getDocs(query(projectsRef, where('status', '==', 'completed')))
      ]);

      setStats({
        total: total.size,
        pending: pending.size,
        completed: completed.size,
        revenue: calculateRevenue(completed.docs)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = (docs) => {
    return docs.reduce((total, doc) => {
      const data = doc.data();
      return total + (data.price || 0);
    }, 0);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Projects" value={stats.total} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Pending" value={stats.pending} color="warning" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Completed" value={stats.completed} color="success" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Revenue" value={`$${stats.revenue}`} color="info" />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProjectAnalytics; 