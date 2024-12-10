import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert, IconButton } from '@mui/material';
import { Upload, Delete } from '@mui/icons-material';
import { fabric } from 'fabric';
import { compressImage } from '../../utils/imageCompressor';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function BackgroundImageUpload({ canvas, onComplete }) {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG or WebP images.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 5MB.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError(null);

    try {
      validateFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Create a new image to get dimensions
        const img = new Image();
        img.onload = () => {
          fabric.Image.fromURL(
            e.target.result,
            (fabricImg) => {
              // Calculate scale to fit canvas while maintaining aspect ratio
              const canvasRatio = canvas.width / canvas.height;
              const imageRatio = img.width / img.height;
              
              let scale;
              if (canvasRatio > imageRatio) {
                // Canvas is wider than image
                scale = canvas.width / img.width;
              } else {
                // Canvas is taller than image
                scale = canvas.height / img.height;
              }
              
              fabricImg.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                left: canvas.width / 2,
                top: canvas.height / 2,
                selectable: false,
                evented: false,
                isBackground: true,
                originalWidth: img.width,
                originalHeight: img.height
              });
              
              canvas.add(fabricImg);
              canvas.sendToBack(fabricImg);
              canvas.renderAll();
            },
            { crossOrigin: 'Anonymous' }
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError(error.message);
    }
  };

  const removeBackground = () => {
    const existingBg = canvas.getObjects().find(obj => obj.name === 'backgroundImage');
    if (existingBg) {
      canvas.remove(existingBg);
      canvas.renderAll();
    }
    setBackgroundImage(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Background Image
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="background-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="background-upload" style={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            component="span"
            startIcon={<Upload />}
            fullWidth
            size="small"
            sx={{
              bgcolor: theme => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'
              }
            }}
          >
            Upload Background
          </Button>
        </label>
        
        {backgroundImage && (
          <IconButton
            color="error"
            onClick={removeBackground}
          >
            <Delete />
          </IconButton>
        )}
      </Box>
      
      {backgroundImage && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Current: {backgroundImage}
        </Typography>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Accepted formats: JPG, PNG, WebP (max 5MB)
      </Typography>
    </Box>
  );
}

export default BackgroundImageUpload; 