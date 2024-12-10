const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminData = {
  email: 'admin@nyces.com',
  password: 'Admin123!',
  displayName: 'Admin User'
};

async function createAdmin() {
  try {
    // Create auth user
    const userRecord = await admin.auth().createUser({
      email: adminData.email,
      password: adminData.password,
      displayName: adminData.displayName,
      emailVerified: true
    });

    // Add to admins collection
    await admin.firestore().collection('admins').doc(userRecord.uid).set({
      email: adminData.email,
      name: adminData.displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Admin user created successfully:', userRecord.uid);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin(); 