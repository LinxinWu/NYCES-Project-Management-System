import { useState } from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  IconButton,
} from '@mui/material';
import {
  TextFields,
  Image,
  InsertDriveFile,
  Layers,
  Close
} from '@mui/icons-material';

import TextOverlayManager from './TextOverlayManager';
import VectorUploadManager from './VectorUploadManager';
import BackgroundImageUpload from './BackgroundImageUpload';
import ObjectManager from './ObjectManager';

function MobileToolbar({ canvas }) {
  const [open, setOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleClose = () => {
    setSelectedTool(null);
  };

  const tools = [
    { icon: <TextFields />, name: 'Text', component: TextOverlayManager },
    { icon: <InsertDriveFile />, name: 'Vector', component: VectorUploadManager },
    { icon: <Image />, name: 'Background', component: BackgroundImageUpload },
    { icon: <Layers />, name: 'Objects', component: ObjectManager }
  ];

  return (
    <>
      <Box sx={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }
      }}>
        <SpeedDial
          ariaLabel="Editor Tools"
          icon={<SpeedDialIcon />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          {tools.map((tool) => (
            <SpeedDialAction
              key={tool.name}
              icon={tool.icon}
              tooltipTitle={tool.name}
              onClick={() => {
                setSelectedTool(tool);
                setOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      </Box>

      <Dialog
        fullScreen
        open={Boolean(selectedTool)}
        onClose={handleClose}
        sx={{ 
          display: { xs: 'block', md: 'none' },
          '& .MuiDialog-paper': { 
            background: 'rgba(255,255,255,0.95)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
          {selectedTool && <selectedTool.component canvas={canvas} />}
        </Box>
      </Dialog>
    </>
  );
}

export default MobileToolbar; 