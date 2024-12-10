import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { fabric } from 'fabric';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

function VectorUploadManager({ canvas }) {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      if (file.name.toLowerCase().endsWith('.svg')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fabric.loadSVGFromString(e.target.result, (objects, options) => {
            if (!objects || objects.length === 0) {
              throw new Error('Failed to parse SVG');
            }

            // Group SVG elements
            const svg = fabric.util.groupSVGElements(objects, options);
            
            // Store original dimensions before scaling
            const originalWidth = svg.width;
            const originalHeight = svg.height;
            
            // Calculate scale to fit while maintaining aspect ratio
            const maxWidth = canvas.width * 0.5;  // 50% of canvas width
            const scale = maxWidth / svg.width;
            
            svg.set({
              scaleX: scale,
              scaleY: scale,
              left: canvas.width / 2,
              top: canvas.height / 2,
              originX: 'center',
              originY: 'center',
              // Store original dimensions and scale for later use
              originalWidth: originalWidth,
              originalHeight: originalHeight,
              originalScaleX: scale,
              originalScaleY: scale,
              // Add type identifier
              type: 'vector',
              // Ensure vector properties are preserved
              strokeWidth: svg.strokeWidth,
              strokeDashArray: svg.strokeDashArray,
              strokeLineCap: svg.strokeLineCap,
              strokeLineJoin: svg.strokeLineJoin,
              strokeMiterLimit: svg.strokeMiterLimit,
              // Store path data
              paths: objects.map(obj => ({
                path: obj.path,
                fill: obj.fill,
                stroke: obj.stroke,
                strokeWidth: obj.strokeWidth,
                strokeDashArray: obj.strokeDashArray
              }))
            });
            
            canvas.add(svg);
            canvas.setActiveObject(svg);
            canvas.renderAll();

            dispatch(showNotification({
              type: 'success',
              message: 'Vector uploaded successfully'
            }));
          });
        };
        reader.readAsText(file);
      } else {
        throw new Error('Invalid file type. Please upload SVG files only.');
      }
    } catch (error) {
      console.error('Error uploading vector:', error);
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to upload vector file'
      }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Vector Graphics
      </Typography>
      
      <input
        accept=".svg"
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
          sx={{
            bgcolor: theme => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
            color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            '&:hover': {
              bgcolor: theme => theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'
            }
          }}
        >
          Upload Vector
        </Button>
      </label>
    </Box>
  );
}

export default VectorUploadManager; 