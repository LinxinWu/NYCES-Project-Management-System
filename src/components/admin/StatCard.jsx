import { Paper, Typography, Box } from '@mui/material';

function StatCard({ title, value, color = 'primary' }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography color="textSecondary" variant="subtitle2">
        {title}
      </Typography>
      <Typography variant="h4" color={`${color}.main`}>
        {value}
      </Typography>
    </Paper>
  );
}

export default StatCard; 