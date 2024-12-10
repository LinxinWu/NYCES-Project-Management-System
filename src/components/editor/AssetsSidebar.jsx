import { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { fabric } from 'fabric';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AssetsSidebar({ canvas }) {
  const [tab, setTab] = useState(0);
  const [textLayers, setTextLayers] = useState([]);

  const handleAddText = () => {
    if (canvas) {
      const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      setTextLayers([...textLayers, text]);
    }
  };

  return (
    <Paper sx={{ width: 300 }}>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Layers" />
        <Tab label="Assets" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Button variant="contained" onClick={handleAddText} fullWidth>
          Add Text
        </Button>
        <List>
          {textLayers.map((layer, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Text Layer ${index + 1}`} />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Typography>
          Drag and drop vector files here
        </Typography>
      </TabPanel>
    </Paper>
  );
}

export default AssetsSidebar; 