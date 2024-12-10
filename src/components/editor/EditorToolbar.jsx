import { Box, IconButton, Tooltip, Divider, Button } from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Delete,
  Save,
  GetApp,
  Layers,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/slices/notificationSlice';
import { projectService } from '../../services/projectService';

function EditorToolbar({ canvas, onSave }) {
  const dispatch = useDispatch();

  const handleZoomIn = () => {
    if (canvas) {
      canvas.setZoom(canvas.getZoom() * 1.1);
      canvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    if (canvas) {
      canvas.setZoom(canvas.getZoom() / 1.1);
      canvas.renderAll();
    }
  };

  const handleUndo = () => {
    if (canvas && canvas._objects.length > 0) {
      canvas.undo();
    }
  };

  const handleRedo = () => {
    if (canvas) {
      canvas.redo();
    }
  };

  const handleDelete = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
      }
    }
  };

  const handleExport = async () => {
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = 'engraving-design.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch(showNotification({
        type: 'success',
        message: 'Design exported successfully',
      }));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to export design',
      }));
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1, 
      p: 1, 
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
    }}>
      <Tooltip title="Zoom In">
        <IconButton onClick={handleZoomIn}>
          <ZoomIn />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={handleZoomOut}>
          <ZoomOut />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Undo">
        <IconButton onClick={handleUndo}>
          <Undo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton onClick={handleRedo}>
          <Redo />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Delete Selected">
        <IconButton onClick={handleDelete}>
          <Delete />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Button
        startIcon={<Save />}
        variant="contained"
        onClick={onSave}
        size="small"
      >
        Save
      </Button>
      <Button
        startIcon={<GetApp />}
        variant="outlined"
        onClick={handleExport}
        size="small"
      >
        Export
      </Button>
    </Box>
  );
}

export default EditorToolbar; 