import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const settingsService = {
  async getSettings() {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
      return settingsDoc.exists() ? settingsDoc.data() : defaultSettings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async updateSettings(settings) {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

const defaultSettings = {
  companyName: '',
  email: '',
  notificationsEnabled: true,
  autoApproval: false,
  maxProjectSize: 10,
  defaultProjectStatus: 'pending',
  emailTemplates: {
    projectSubmission: true,
    statusUpdate: true,
    completion: true,
  },
  workingHours: {
    start: '09:00',
    end: '17:00',
  },
}; 