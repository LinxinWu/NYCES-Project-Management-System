import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { vectorService } from '../../services/vectorService';
import { showNotification } from '../../store/slices/notificationSlice';
import { addVectorGraphic } from '../../store/slices/projectSlice';

function VectorAssets({ canvas }) {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await vectorService.uploadVector(file, currentProject.id);
      
      if (file.name.toLowerCase().endsWith('.svg')) {
        await vectorService.loadSVGToCanvas(url, canvas);
      }

      dispatch(addVectorGraphic({ url, name: file.name }));
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

  return (
    <Box>
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
            variant="outlined"
            component="span"
            startIcon={<Add />}
            disabled={uploading}
            fullWidth
          >
            Add Vector File
          </Button>
        </label>
      </Box>

      <List>
        {currentProject.vectorGraphics.map((vector, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={vector.name}
              secondary={vector.url}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default VectorAssets; 