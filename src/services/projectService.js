import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';
import { storage } from './firebase';
import { generateProjectCode } from '../utils/codeGenerator';
import { compressImage } from '../utils/imageCompressor';

const compressCanvasData = (canvasData) => {
  // Keep only essential data and remove redundant information
  const essentialData = {
    version: canvasData.version,
    objects: canvasData.objects.map(obj => ({
      type: obj.type,
      version: obj.version,
      left: obj.left,
      top: obj.top,
      width: obj.width,
      height: obj.height,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
      ...(obj.type === 'text' || obj.type === 'i-text' ? {
        text: obj.text,
        fontFamily: obj.fontFamily,
        fontSize: obj.fontSize,
        fill: obj.fill,
      } : {}),
      ...(obj.type === 'image' ? {
        // Store only the reference to the image
        storageRef: obj.storageRef || null,
        crossOrigin: obj.crossOrigin,
        filters: obj.filters,
      } : {})
    }))
  };
  return essentialData;
};

const uploadImage = async (imageData, projectId, fileName) => {
  try {
    // Silently compress image
    const compressedImage = await compressImage(imageData);

    // Convert base64 to blob
    const base64Response = await fetch(compressedImage);
    const blob = await base64Response.blob();

    // Upload to Firebase Storage
    const storageRef = ref(storage, `projects/${projectId}/images/${fileName}`);
    await uploadBytes(storageRef, blob);

    // Get the download URL
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const projectService = {
  async createProject(projectData) {
    try {
      const projectCode = generateProjectCode();
      const docRef = doc(db, 'projects', projectCode);
      await setDoc(docRef, {
        ...projectData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      
      return {
        id: projectCode,
        projectCode,
        ...projectData
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  async getProject(projectId) {
    try {
      console.log('Getting project:', projectId);
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.warn('Project document not found');
        throw new Error('Project not found');
      }
      
      const data = docSnap.data();
      // Clean up the data before returning
      const cleanData = {
        id: docSnap.id,
        projectCode: docSnap.id,
        type: data.type || 'design',
        status: data.status || 'draft',
        updatedAt: data.updatedAt,
        canvasState: data.canvasState || null,
        thumbnail: data.thumbnail || null,
        userId: data.userId
      };

      console.log('Project data:', {
        id: cleanData.id,
        type: cleanData.type,
        hasCanvasState: !!cleanData.canvasState,
        updatedAt: cleanData.updatedAt,
        stateLength: cleanData.canvasState ? 
          (typeof cleanData.canvasState === 'string' ? 
            cleanData.canvasState.length : 
            JSON.stringify(cleanData.canvasState).length) : 
          undefined
      });

      return cleanData;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  async updateProject(projectId, updates) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  async uploadVectorFile(file, projectId) {
    try {
      const storageRef = ref(storage, `projects/${projectId}/vectors/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading vector:', error);
      throw error;
    }
  },

  async saveCanvasState(projectId, canvasData, thumbnail) {
    try {
      console.log('Saving canvas state for project:', projectId);

      // Ensure we have a valid canvas state
      if (!canvasData || !canvasData.objects) {
        throw new Error('Invalid canvas data');
      }

      // Clean and prepare canvas data for storage
      const cleanCanvasData = {
        version: canvasData.version,
        width: canvasData.width || 800,
        height: canvasData.height || 600,
        backgroundColor: canvasData.backgroundColor || '#ffffff',
        objects: canvasData.objects.map(obj => {
          const baseObj = {
            type: obj.type,
            version: obj.version,
            originX: obj.originX || 'center',
            originY: obj.originY || 'center',
            left: obj.left || 0,
            top: obj.top || 0,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX || 1,
            scaleY: obj.scaleY || 1,
            angle: obj.angle || 0,
            flipX: obj.flipX || false,
            flipY: obj.flipY || false,
            opacity: obj.opacity || 1,
            visible: obj.visible !== false,
            isBackground: obj.isBackground || false,
            zIndex: obj.zIndex || 0,
            backgroundColor: obj.backgroundColor,
            fillRule: obj.fillRule || 'nonzero',
            paintFirst: obj.paintFirst || 'fill',
            globalCompositeOperation: obj.globalCompositeOperation || 'source-over',
            skewX: obj.skewX || 0,
            skewY: obj.skewY || 0,
          };

          if (obj.type === 'image') {
            return {
              ...baseObj,
              src: obj.src,
              crossOrigin: 'Anonymous',
              originalWidth: obj.originalWidth || obj.width,
              originalHeight: obj.originalHeight || obj.height,
              naturalWidth: obj.naturalWidth || obj.width,
              naturalHeight: obj.naturalHeight || obj.height,
              filters: obj.filters || []
            };
          }

          if (obj.type === 'text' || obj.type === 'i-text') {
            return {
              ...baseObj,
              text: obj.text || '',
              fontSize: obj.fontSize || 40,
              fontFamily: obj.fontFamily || 'Arial',
              fontWeight: obj.fontWeight || 'normal',
              fontStyle: obj.fontStyle || 'normal',
              underline: obj.underline || false,
              overline: obj.overline || false,
              linethrough: obj.linethrough || false,
              textAlign: obj.textAlign || 'left',
              fill: obj.fill || '#000000',
              stroke: obj.stroke || null,
              strokeWidth: obj.strokeWidth || 1
            };
          }

          return baseObj;
        })
      };

      // Convert to string to ensure consistent storage
      const canvasStateString = JSON.stringify(cleanCanvasData);

      const projectRef = doc(db, 'projects', projectId);
      
      await setDoc(projectRef, {
        canvasState: canvasStateString,
        thumbnail: thumbnail,
        updatedAt: new Date().toISOString(),
        type: canvasData.type || 'design',
        status: 'draft',
        userId: auth.currentUser.uid
      }, { merge: true });

      console.log('Saved canvas state:', {
        stateLength: canvasStateString.length,
        objectCount: cleanCanvasData.objects.length
      });

      return true;
    } catch (error) {
      console.error('Error saving canvas state:', error);
      throw error;
    }
  },

  async loadCanvasState(projectId) {
    console.log('Loading canvas state for project:', projectId);
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      
      if (!projectDoc.exists()) {
        throw new Error('Project not found');
      }

      const data = projectDoc.data();
      
      // Log raw data
      console.log('Raw project data:', {
        hasCanvasState: !!data.canvasState,
        stateType: typeof data.canvasState,
        stateLength: data.canvasState?.length,
        statePreview: typeof data.canvasState === 'string' ? 
          data.canvasState.substring(0, 100) : 
          JSON.stringify(data.canvasState).substring(0, 100)
      });
      
      if (!data.canvasState) {
        console.log('No canvas state found - new project');
        return null;
      }

      let parsedState;
      const canvasState = data.canvasState;

      // Parse string state
      if (typeof canvasState === 'string') {
        try {
          parsedState = JSON.parse(canvasState);
          console.log('Successfully parsed canvas state:', {
            version: parsedState.version,
            objectCount: parsedState.objects?.length,
            hasObjects: !!parsedState.objects,
            isObjectsArray: Array.isArray(parsedState.objects)
          });
        } catch (e) {
          console.error('Failed to parse canvas state string:', e);
          console.error('Canvas state string preview:', canvasState.substring(0, 200));
          return null;
        }
      } else {
        parsedState = canvasState;
        console.log('Using object canvas state:', {
          version: parsedState.version,
          objectCount: parsedState.objects?.length,
          hasObjects: !!parsedState.objects,
          isObjectsArray: Array.isArray(parsedState.objects)
        });
      }

      // Validate structure
      if (!parsedState || !Array.isArray(parsedState.objects)) {
        console.error('Invalid canvas state structure:', {
          hasParsedState: !!parsedState,
          hasObjects: !!parsedState?.objects,
          objectsType: typeof parsedState?.objects
        });
        throw new Error('Invalid canvas state structure');
      }

      // Process objects
      const processedObjects = parsedState.objects.map((obj, index) => {
        if (!obj || !obj.type) {
          console.warn(`Invalid object at index ${index}:`, obj);
          return null;
        }

        const baseObj = {
          ...obj,
          originX: obj.originX || 'center',
          originY: obj.originY || 'center',
          left: obj.left || 0,
          top: obj.top || 0,
          scaleX: obj.scaleX || 1,
          scaleY: obj.scaleY || 1,
          angle: obj.angle || 0,
          flipX: obj.flipX || false,
          flipY: obj.flipY || false,
          opacity: obj.opacity || 1,
          visible: obj.visible !== false
        };

        if (obj.type === 'image') {
          if (!obj.src) {
            console.warn('Image object missing source:', obj);
            return null;
          }
          return {
            ...baseObj,
            crossOrigin: 'Anonymous',
            filters: obj.filters || []
          };
        }

        if (obj.type === 'text' || obj.type === 'i-text') {
          return {
            ...baseObj,
            text: obj.text || '',
            fontSize: obj.fontSize || 40,
            fontFamily: obj.fontFamily || 'Arial',
            fontWeight: obj.fontWeight || 'normal',
            fontStyle: obj.fontStyle || 'normal',
            underline: obj.underline || false,
            overline: obj.overline || false,
            linethrough: obj.linethrough || false,
            textAlign: obj.textAlign || 'left',
            fill: obj.fill || '#000000',
            stroke: obj.stroke || null,
            strokeWidth: obj.strokeWidth || 1
          };
        }

        return baseObj;
      }).filter(Boolean);

      // Create final state
      const finalState = {
        version: parsedState.version,
        objects: processedObjects,
        width: parsedState.width || 800,
        height: parsedState.height || 600,
        backgroundColor: parsedState.backgroundColor || '#ffffff'
      };

      // Log final state
      console.log('Final processed state:', {
        version: finalState.version,
        objectCount: finalState.objects.length,
        dimensions: `${finalState.width}x${finalState.height}`,
        objectTypes: finalState.objects.map(obj => obj.type),
        firstObject: finalState.objects[0] ? {
          type: finalState.objects[0].type,
          hasProperties: Object.keys(finalState.objects[0]).length
        } : null
      });

      return finalState;
    } catch (error) {
      console.error('Error loading canvas state:', error);
      throw error;
    }
  }
}; 