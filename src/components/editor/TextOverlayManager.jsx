import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Add,
} from '@mui/icons-material';
import { fabric } from 'fabric';
import { useSelector } from 'react-redux';

function TextOverlayManager({ canvas, onComplete }) {
  const [text, setText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  const { availableFonts = [] } = useSelector((state) => state.fonts || { availableFonts: [] });

  const addTextToCanvas = () => {
    if (!canvas || !text.trim()) return;

    const fabricText = new fabric.IText(text, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily,
      fontWeight: textStyle.bold ? 'bold' : 'normal',
      fontStyle: textStyle.italic ? 'italic' : 'normal',
      underline: textStyle.underline,
      textAlign: textStyle.align,
      fill: textColor,
    });

    canvas.add(fabricText);
    canvas.setActiveObject(fabricText);
    canvas.renderAll();
    setText('');
    onComplete?.();
  };

  const toggleStyle = (style) => {
    setTextStyle(prev => ({
      ...prev,
      [style]: !prev[style]
    }));
  };

  const toggleTextColor = () => {
    setTextColor(prev => prev === '#000000' ? '#FFFFFF' : '#000000');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Text Overlay
      </Typography>

      <Box sx={{ mb: 1 }}>
        <TextField
          fullWidth
          label="Enter Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={1}
          size="small"
        />
      </Box>

      <Box sx={{ mb: 1 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Font Family</InputLabel>
          <Select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            label="Font Family"
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            {availableFonts.map((font) => (
              <MenuItem key={font.id} value={font.name}>
                {font.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 1, 
        flexWrap: 'wrap',
        '& > button': {
          minWidth: '32px',
          height: '32px',
          padding: '4px',
          bgcolor: theme => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
          color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          '&:hover': {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'
          },
          '&.Mui-selected': {
            bgcolor: theme => theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
            color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
          }
        }
      }}>
        <IconButton 
          size="small"
          onClick={() => toggleStyle('bold')}
          color={textStyle.bold ? 'primary' : 'default'}
        >
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={toggleTextColor}
          sx={{ 
            bgcolor: textColor === '#000000' ? 'white' : 'black',
            border: '1px solid',
            borderColor: 'grey.300',
            '&:hover': {
              bgcolor: textColor === '#000000' ? 'grey.100' : 'grey.900',
            },
            '&::after': {
              content: '""',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: textColor,
              display: 'block'
            }
          }}
        >
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => toggleStyle('italic')}
          color={textStyle.italic ? 'primary' : 'default'}
        >
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => toggleStyle('underline')}
          color={textStyle.underline ? 'primary' : 'default'}
        >
          <FormatUnderlined fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => setTextStyle(prev => ({ ...prev, align: 'left' }))}
          color={textStyle.align === 'left' ? 'primary' : 'default'}
        >
          <FormatAlignLeft fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => setTextStyle(prev => ({ ...prev, align: 'center' }))}
          color={textStyle.align === 'center' ? 'primary' : 'default'}
        >
          <FormatAlignCenter fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => setTextStyle(prev => ({ ...prev, align: 'right' }))}
          color={textStyle.align === 'right' ? 'primary' : 'default'}
        >
          <FormatAlignRight fontSize="small" />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add fontSize="small" />}
        onClick={addTextToCanvas}
        disabled={!text.trim()}
        size="small"
        fullWidth
      >
        Add Text
      </Button>
    </Box>
  );
}

export default TextOverlayManager; 