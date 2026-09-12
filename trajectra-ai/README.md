# TRAJECTRA AI 🚗⚡
### City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking & Urban Traffic Analytics
**Smart India Hackathon 2026** | **Problem Statement ID**: `SIH26127` | **Category**: Software | **Theme**: Transportation and Logistics | **Team**: VectorHaul

---

## 🌟 Executive Summary

**TRAJECTRA AI** is a state-of-the-art, dark-themed AI command center platform built for municipal traffic authorities, control room operators, and urban planners. It connects multiple city CCTV cameras and identifies identical vehicles across camera locations using License Plate Recognition (ANPR/OCR), spatial linestring trajectory reconstruction, real-time traffic density analytics, and AI-driven congestion mitigation.

---

## 🎯 Core End-to-End Pipeline

```
MULTIPLE CCTV CAMERAS (24 Feeds)
        ↓
RTSP STREAM INGEST & FRAME BUFFER
        ↓
YOLOv8 VEHICLE DETECTION & CLASSIFICATION
        ↓
ANPR / OCR LICENSE PLATE RECOGNITION
        ↓
VEHICLE IDENTITY REGISTRATION
        ↓
CROSS-CAMERA SPATIAL & TEMPORAL MATCHING
        ↓
VEHICLE TRAJECTORY RECONSTRUCTION (PostGIS)
        ↓
URBAN TRAFFIC DENSITY & SPEED ANALYTICS
        ↓
AI CONGESTION INSIGHTS & SIGNAL RECOMMENDATIONS
```

---

## 🚀 Key Features

1. **▶ RUN LIVE DEMO (SIH Judge Presentation Mode)**: 1-click automated 10-step story mode walking judges through camera stream ingestion, YOLO detection, ANPR plate recognition (`KA 19 AB 1234`), multi-camera matching (Camera A $\rightarrow$ B $\rightarrow$ C), trajectory generation, analytics, and AI recommendations with custom toast prompts and completion confetti!
2. **Executive Command Center Dashboard**: 6 animated KPI cards (Total Vehicles: 12,842, Active Cameras: 24/24, Tracked: 8,426, Congestion: 67%, ANPR Match Rate: 94.7%, Hotspots: 12) + Interactive Leaflet Live City Traffic Map.
3. **Live Multi-Camera Monitoring CCTV Wall**: 6 camera live video grid with animated computer vision bounding boxes (YOLO), status indicators, live FPS counters, density badges, and clickable vehicle bounding boxes.
4. **Vehicle Intelligence & 3D Rotation Canvas**: Interactive 360-degree vehicle rotation canvas (`Vehicle360Viewer`), multi-angle view presets (Front, Side, Rear, 360°), plate scanner HUD, and confidence scores.
5. **Complete Vehicle Journey (WOW Feature)**: Interactive multi-camera route map displaying path A $\rightarrow$ B $\rightarrow$ C, animated vehicle marker with glowing cyan polyline trail, pulsing camera nodes, match popups, timeline, and metrics summary (30 MIN, 3 CAMERAS, 8.4 KM, 16.8 KM/H).
6. **Urban Traffic Analytics**: Interactive Recharts line, area, bar, and donut charts with timeframe (Today, 7 days, 30 days) and camera filters.
7. **AI Traffic Insights**: Automated insight alerts (traffic hotspots, congestion patterns, route optimization, abnormal speed drops) with an interactive **"RUN AI ANALYSIS"** scanning modal.
8. **Camera Network Management**: 24 active camera grid & management table, status filters (Active, Warning, Offline), streams specs, and individual node inspection.
9. **Vehicle Search Directory**: Sample search chips (`KA 19 AB 1234`, `KA 05 MN 4821`, `KA 03 XY 9217`) and direct link to spatial trajectory tracking.
10. **System Architecture Modal & Privacy Notice**: Visual pipeline flowchart, PostgreSQL + PostGIS schema viewer, Flask REST API docs, and DPDP Act 2023 privacy guidelines.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & Theme**: Tailwind CSS, Vanilla CSS, Custom Futuristic Glassmorphism, Inter & JetBrains Mono Fonts
- **Icons & Animations**: Lucide React, Framer Motion, Canvas Confetti
- **Charts & Maps**: Recharts, Leaflet, React-Leaflet
- **Backend Architecture**: Python Flask, OpenCV, YOLOv8, EasyOCR / PaddleOCR
- **Database Model**: PostgreSQL + PostGIS Extension
- **Data Processing**: Pandas, NumPy

---

## 💻 Local Setup Instructions

```bash
# 1. Navigate into project folder
cd C:\Users\gamas\.gemini\antigravity-ide\scratch\trajectra-ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify)
```bash
# Build production bundle
npm run build
```
Deploy `dist/` directory directly to Vercel or Netlify.

### Backend (Docker / Render / Railway)
The application architecture is structured so that mock API functions in `SimulationContext` can be cleanly swapped with live Flask endpoints (`http://localhost:5000/api/v1/...`).

---

## 🛡️ Privacy & Compliance Notice

> "This prototype uses clearly marked simulated ANPR data and synthetic video feeds for demonstration. Production deployment should strictly adhere to Indian Digital Personal Data Protection (DPDP) Act 2023, law-enforcement compliance, encrypted video streaming (TLS 1.3), role-based access control (RBAC), and automated data retention purging protocols."
