const admin = require('firebase-admin');
const { get: getEnv } = require('env-var');

const serviceAccount = {
  projectId: getEnv('FIREBASE_PROJECT_ID').required().asString(),
  privateKey: getEnv('FIREBASE_PRIVATE_KEY').required().asString().replace(/\\n/g, '\n'),
  clientEmail: getEnv('FIREBASE_CLIENT_EMAIL').required().asString()
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.projectId
});

module.exports = admin;