import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Box,
  Tooltip,
  Divider,
  Typography,
  Button
} from '@mui/material';
import {
  Save,
  TextFields,
  Image,
  InsertDriveFile,
  Layers,
  Close,
  Menu as MenuIcon,
  ZoomIn,
  ZoomOut,
  FileDownload,
  Send
} from '@mui/icons-material';
import { exportToPDF } from '../../services/exportService';
import { useSelector } from 'react-redux';

import TextOverlayManager from './TextOverlayManager';
import VectorUploadManager from './VectorUploadManager';
import BackgroundImageUpload from './BackgroundImageUpload';
import ObjectManager from './ObjectManager';

function EditorMenuBar({ canvas, onSave }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const { currentProject } = useSelector((state) => state.project);

  const tools = [
    { icon: <TextFields />, name: 'Text', component: TextOverlayManager },
    { icon: <InsertDriveFile />, name: 'Vector', component: VectorUploadManager },
    { icon: <Image />, name: 'Background', component: BackgroundImageUpload },
    { icon: <Layers />, name: 'Objects', component: ObjectManager }
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setSelectedTool(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: theme => theme.palette.mode === 'dark' ? '#202020' : '#333',
        borderBottom: 1,
        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        zIndex: 1100
      }}
    >
      <Toolbar 
        variant="dense" 
        sx={{ 
          minHeight: 40,
          gap: 2
        }}
      >
        {tools.map((tool) => (
          <Tooltip key={tool.name} title={tool.name}>
            <IconButton
              onClick={() => handleToolSelect(tool)}
              size="small"
              sx={{
                color: 'grey.300',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {tool.icon}
            </IconButton>
          </Tooltip>
        ))}

        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'grey.700' }} />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton
              onClick={() => canvas?.setZoom(canvas.getZoom() * 1.1)}
              size="small"
              sx={{ color: 'grey.300' }}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton
              onClick={() => canvas?.setZoom(canvas.getZoom() * 0.9)}
              size="small"
              sx={{ color: 'grey.300' }}
            >
              <ZoomOut />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ 
          ml: 'auto', 
          display: 'flex', 
          gap: 2,
          alignItems: 'center' 
        }}>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'grey.700' }} />
          <Button
            variant="outlined"
            onClick={() => exportToPDF(canvas, currentProject?.projectCode)}
            size="small"
            startIcon={<FileDownload />}
            sx={{
              borderColor: 'grey.700',
              color: 'grey.300',
              '&:hover': {
                borderColor: 'grey.500',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            size="small"
            startIcon={<Send />}
            sx={{
              bgcolor: theme => theme.palette.mode === 'dark' ? '#404040' : '#4a4a4a',
              color: 'grey.100',
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark' ? '#505050' : '#5a5a5a',
              },
              px: 3
            }}
          >
            Submit Design
          </Button>
        </Box>
      </Toolbar>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={Boolean(selectedTool)}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#202020' : '#ffffff',
            color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1, 
          borderBottom: 1, 
          borderColor: 'divider' 
        }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {selectedTool?.name}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDialogClose}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          {selectedTool && (
            <selectedTool.component 
              canvas={canvas} 
              onComplete={handleDialogClose}
            />
          )}
        </Box>
      </Dialog>
    </AppBar>
  );
}

export default EditorMenuBar; 