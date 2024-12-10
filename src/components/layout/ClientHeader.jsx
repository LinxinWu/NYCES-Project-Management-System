import { AppBar, Toolbar, Typography, Container, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

function ClientHeader() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar 
      position="static" 
      sx={{
        bgcolor: theme => theme.palette.mode === 'dark' ? '#1f2937' : '#333',
      }}
      elevation={1}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: '#ffffff',
              flexGrow: 1,
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            NYC Engraving Service
          </Typography>
          <IconButton 
            onClick={toggleTheme} 
            sx={{
              color: '#ffffff',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ClientHeader; 