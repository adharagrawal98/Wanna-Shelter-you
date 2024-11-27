const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://charity-439513.firebaseio.com", // Update with your Firebase Realtime Database URL if you're using it
});

// Export Firestore to use in other parts of your application
const db = admin.firestore();
module.exports = db; // Export the Firestore database instance