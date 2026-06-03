/**
 * Debug Script: Dump all Firestore product documents to see their actual field names
 */
import dotenv from 'dotenv';
dotenv.config();

import * as admin from 'firebase-admin';

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "",
  universe_domain: "googleapis.com"
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

async function main() {
  console.log('📋 Dumping ALL Firestore product documents...\n');
  
  const snapshot = await db.collection('products').get();
  console.log(`Total documents: ${snapshot.size}\n`);
  
  snapshot.docs.forEach((doc, index) => {
    const data = doc.data();
    console.log(`\n========== Product #${index + 1} (ID: ${doc.id}) ==========`);
    console.log('Fields:', Object.keys(data).join(', '));
    console.log(JSON.stringify(data, null, 2));
  });

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
