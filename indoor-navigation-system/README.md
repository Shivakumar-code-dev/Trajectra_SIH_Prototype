# 🧭 YIT Smart Indoor Navigation System

**Yenepoya Institute of Technology, Moodbidri**

A complete indoor navigation system with an **Admin Web Dashboard** (Flask + Three.js) and an **Android App** (Kotlin/Compose) — both backed by Firebase.

---

## 📁 Project Structure

```
indoor-navigation-system/
├── admin-web/
│   ├── backend/              ← Flask API (Python)
│   │   ├── app.py            ← App factory
│   │   ├── firebase_init.py  ← Firebase Admin SDK
│   │   ├── navigation/
│   │   │   └── astar.py      ← A* pathfinding engine
│   │   └── routes/           ← All REST API blueprints
│   └── frontend/             ← Admin Dashboard (HTML/JS)
│       ├── index.html        ← Login page
│       ├── dashboard.html    ← Full admin dashboard
│       ├── css/
│       │   └── design-system.css
│       └── js/
│           ├── firebase-config.js
│           └── dashboard-app.js
├── android-app/              ← Android app (Kotlin/Compose)
│   └── app/src/main/
│       ├── java/com/yit/indoornav/
│       │   ├── data/
│       │   │   ├── model/Models.kt
│       │   │   └── repository/NavigationRepository.kt
│       │   ├── navigation/AStarEngine.kt ← Offline A*
│       │   ├── ui/
│       │   │   ├── navigation/NavGraph.kt
│       │   │   ├── screens/ (9 screens)
│       │   │   └── theme/Theme.kt
│       │   └── MainActivity.kt
│       └── AndroidManifest.xml
├── firebase/
│   ├── firestore.rules       ← Security rules
│   ├── storage.rules
│   └── sample-data/
│       └── seed_data.py      ← Seed Firestore with YIT data
├── .env.example              ← Environment variables template
├── start-backend.bat         ← Quick-start script (Windows)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ (optional, for serving frontend)
- Android Studio Hedgehog+
- A Firebase project (Google account)

---

### Step 1 — Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: **yit-indoor-nav**
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** (start in production mode)
5. Enable **Storage**
6. **Service Account Key** → Project Settings → Service Accounts → Generate new private key → save as `admin-web/backend/service-account.json`
7. **Web App** → Add app → copy config into `admin-web/frontend/js/firebase-config.js`
8. **Android App** → Register `com.yit.indoornav` → download `google-services.json` → place in `android-app/app/`

---

### Step 2 — Seed Firebase Data

```bash
cd firebase/sample-data
pip install firebase-admin python-dotenv
python seed_data.py
```

This populates:
- **4 Floors** (Ground → 3rd)
- **18 Rooms**
- **12 Destinations** (Labs, Library, Canteen, etc.)
- **29 Navigation Nodes**
- **32 Edges** (with floor transitions via staircase + elevator)
- **10 QR Checkpoints**

---

### Step 3 — Start the Flask Backend

```bash
# Windows
start-backend.bat

# Linux/Mac
cd admin-web/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Backend starts at: `http://localhost:5000`

---

### Step 4 — Open Admin Dashboard

Open `admin-web/frontend/index.html` in your browser.

> **Demo Mode**: If Firebase isn't configured yet, the dashboard runs in demo mode automatically — all 12 pages work with sample data, no Firebase needed.

**Create your first admin user:**
```
Firebase Console → Authentication → Add User
Email: admin@yit.edu.in | Password: Admin@1234

Firestore: users/{uid} → set role: "ADMIN"
```

---

### Step 5 — Build the Android App

1. Open `android-app/` in Android Studio
2. Place your `google-services.json` in `android-app/app/`
3. In `app/build.gradle.kts`, set your Flask server IP:
   ```kotlin
   buildConfigField("String", "API_BASE_URL", "\"http://YOUR-PC-IP:5000/api\"")
   ```
4. Sync Gradle → Run on emulator or physical device

---

## 🗺️ Admin Dashboard Features

| Page | Features |
|------|----------|
| **Dashboard** | Stats, 3D preview, system status, quick actions |
| **3D Model** | Upload GLB/GLTF, Three.js viewer, model management |
| **Floors** | Add/edit building floors |
| **Rooms** | Full CRUD for 18+ rooms |
| **Doors** | Door nodes for corridor connections |
| **Destinations** | Add/edit/search student destinations |
| **Navigation Graph** | Canvas-based node+edge editor with A* visual |
| **QR Checkpoints** | Generate and manage QR codes |
| **Route Testing** | Test A* routes before publishing |
| **Users** | Role management |
| **Analytics** | Popular destinations, visit counts |
| **Settings** | Building config, navigation params |

---

## 📱 Android App Features

| Screen | Features |
|--------|----------|
| Splash | Auto-login detection |
| Login | Firebase email/password |
| Register | Create student account |
| Home | Search bar, popular places, 3D map card |
| Search | Real-time Firestore search |
| Destination Detail | Info cards, Navigate button, QR option |
| Navigation | A* route, step-by-step instructions, 3D + Camera view |
| QR Scan | CameraX + ML Kit barcode scanner |
| 3D Map | WebView Three.js viewer by floor |
| Profile | User info, logout |
| Settings | Accessible routes toggle |

---

## 🔬 Navigation Engine (A*)

Both the **Flask backend** (Python) and **Android app** (Kotlin) contain a complete A* implementation:

- **Heuristic**: 3D Euclidean distance
- **Floor transitions**: Staircases and elevators as weighted edges
- **Accessible mode**: Skips staircase edges for wheelchair users
- **Turn-by-turn**: Auto-generates walking instructions with floor changes

---

## 🔐 Security

- All Firestore writes require `ADMIN` or `SUPER_ADMIN` role
- Mobile app can only READ data + create sessions + increment counters
- Firebase tokens verified server-side by Flask middleware
- No client-side role trust

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Admin Backend | Python Flask, Firebase Admin SDK |
| Admin Frontend | HTML5, Vanilla JS, CSS3, Three.js |
| 3D Viewer | Three.js r162 (GLB/GLTF) |
| Android | Kotlin, Jetpack Compose, Material 3 |
| QR Scanning | CameraX + ML Kit |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Navigation | A* algorithm (Python + Kotlin) |

---

## 🏛️ Yenepoya Institute of Technology
Deralakatte, Moodbidri, DK - 574225, Karnataka, India
