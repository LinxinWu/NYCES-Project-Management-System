import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const fontService = {
  async uploadFont(file) {
    try {
      // Validate file type
      const validExtensions = ['.ttf', '.otf'];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(extension)) {
        throw new Error('Invalid font file. Please upload TTF or OTF files.');
      }

      // Upload to storage
      const storageRef = ref(storage, `fonts/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Add to Firestore
      const fontDoc = await addDoc(collection(db, 'fonts'), {
        name: file.name.replace(extension, ''),
        url,
        fileType: extension,
        createdAt: new Date(),
      });

      // Load font into document
      const fontFace = new FontFace(file.name.replace(extension, ''), `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);

      return {
        id: fontDoc.id,
        name: file.name.replace(extension, ''),
        url,
      };
    } catch (error) {
      console.error('Error uploading font:', error);
      throw error;
    }
  },

  async getFonts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'fonts'));
      const fonts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Load all fonts into document
      await Promise.all(fonts.map(async font => {
        try {
          const fontFace = new FontFace(font.name, `url(${font.url})`);
          await fontFace.load();
          document.fonts.add(fontFace);
        } catch (error) {
          console.error(`Error loading font ${font.name}:`, error);
        }
      }));

      return fonts;
    } catch (error) {
      console.error('Error getting fonts:', error);
      throw error;
    }
  },

  async deleteFont(fontId) {
    try {
      const fontDoc = await doc(db, 'fonts', fontId);
      const fontData = (await getDoc(fontDoc)).data();
      
      // Delete from storage
      const storageRef = ref(storage, fontData.url);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(fontDoc);
    } catch (error) {
      console.error('Error deleting font:', error);
      throw error;
    }
  }
}; 