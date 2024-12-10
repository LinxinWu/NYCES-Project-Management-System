import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Request, Response } from 'express';

admin.initializeApp();

interface ProjectStatusData {
  projectId: string;
  status: string;
  message: string;
}

export const updateProjectStatus = functions.https.onRequest(async (request: Request, response: Response) => {
  const { projectId, status, message } = request.body as ProjectStatusData;

  try {
    await admin.firestore().collection('projects').doc(projectId).update({
      status,
      statusMessage: message,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    response.json({ success: true });
  } catch (error) {
    response.status(500).json({ error: 'Failed to update project status' });
  }
});
