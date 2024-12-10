import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { fabric } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { projectService } from '../../services/projectService';
import { showNotification } from '../../store/slices/notificationSlice';

function Canvas({ onCanvasReady }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);

  useEffect(() => {
    // Initialize Fabric canvas
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });

    // Load background image if exists
    if (currentProject.backgroundImage) {
      fabric.Image.fromURL(currentProject.backgroundImage, (img) => {
        img.scaleToWidth(800);
        fabricRef.current.setBackgroundImage(img, fabricRef.current.renderAll.bind(fabricRef.current));
      });
    }

    // Load saved canvas state if exists
    if (currentProject.canvasData) {
      fabricRef.current.loadFromJSON(currentProject.canvasData, () => {
        fabricRef.current.renderAll();
        dispatch(showNotification({
          type: 'success',
          message: 'Project loaded successfully',
        }));
      });
    }

    // Set up auto-save
    const handleModification = () => {
      if (currentProject.id) {
        projectService.updateProject(currentProject.id, {
          canvasData: fabricRef.current.toJSON(),
          lastModified: new Date(),
        }).catch(error => {
          console.error('Error auto-saving:', error);
        });
      }
    };

    fabricRef.current.on('object:modified', handleModification);
    onCanvasReady?.(fabricRef.current);

    return () => {
      fabricRef.current.dispose();
    };
  }, [currentProject.id]);

  return (
    <Box sx={{ 
      border: '1px solid #ccc', 
      borderRadius: 1,
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default Canvas; 