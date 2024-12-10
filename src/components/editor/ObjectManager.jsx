import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Delete,
  ExpandLess,
  ExpandMore,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function ObjectManager({ canvas }) {
  const [objects, setObjects] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    const updateObjectsList = () => {
      const canvasObjects = canvas.getObjects();
      setObjects(canvasObjects);
    };

    canvas.on('object:added', updateObjectsList);
    canvas.on('object:removed', updateObjectsList);
    canvas.on('object:modified', updateObjectsList);
    canvas.on('object:visibility', updateObjectsList);

    updateObjectsList();

    return () => {
      canvas.off('object:added', updateObjectsList);
      canvas.off('object:removed', updateObjectsList);
      canvas.off('object:modified', updateObjectsList);
      canvas.off('object:visibility', updateObjectsList);
    };
  }, [canvas]);

  const handleToggleVisibility = (obj) => {
    obj.visible = !obj.visible;
    canvas.renderAll();
    canvas.fire('object:visibility');
  };

  const handleDelete = (obj) => {
    canvas.remove(obj);
    canvas.renderAll();
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const getObjectName = (obj) => {
    switch (obj.type) {
      case 'image':
        return obj.name === 'backgroundImage' ? '🖼 Background' : '🖼 Image';
      case 'path':
      case 'group':
        return '⚡ Vector';
      case 'i-text':
      case 'text':
        return `📝 ${obj.text?.substring(0, 15)}${obj.text?.length > 15 ? '...' : ''}`;
      default:
        return `⚪ ${obj.type}`;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          cursor: 'pointer',
        }}
        onClick={handleToggleExpand}
      >
        <Typography variant="h6">Objects</Typography>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={expanded}>
        <Divider />
        <List dense sx={{ maxHeight: '300px', overflow: 'auto' }}>
          {objects.map((obj, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={getObjectName(obj)}
                sx={{
                  '& .MuiTypography-root': {
                    color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px'
                  }
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleToggleVisibility(obj)}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  {obj.visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
                <IconButton 
                  edge="end" 
                  onClick={() => handleDelete(obj)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
}

export default ObjectManager; 