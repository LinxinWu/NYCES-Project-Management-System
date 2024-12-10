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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Upload, Delete, Visibility } from '@mui/icons-material';
import { fontService } from '../../services/fontService';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

function FontManagement() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewFont, setPreviewFont] = useState(null);
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
      const result = await fontService.uploadFont(file);
      setFonts([...fonts, result]);
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
    try {
      await fontService.deleteFont(fontId);
      setFonts(fonts.filter(f => f.id !== fontId));
      dispatch(showNotification({
        type: 'success',
        message: 'Font deleted successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to delete font',
      }));
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
            startIcon={loading ? <CircularProgress size={20} /> : <Upload />}
            disabled={loading}
          >
            Upload Font
          </Button>
        </label>
      </Box>

      <List>
        {fonts.map((font) => (
          <ListItem key={font.id}>
            <ListItemText
              primary={font.name}
              secondary={new Date(font.createdAt.toDate()).toLocaleDateString()}
              sx={{ fontFamily: font.name }}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => setPreviewFont(font)}>
                <Visibility />
              </IconButton>
              <IconButton onClick={() => handleDelete(font.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={!!previewFont} onClose={() => setPreviewFont(null)}>
        <DialogTitle>Font Preview: {previewFont?.name}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: previewFont?.name, fontSize: '2rem' }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </Typography>
          <Typography sx={{ fontFamily: previewFont?.name, fontSize: '2rem' }}>
            abcdefghijklmnopqrstuvwxyz
          </Typography>
          <Typography sx={{ fontFamily: previewFont?.name, fontSize: '2rem' }}>
            0123456789
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default FontManagement; 