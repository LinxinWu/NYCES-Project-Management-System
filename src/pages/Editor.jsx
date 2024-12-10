import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Stack,
} from '@mui/material';
import { Save, Menu as MenuIcon } from '@mui/icons-material';
import CanvasEditor from '../components/editor/CanvasEditor';
import TextOverlayManager from '../components/editor/TextOverlayManager';
import VectorUploadManager from '../components/editor/VectorUploadManager';
import EditorToolbar from '../components/editor/EditorToolbar';
import { projectService } from '../services/projectService';
import { fontService } from '../services/fontService';
import { setFonts } from '../store/slices/fontSlice';
import { showNotification } from '../store/slices/notificationSlice';
import BackgroundImageUpload from '../components/editor/BackgroundImageUpload';
import { useNavigate, useLocation } from 'react-router-dom';
import EditorMenuBar from '../components/editor/EditorMenuBar';
import ObjectManager from '../components/editor/ObjectManager';
import { createProject, setCurrentProject } from '../store/slices/projectSlice';

function Editor() {
  const [canvas, setCanvas] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = useSelector((state) => state.project.currentProject);

  const handleCanvasReady = async (fabricCanvas) => {
    setCanvas(fabricCanvas);
    
    // Wait for canvas context to be ready before doing anything
    await new Promise(resolve => {
      if (fabricCanvas.getContext()) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (fabricCanvas.getContext()) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
    
    // Wait for wrapper element to be ready
    await new Promise(resolve => {
      const checkWrapper = () => {
        if (fabricCanvas.wrapperEl && fabricCanvas.wrapperEl.clientWidth) {
          resolve();
        } else {
          setTimeout(checkWrapper, 100);
        }
      };
      checkWrapper();
    });
    
    // Set initial canvas size
    const container = fabricCanvas.wrapperEl;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    fabricCanvas.setDimensions({
      width: containerWidth,
      height: containerHeight
    });
    
    // Configure fabric.js image loading
    fabric.Image.prototype.crossOrigin = 'Anonymous';
    fabric.Image.cors = true;
    
    // Initialize canvas properties
    fabricCanvas.preserveObjectStacking = true;
    fabricCanvas.selection = true;
    fabricCanvas.renderOnAddRemove = false;
    fabricCanvas.originalWidth = containerWidth;
    fabricCanvas.originalHeight = containerHeight;

    console.log('Current project:', currentProject);
    
    // Load existing canvas state if available
    if (currentProject?.id) {
      console.log('Loading project with ID:', currentProject.id);
      try {
        // First try to get the project details
        const project = await projectService.getProject(currentProject.id);
        console.log('Retrieved project:', {
          id: project?.id,
          hasState: !!project?.canvasState,
          type: project?.type
        });
        
        if (!project) {
          throw new Error('Project not found');
        }

        // Update current project in Redux store
        dispatch(setCurrentProject(project));

        const canvasData = await projectService.loadCanvasState(currentProject.id);
        console.log('Loaded canvas data:', canvasData);
        
        if (canvasData) {
          console.log('Starting to load canvas data...');
          
          // Clear existing canvas
          fabricCanvas.clear();
          
          // Set canvas dimensions first
          const width = containerWidth;
          const height = containerHeight;
          console.log('Setting canvas dimensions:', { width, height });
          fabricCanvas.setDimensions({
            width: width,
            height: height
          });
          
          // Set background color
          fabricCanvas.setBackgroundColor(
            canvasData.backgroundColor || '#ffffff',
            fabricCanvas.renderAll.bind(fabricCanvas)
          );
          
          // Load objects one by one
          const loadObject = async (objData) => {
            console.log('Loading object type:', objData.type, objData);
            return new Promise((resolve) => {
              if (objData.type === 'image') {
                fabric.Image.fromURL(
                  objData.src,
                  (img) => {
                    if (objData.isBackground) {
                      // Calculate scale to fit canvas while maintaining aspect ratio
                      const canvasRatio = width / height;
                      const imageRatio = img.width / img.height;
                      
                      let scale;
                      if (canvasRatio > imageRatio) {
                        // Canvas is wider than image
                        scale = height / img.height;
                      } else {
                        // Canvas is taller than image
                        scale = width / img.width;
                      }
                      
                      img.set({
                        ...objData,
                        scaleX: scale,
                        scaleY: scale,
                        originX: 'center',
                        originY: 'center',
                        left: width / 2,
                        top: height / 2,
                        selectable: false,
                        evented: false,
                        isBackground: true
                      });
                      
                      fabricCanvas.add(img);
                      fabricCanvas.sendToBack(img);
                      fabricCanvas.requestRenderAll();
                    } else {
                      // For non-background images, maintain original dimensions and position
                      const originalWidth = img.width;
                      const originalHeight = img.height;
                      
                      img.set({
                        ...objData,
                        scaleX: (objData.width / originalWidth) * (objData.scaleX || 1),
                        scaleY: (objData.height / originalHeight) * (objData.scaleY || 1),
                        left: objData.left,
                        top: objData.top,
                        angle: objData.angle || 0,
                        originX: objData.originX || 'center',
                        originY: objData.originY || 'center'
                      });
                      fabricCanvas.add(img);
                      fabricCanvas.requestRenderAll();
                    }
                    resolve();
                  },
                  { crossOrigin: 'Anonymous' }
                );
              } else if (objData.type === 'path' || objData.type === 'group') {
                // Handle vector objects
                console.log('Adding vector object:', objData);
                const vector = objData.type === 'group' 
                  ? new fabric.Group() 
                  : new fabric.Path(objData.path || '');
                
                vector.set({
                  ...objData,
                  scaleX: objData.scaleX || 1,
                  scaleY: objData.scaleY || 1,
                  left: objData.left || 0,
                  top: objData.top || 0,
                  angle: objData.angle || 0,
                  originX: objData.originX || 'center',
                  originY: objData.originY || 'center',
                  fill: objData.fill,
                  stroke: objData.stroke,
                  strokeWidth: objData.strokeWidth,
                  strokeDashArray: objData.strokeDashArray
                });
                
                if (objData.type === 'group' && objData.objects) {
                  objData.objects.forEach(pathData => {
                    const path = new fabric.Path(pathData.path || '', {
                      ...pathData,
                      scaleX: pathData.scaleX || 1,
                      scaleY: pathData.scaleY || 1
                    });
                    vector.addWithUpdate(path);
                  });
                }
                
                fabricCanvas.add(vector);
                fabricCanvas.requestRenderAll();
                resolve();
              } else if (objData.type === 'text' || objData.type === 'i-text') {
                console.log('Adding text object:', {
                  text: objData.text,
                  font: objData.fontFamily,
                  size: objData.fontSize
                });
                const text = new fabric.Text(objData.text, {
                  ...objData,
                  scaleX: objData.scaleX || 1,
                  scaleY: objData.scaleY || 1,
                  left: objData.left,
                  top: objData.top,
                  angle: objData.angle || 0,
                  originX: objData.originX || 'center',
                  originY: objData.originY || 'center'
                });
                fabricCanvas.add(text);
                fabricCanvas.requestRenderAll();
                resolve();
              } else {
                // Handle any other object types
                fabric.util.enlivenObjects([objData], (objects) => {
                  const obj = objects[0];
                  fabricCanvas.add(obj);
                  fabricCanvas.requestRenderAll();
                  resolve();
                });
              }
            });
          };

          // Load all objects
          console.log('Loading objects:', canvasData.objects.length);
          // Sort objects by their original z-index
          const sortedObjects = [...canvasData.objects].sort((a, b) => {
            if (a.isBackground) return -1;
            if (b.isBackground) return 1;
            return (a.zIndex || 0) - (b.zIndex || 0);
          });
          
          // Load objects sequentially to maintain order
          for (const obj of sortedObjects) {
            await loadObject(obj);
          }

          // Final render after all objects are loaded
          fabricCanvas.renderOnAddRemove = true;
          fabricCanvas.requestRenderAll();
          console.log('Canvas rendering complete');

        } else {
          console.log('No canvas state to load');
        }
      } catch (error) {
        console.error('Error loading canvas state:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          projectId: currentProject.id
        });
      }
    }
  };

  // Handle files from wizard
  useEffect(() => {
    if (canvas && location.state && canvas.getContext()) {
      const { backgroundImage, vectorFile } = location.state;
      
      // Place vector file
      if (vectorFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fabric.loadSVGFromString(e.target.result, (objects, options) => {
            if (!objects || objects.length === 0) {
              throw new Error('Failed to parse SVG');
            }
            const svg = fabric.util.groupSVGElements(objects, options);
            svg.scaleToWidth(200);
            svg.set({
              left: canvas.width / 2,
              top: canvas.height / 2,
              originX: 'center',
              originY: 'center'
            });
            canvas.add(svg);
            canvas.setActiveObject(svg);
            canvas.renderAll();
          });
        };
        reader.readAsText(vectorFile);
      }
    }
  }, [canvas, location.state]);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      const fonts = await fontService.getFonts();
      dispatch(setFonts(fonts));
      // Load font files
      await Promise.all(fonts.map(font => 
        new FontFace(font.name, `url(${font.url})`).load()
      ));
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to load fonts',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canvas) return;

    try {
      let projectCode = currentProject?.id;
      console.log('Current project code:', projectCode);

      // If no project exists, create one
      if (!projectCode) {
        const action = await dispatch(createProject({
          type: 'design',
          status: 'draft',
          createdAt: new Date().toISOString()
        }));
        
        if (createProject.fulfilled.match(action)) {
          projectCode = action.payload.id;
          console.log('New project code created:', projectCode);
        } else {
          throw new Error('Failed to create project');
        }
      }

      // Get canvas state
      const canvasData = {
        ...canvas.toJSON(),
        objects: canvas.getObjects().map((obj, index) => {
          const jsonObj = obj.toJSON();
          
          if (obj.type === 'image') {
            return {
              ...jsonObj,
              src: obj.getSrc() || obj.src,
              crossOrigin: 'Anonymous',
              originalWidth: obj.width,
              originalHeight: obj.height,
              originalScaleX: obj.scaleX,
              originalScaleY: obj.scaleY,
              zIndex: index
            };
          } else if (obj.type === 'path' || obj.type === 'group') {
            // Handle vector objects
            const vectorJson = obj.toObject();
            // If it's a group, we need to save all the paths in the group
            if (obj.type === 'group') {
              const paths = obj.getObjects().map(path => path.toObject());
              return {
                ...vectorJson,
                type: 'group',
                objects: paths,
                zIndex: index,
                left: obj.left,
                top: obj.top,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                angle: obj.angle
              };
            }
            // For single paths
            return {
              ...vectorJson,
              type: obj.type,
              zIndex: index,
              path: obj.path,
              objects: obj.type === 'group' 
                ? obj.getObjects().map(path => ({
                    ...path.toObject(),
                    path: path.path,
                    scaleX: path.scaleX,
                    scaleY: path.scaleY
                  }))
                : undefined,
              left: obj.left,
              top: obj.top,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              angle: obj.angle,
              fill: obj.fill,
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth,
              strokeDashArray: obj.strokeDashArray,
              originX: obj.originX || 'center',
              originY: obj.originY || 'center'
            };
          } else {
            return {
              ...jsonObj,
              originalScaleX: obj.scaleX,
              originalScaleY: obj.scaleY,
              zIndex: index
            };
          }
        })
      };

      console.log('Canvas state to save:', {
        version: canvasData.version,
        objectCount: canvasData.objects?.length || 0,
        hasBackground: !!canvasData.backgroundImage
      });

      // Generate a lower quality thumbnail
      const thumbnail = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.3,
        multiplier: 0.5
      });

      // Save the state
      await projectService.saveCanvasState(
        projectCode,
        canvasData,
        thumbnail
      );

      console.log('Project saved successfully:', projectCode);

      dispatch(showNotification({
        type: 'success',
        message: 'Design submitted successfully'
      }));
      
      navigate('/projects');
    } catch (error) {
      console.error('Error saving canvas:', error);
      console.error('Save error details:', {
        error: error.message,
        currentProject: currentProject?.id
      });
      dispatch(showNotification({
        type: 'error',
        message: 'Failed to submit design'
      }));
    }
  };

  // Add effect to handle project loading
  useEffect(() => {
    const loadProject = async () => {
      const pathParts = window.location.pathname.split('/');
      const projectId = pathParts[pathParts.indexOf('editor') + 1];
      
      if (projectId) {
        try {
          const project = await projectService.getProject(projectId);
          if (project) {
            console.log('Loading project:', project);
            dispatch(setCurrentProject(project));
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    };

    loadProject();
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#1a1a1a' : '#f0f0f0'
      }}
    >
      {/* Main Menu Bar */}
      <EditorMenuBar canvas={canvas} onSave={handleSubmit} />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: 200,
            borderRight: 1,
            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            bgcolor: theme => theme.palette.mode === 'dark' ? '#202020' : '#ffffff',
            display: { xs: 'none', md: 'block' },
            overflow: 'auto',
            '& .MuiTypography-root': {
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
            },
            '& .MuiIconButton-root': {
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <ObjectManager canvas={canvas} />
        </Paper>

        {/* Canvas Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 2 },
            height: 'calc(100vh - 96px)',
            bgcolor: theme => theme.palette.mode === 'dark' ? '#1a1a1a' : '#f0f0f0',
            '& > div': {
              flex: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              overflow: 'hidden'
            }
          }}
        >
          <CanvasEditor onCanvasReady={handleCanvasReady} />
        </Box>

        {/* Right Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: 260,
            borderLeft: 1,
            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            bgcolor: theme => theme.palette.mode === 'dark' ? '#202020' : '#ffffff',
            display: { xs: 'none', md: 'block' },
            overflow: 'auto',
            '& .MuiTypography-root': {
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
            },
            '& .MuiButton-root': {
              bgcolor: theme => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: theme => theme.palette.mode === 'dark' ? '#444' : '#e0e0e0'
              }
            },
            '& .MuiIconButton-root': {
              color: theme => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <Stack 
            spacing={0} 
            divider={
              <Divider 
                sx={{ 
                  borderColor: theme => 
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
                }} 
              />
            }
          >
            <Box sx={{ p: 2 }}>
              <BackgroundImageUpload canvas={canvas} />
            </Box>
            <Box sx={{ p: 2 }}>
              <VectorUploadManager canvas={canvas} />
            </Box>
            <Box sx={{ p: 2 }}>
              <TextOverlayManager canvas={canvas} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default Editor; 