import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Upload, Delete, Visibility } from '@mui/icons-material';
import { vectorService } from '../../services/vectorService';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

function VectorUpload({ canvas, projectId }) {
  const [uploading, setUploading] = useState(false);
  const [vectors, setVectors] = useState([]);
  const dispatch = useDispatch();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await vectorService.validateVectorFile(file);
      const result = await vectorService.uploadVector(file, projectId);

      if (file.name.toLowerCase().endsWith('.svg')) {
        await vectorService.loadSVGToCanvas(result.url, canvas);
      }

      setVectors([...vectors, { name: file.name, url: result.url }]);
      dispatch(showNotification({
        type: 'success',
        message: 'Vector file uploaded successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to upload vector file',
      }));
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (vector) => {
    try {
      if (vector.name.toLowerCase().endsWith('.svg')) {
        await vectorService.loadSVGToCanvas(vector.url, canvas);
      } else {
        window.open(vector.url, '_blank');
      }
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to preview vector file',
      }));
    }
  };

  const handleDelete = async (vector, index) => {
    try {
      await vectorService.deleteVector(vector.url);
      const newVectors = [...vectors];
      newVectors.splice(index, 1);
      setVectors(newVectors);
      dispatch(showNotification({
        type: 'success',
        message: 'Vector file deleted successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to delete vector file',
      }));
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Vector Graphics
      </Typography>

      <Box sx={{ mb: 2 }}>
        <input
          accept=".svg,.ai,.pdf"
          style={{ display: 'none' }}
          id="vector-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label htmlFor="vector-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
            disabled={uploading}
            fullWidth
          >
            Upload Vector File
          </Button>
        </label>
      </Box>

      <List>
        {vectors.map((vector, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={vector.name}
              secondary={new Date().toLocaleDateString()}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handlePreview(vector)}>
                <Visibility />
              </IconButton>
              <IconButton onClick={() => handleDelete(vector, index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default VectorUpload; 