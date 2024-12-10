import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadService = {
  async uploadFile(file, projectId) {
    try {
      const storageRef = ref(storage, `projects/${projectId}/files/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async uploadFiles(files, projectId) {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, projectId));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }
}; 