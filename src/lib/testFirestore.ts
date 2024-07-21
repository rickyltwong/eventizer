import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

interface ServiceAccount {
  project_id: string;
  private_key: string;
  client_email: string;
}

const serviceAccountPath = path.resolve(
  __dirname,
  '../../eventizer-dev-firebase-adminsdk-vtf85-39579781a7.json',
);

try {
  const serviceAccount: ServiceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, 'utf8'),
  );
  console.log('Service account loaded:', serviceAccount.project_id);

  // Initialize the Firebase Admin SDK
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log(
      'Firebase Admin initialized with project ID:',
      serviceAccount.project_id,
    );
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

const db = admin.firestore();

async function testFirestore() {
  try {
    console.log('Testing Firestore access...');

    const testRef = db.collection('test').doc('initializationCheck');
    await testRef.set({ init: 'check' });

    const doc = await testRef.get();
    if (!doc.exists) {
      console.log('Initialization check failed: No such document!');
      return;
    } else {
      console.log('Initialization check succeeded:', doc.data());
    }

    const docRef = db.collection('test').doc('testDoc');
    await docRef.set({
      testField: 'Hello, Firestore!',
    });
    console.log('Test document created.');

    const testDoc = await docRef.get();
    if (!testDoc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', testDoc.data());
    }

    await docRef.delete();
    console.log('Test document deleted.');
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    if (error instanceof Error) {
      console.log('Error details:', error.message);
    }
  }
}

testFirestore();
