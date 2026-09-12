/**
 * Firebase Web SDK Configuration
 * ================================
 * Replace ALL placeholder values below with your real Firebase project config.
 * Get these from: Firebase Console → Project Settings → Your Apps → Web App
 *
 * NEVER commit real credentials to version control.
 * In production, serve this file from an environment-aware build pipeline.
 */

// ── REPLACE THESE WITH YOUR REAL VALUES ──────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_WEB_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "G-XXXXXXXXXX",   // optional Analytics
};
// ─────────────────────────────────────────────────────────────────────────────

// App configuration
const APP_CONFIG = {
  apiBaseUrl: 'http://localhost:5000/api',   // Flask backend
  buildingId: 'yit-moodbidri-main',
  version: '1.0.0',
};

// Detect demo mode (no real Firebase configured)
const DEMO_MODE = FIREBASE_CONFIG.apiKey === 'YOUR_WEB_API_KEY';

if (DEMO_MODE) {
  console.warn(
    '⚠️  DEMO MODE: Firebase not configured.\n' +
    '   Set your real Firebase config in admin-web/frontend/js/firebase-config.js\n' +
    '   The app will use local sample data for demonstration.'
  );
}

export { FIREBASE_CONFIG, APP_CONFIG, DEMO_MODE };
