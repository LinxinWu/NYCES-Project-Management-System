import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { exportService } from '../../services/exportService';

function ProjectPreview({ open, onClose, canvas, projectId }) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const generatePreview = async () => {
    setLoading(true);
    try {
      const url = await exportService.generatePreview(canvas, projectId);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    generatePreview();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onEnter={handleOpen}
    >
      <DialogTitle>Project Preview</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt="Project Preview"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '70vh',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography color="error">
            Failed to generate preview
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectPreview; 