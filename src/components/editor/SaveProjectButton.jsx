import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { projectService } from '../../services/projectService';

function SaveProjectButton({ canvas }) {
  const [saving, setSaving] = useState(false);
  const currentProject = useSelector((state) => state.project.currentProject);

  const handleSave = async () => {
    if (!canvas || saving) return;

    setSaving(true);
    try {
      // Convert canvas to JSON
      const canvasData = canvas.toJSON();
      
      // Convert canvas to data URL for preview
      const previewImage = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
      });

      // Save project data
      await projectService.updateProject(currentProject.id, {
        canvasData,
        previewImage,
        lastModified: new Date(),
      });

    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
      onClick={handleSave}
      disabled={saving}
    >
      {saving ? 'Saving...' : 'Save Project'}
    </Button>
  );
}

export default SaveProjectButton; 