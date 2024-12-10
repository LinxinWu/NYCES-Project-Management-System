import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { fontService } from '../../services/fontService';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

function FontManager() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    setLoading(true);
    try {
      const fontList = await fontService.getFonts();
      setFonts(fontList);
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load fonts',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFontUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      await fontService.uploadFont(file);
      await loadFonts();
      dispatch(showNotification({
        type: 'success',
        message: 'Font uploaded successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to upload font',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fontId) => {
    if (!window.confirm('Are you sure you want to delete this font?')) return;

    setLoading(true);
    try {
      await fontService.deleteFont(fontId);
      await loadFonts();
      dispatch(showNotification({
        type: 'success',
        message: 'Font deleted successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to delete font',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Font Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <input
          accept=".ttf,.otf"
          style={{ display: 'none' }}
          id="font-upload"
          type="file"
          onChange={handleFontUpload}
          disabled={loading}
        />
        <label htmlFor="font-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<Add />}
            disabled={loading}
          >
            Upload Font
          </Button>
        </label>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {fonts.map((font) => (
            <ListItem key={font.id}>
              <ListItemText
                primary={font.name}
                secondary={new Date(font.createdAt.toDate()).toLocaleDateString()}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(font.id)}
                  disabled={loading}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default FontManager; 