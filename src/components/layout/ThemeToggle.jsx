import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <IconButton color="inherit" onClick={toggleTheme}>
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}

export default ThemeToggle; 