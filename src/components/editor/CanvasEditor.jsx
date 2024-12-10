import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { fabric } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';

// Default canvas dimensions
const DESKTOP_WIDTH = 1200;  // Increased base width
const DESKTOP_HEIGHT = 800;  // Increased base height
const MOBILE_WIDTH = 600;   // Increased mobile width
const MOBILE_HEIGHT = 900;  // Increased mobile height
const PADDING = 32;

function CanvasEditor({ onCanvasReady }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);

  const updateCanvasSize = () => {
    if (!fabricRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    // Get container dimensions
    const containerWidth = container.clientWidth - PADDING;
    const containerHeight = container.clientHeight - PADDING;
    
    // Set canvas container size to match parent box
    const canvasContainer = container.querySelector('.canvas-container');
    if (canvasContainer) {
      canvasContainer.style.width = '100%';
      canvasContainer.style.height = '100%';
    }
    
    // Set canvas size to match container
    const width = containerWidth;
    const height = containerHeight;
    
    fabricRef.current.setWidth(width);
    fabricRef.current.setHeight(height);
    
    // Center the canvas within its container
    if (canvasContainer) {
      canvasContainer.style.display = 'flex';
      canvasContainer.style.justifyContent = 'center';
      canvasContainer.style.alignItems = 'center';
      canvasContainer.style.position = 'absolute';
      canvasContainer.style.top = '0';
      canvasContainer.style.left = '0';
      canvasContainer.style.right = '0';
      canvasContainer.style.bottom = '0';
    }
    
    fabricRef.current.renderAll();
  };

  useEffect(() => {
    // Initialize canvas with responsive dimensions
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth - PADDING,
      height: containerRef.current.clientHeight - PADDING,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    // Clear any existing background image
    fabricRef.current.setBackgroundImage(null, fabricRef.current.renderAll.bind(fabricRef.current));

    // Load existing canvas data first
    if (currentProject?.canvasData) {
      const canvasData = JSON.parse(currentProject.canvasData);
      // Filter out background image from objects array
      if (canvasData.objects) {
        canvasData.objects = canvasData.objects.filter(obj => obj.name !== 'backgroundImage');
        // Remove any background image from the canvas data
        delete canvasData.backgroundImage;
      }
      fabricRef.current.loadFromJSON(canvasData, () => {
        fabricRef.current.renderAll();
      });
    }

    // Handle background image from wizard
    if (location.state?.backgroundImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          // Remove any existing background image first
          const existingBg = fabricRef.current.getObjects().find(obj => obj.name === 'backgroundImage');
          if (existingBg) {
            fabricRef.current.remove(existingBg);
          }

          // Calculate scale to fit the canvas while maintaining aspect ratio
          const scale = Math.min(
            fabricRef.current.width / img.width,
            fabricRef.current.height / img.height
          );
          
          // Set image properties
          img.set({
            left: fabricRef.current.width / 2,
            top: fabricRef.current.height / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            lockUniScaling: true,
            name: 'backgroundImage',
            selectable: true,
            evented: true
          });
          
          // Add image to canvas
          fabricRef.current.add(img);
          fabricRef.current.sendToBack(img);
          fabricRef.current.renderAll();
        });
      };
      reader.readAsDataURL(location.state.backgroundImage);
    }

    // Add undo/redo capability
    const history = [];
    let historyIndex = -1;

    fabricRef.current.on('object:modified', () => {
      const json = JSON.stringify(fabricRef.current.toJSON());
      // Remove any background image from history
      const historyData = JSON.parse(json);
      delete historyData.backgroundImage;
      const cleanJson = JSON.stringify(historyData);
      history.splice(historyIndex + 1);
      history.push(cleanJson);
      historyIndex++;
    });

    fabricRef.current.undo = function() {
      if (historyIndex > 0) {
        historyIndex--;
        const json = history[historyIndex];
        fabricRef.current.loadFromJSON(JSON.parse(json), () => {
          fabricRef.current.renderAll();
        });
      }
    };

    fabricRef.current.redo = function() {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const json = history[historyIndex];
        fabricRef.current.loadFromJSON(JSON.parse(json), () => {
          fabricRef.current.renderAll();
        });
      }
    };

    onCanvasReady?.(fabricRef.current);

    return () => {
      fabricRef.current.dispose();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%',
        height: '100%',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#202020' : '#ffffff',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: theme => 
          theme.palette.mode === 'dark' 
            ? '0 0 10px rgba(0,0,0,0.5)' 
            : '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 0,
        position: 'relative',
        '& .canvas-container': {
          width: '100% !important',
          height: '100% !important',
          display: 'flex !important',
          justifyContent: 'center !important',
          alignItems: 'center !important',
          backgroundColor: theme => 
            theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f8f8',
          borderRadius: 1,
          margin: '0 !important',
          position: 'relative !important',
          '& canvas': {
            borderRadius: 1,
            boxShadow: theme =>
              theme.palette.mode === 'dark'
                ? '0 0 15px rgba(0,0,0,0.3)'
                : '0 0 10px rgba(0,0,0,0.1)',
            width: '100% !important',
            height: '100% !important',
            maxWidth: '100% !important',
            maxHeight: '100% !important'
          }
        }
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default CanvasEditor; 