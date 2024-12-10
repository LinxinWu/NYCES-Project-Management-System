import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export const assetService = {
  async getAssets() {
    try {
      const assetsRef = collection(db, 'assets');
      const snapshot = await getDocs(assetsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting assets:', error);
      throw error;
    }
  },

  async uploadAsset(file) {
    try {
      const storageRef = ref(storage, `assets/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const assetRef = await addDoc(collection(db, 'assets'), {
        name: file.name,
        url,
        type: file.type,
        createdAt: new Date()
      });

      return {
        id: assetRef.id,
        name: file.name,
        url
      };
    } catch (error) {
      console.error('Error uploading asset:', error);
      throw error;
    }
  },

  async deleteAsset(assetId, url) {
    try {
      await deleteDoc(doc(db, 'assets', assetId));
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  }
}; 