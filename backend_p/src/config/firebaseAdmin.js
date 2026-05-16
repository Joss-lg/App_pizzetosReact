const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let initialized = false;

const initializeFirebaseAdmin = () => {
  if (initialized) {
    return admin;
  }

  const credentialsPathFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!credentialsPathFromEnv) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is required');
  }

  const resolvedPath = path.isAbsolute(credentialsPathFromEnv)
    ? credentialsPathFromEnv
    : path.resolve(process.cwd(), credentialsPathFromEnv);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Firebase service account file not found at: ${resolvedPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  initialized = true;
  return admin;
};

module.exports = {
  initializeFirebaseAdmin,
};
