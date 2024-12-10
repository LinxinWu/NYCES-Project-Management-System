import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

export const notificationService = {
  async sendProjectStatusUpdate(projectId, status) {
    try {
      const sendNotification = httpsCallable(functions, 'sendProjectStatusUpdate');
      await sendNotification({ projectId, status });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}; 