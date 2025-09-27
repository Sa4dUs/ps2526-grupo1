import admin from "firebase-admin";

var serviceAccount = require("../credentials.json");


if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const adminAuth = admin.auth();
export const db = admin.firestore();
export { admin };

