import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { showNotification } from '../../store/slices/notificationSlice';

function AdminNavbar({ onToggleSidebar }) {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      dispatch(showNotification({
        type: 'success',
        message: 'Successfully logged out'
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to logout'
      }));
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavbar; 