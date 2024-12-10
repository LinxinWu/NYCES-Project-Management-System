import { useRef } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

function FileUploadStep({ files, onFileChange, onFileDelete }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    onFileChange(selectedFiles);
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        accept=".svg,.ai,.pdf"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        onClick={() => fileInputRef.current?.click()}
        sx={{ mb: 2 }}
      >
        Upload Files
      </Button>

      <List>
        {files.map((file, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onFileDelete(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {files.length === 0 && (
        <Typography color="text.secondary" align="center">
          No files uploaded yet
        </Typography>
      )}
    </Box>
  );
}

export default FileUploadStep; 