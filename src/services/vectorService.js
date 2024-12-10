import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { fabric } from 'fabric';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const vectorService = {
  async validateVectorFile(file) {
    if (!file.name.toLowerCase().endsWith('.svg')) {
      throw new Error('Invalid file type. Please upload SVG files only.');
    }

    return true;
  },

  async uploadVector(file, projectId) {
    try {
      await this.validateVectorFile(file);
      
      if (!projectId) throw new Error('Project ID is required');
      
      // For SVG files, read the content first
      const svgContent = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file);
      });

      const storageRef = ref(storage, `projects/${projectId}/vectors/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file, {
        contentType: 'image/svg+xml',
        customMetadata: {
          projectId,
          uploadedAt: new Date().toISOString()
        }
      });

      const url = await getDownloadURL(storageRef);

      // Store in Firestore with user ID
      const vectorRef = await addDoc(collection(db, `projects/${projectId}/vectors`), {
        projectId,
        userId: auth.currentUser.uid,
        name: file.name,
        url,
        storagePath: storageRef.fullPath,
        type: file.type,
        svgContent,
        createdAt: new Date()
      });

      console.log('Vector uploaded:', url);
      return { 
        id: vectorRef.id, 
        url, 
        name: file.name,
        svgContent 
      };
    } catch (error) {
      console.error('Error uploading vector:', error);
      throw error;
    }
  },

  async deleteVector(url) {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting vector:', error);
      throw error;
    }
  },

  async loadSVGToCanvas(url, canvas) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch SVG');
      const svgText = await response.text();

      console.log('Loading SVG to canvas:', svgText);

      return new Promise((resolve, reject) => {
        fabric.loadSVGFromString(svgText, (objects, options) => {
          try {
            if (!objects || objects.length === 0) {
              throw new Error('Failed to parse SVG');
            }
            const svg = fabric.util.groupSVGElements(objects, options);
            svg.scaleToWidth(200);
            svg.center();
            canvas.add(svg);
            canvas.renderAll();
            console.log('SVG loaded to canvas');
            resolve(svg);
          } catch (error) {
            console.error('Error processing SVG:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error loading SVG:', error);
      throw error;
    }
  },

  async getVectorContent(projectId, vectorId) {
    try {
      const vectorDoc = await getDoc(doc(db, `projects/${projectId}/vectors`, vectorId));
      if (!vectorDoc.exists()) throw new Error('Vector not found');
      return vectorDoc.data().svgContent;
    } catch (error) {
      console.error('Error getting vector content:', error);
      throw error;
    }
  }
}; 