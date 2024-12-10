import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  IconButton,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';

function TextControls({ canvas }) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const handleFontChange = (event) => {
    setFontFamily(event.target.value);
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontFamily', event.target.value);
        canvas.renderAll();
      }
    }
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontSize', newValue);
        canvas.renderAll();
      }
    }
  };

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Font</InputLabel>
          <Select value={fontFamily} onChange={handleFontChange} label="Font">
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ width: 100 }}>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            min={8}
            max={72}
            valueLabelDisplay="auto"
          />
        </Box>

        <IconButton onClick={() => setBold(!bold)}>
          <FormatBold color={bold ? 'primary' : 'inherit'} />
        </IconButton>
        <IconButton onClick={() => setItalic(!italic)}>
          <FormatItalic color={italic ? 'primary' : 'inherit'} />
        </IconButton>
        <IconButton onClick={() => setUnderline(!underline)}>
          <FormatUnderlined color={underline ? 'primary' : 'inherit'} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TextControls; 