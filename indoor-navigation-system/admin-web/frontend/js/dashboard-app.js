/**
 * YIT Indoor Navigation — Dashboard Application
 * Main JavaScript controller for all admin pages.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { FIREBASE_CONFIG, APP_CONFIG, DEMO_MODE } from './firebase-config.js';

// ── State ────────────────────────────────────────────────────────
let auth, currentUser, idToken;
let floors = [], rooms = [], destinations = [], nodes = [], edges = [], qrCheckpoints = [];
let graphEditor = null;
let miniViewer = null;
let currentPage = 'dashboard';

const API = APP_CONFIG.apiBaseUrl;

// ── Init ─────────────────────────────────────────────────────────
async function init() {
  if (DEMO_MODE) {
    loadDemoUser();
    initUI();
    return;
  }
  const app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  onAuthStateChanged(auth, async user => {
    if (!user) { window.location.href = 'index.html'; return; }
    currentUser = user;
    idToken = await user.getIdToken();
    loadDemoUser(user);
    initUI();
  });
}

function loadDemoUser(user) {
  const stored = JSON.parse(sessionStorage.getItem('yit_user') || '{}');
  const name = stored.name || user?.displayName || user?.email?.split('@')[0] || 'Admin';
  document.getElementById('userNameDisplay').textContent = name;
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();
  document.getElementById('welcomeName').textContent = name;
}

async function getToken() {
  if (DEMO_MODE) return 'demo-token';
  if (currentUser) { idToken = await currentUser.getIdToken(); return idToken; }
  return '';
}

// ── API helpers ──────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// ── Toast ────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-text">${msg}</span>`;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── Modal helpers ────────────────────────────────────────────────
window.closeModal = id => document.getElementById(id).classList.remove('open');
function openModal(id) { document.getElementById(id).classList.add('open'); }

// ── Navigation ───────────────────────────────────────────────────
const pageTitles = {
  dashboard: 'Dashboard', model: '3D Model Management',
  floors: 'Floor Management', rooms: 'Room Management',
  doors: 'Door Management', destinations: 'Destinations',
  graph: 'Navigation Graph Editor', qr: 'QR Checkpoints',
  'route-test': 'Route Testing', users: 'User Management',
  analytics: 'Analytics', settings: 'Settings',
};

window.navigateTo = function(page) {
  // Hide all pages
  document.querySelectorAll('.section-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  document.getElementById('topbarTitle').textContent = pageTitles[page] || page;
  currentPage = page;
  onPageLoad(page);
};

async function onPageLoad(page) {
  switch (page) {
    case 'dashboard':    loadDashboard(); break;
    case 'floors':       loadFloors(); break;
    case 'rooms':        loadRooms(); break;
    case 'doors':        loadDoors(); break;
    case 'destinations': loadDestinations(); break;
    case 'graph':        loadGraphEditor(); break;
    case 'qr':           loadQRCheckpoints(); break;
    case 'route-test':   loadRouteTester(); break;
    case 'users':        loadUsers(); break;
    case 'analytics':    loadAnalytics(); break;
    case 'model':        loadModelPage(); break;
  }
}

// ── UI Init ──────────────────────────────────────────────────────
function initUI() {
  // Sidebar nav
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (!DEMO_MODE && auth) await signOut(auth);
    sessionStorage.clear();
    window.location.href = 'index.html';
  });

  // Publish
  ['publishBtn', 'quickPublish'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', publishMap);
  });

  // Sidebar toggle mobile
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Load initial page
  onPageLoad('dashboard');
  initMiniViewer();
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
async function loadDashboard() {
  // Check API health
  try {
    await fetch(`${API.replace('/api', '')}/api/health`);
    document.getElementById('apiStatus').className = 'badge badge-success';
    document.getElementById('apiStatus').textContent = 'Running';
  } catch {
    document.getElementById('apiStatus').className = 'badge badge-error';
    document.getElementById('apiStatus').textContent = 'Offline';
  }

  if (DEMO_MODE) {
    loadDemoStats();
    return;
  }

  try {
    const data = await apiFetch('/analytics/summary');
    document.getElementById('stat-floors').textContent      = data.floors;
    document.getElementById('stat-rooms').textContent       = data.rooms;
    document.getElementById('stat-destinations').textContent= data.destinations;
    document.getElementById('stat-nodes').textContent       = data.nodes;
    document.getElementById('stat-edges').textContent       = data.edges;
    document.getElementById('stat-users').textContent       = data.users;
    document.getElementById('stat-sessions').textContent    = data.sessions;
    document.getElementById('stat-model').textContent       = data.modelStatus;

    const pubStatus = document.getElementById('publishStatus');
    if (data.modelStatus === 'READY') {
      pubStatus.className = 'badge badge-success';
      pubStatus.textContent = 'Published';
    }
  } catch (e) {
    loadDemoStats();
  }

  document.getElementById('lastUpdated').textContent =
    'Last updated: ' + new Date().toLocaleString('en-IN');
}

function loadDemoStats() {
  const stats = { floors:4, rooms:18, destinations:12, nodes:45, edges:52, users:3, sessions:0 };
  document.getElementById('stat-floors').textContent      = stats.floors;
  document.getElementById('stat-rooms').textContent       = stats.rooms;
  document.getElementById('stat-destinations').textContent= stats.destinations;
  document.getElementById('stat-nodes').textContent       = stats.nodes;
  document.getElementById('stat-edges').textContent       = stats.edges;
  document.getElementById('stat-users').textContent       = stats.users;
  document.getElementById('stat-sessions').textContent    = stats.sessions;
  document.getElementById('stat-model').textContent       = 'DEMO';
  document.getElementById('lastUpdated').textContent = 'Demo Mode — ' + new Date().toLocaleString('en-IN');

  const pubStatus = document.getElementById('publishStatus');
  pubStatus.className = 'badge badge-warning';
  pubStatus.textContent = 'Not Published';
}

// ═══════════════════════════════════════════════════════════════
// 3D MINI VIEWER (Dashboard)
// ═══════════════════════════════════════════════════════════════
function initMiniViewer() {
  const container = document.getElementById('dashboardViewer');
  if (!container || typeof THREE === 'undefined') return;
  miniViewer = createThreeScene(container, true);
  buildSampleBuilding(miniViewer.scene);

  // Floor buttons
  const fb = document.getElementById('dashFloorSelector');
  ['G','F1','F2','F3'].forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'floor-btn' + (i === 0 ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.floor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isolateFloor(miniViewer.scene, i);
    });
    fb.appendChild(btn);
  });

  document.getElementById('dashResetCam').addEventListener('click', () => {
    miniViewer.camera.position.set(15, 12, 15);
    miniViewer.controls.target.set(0, 0, 0);
    miniViewer.controls.update();
  });
}

function createThreeScene(container, autoResize = true) {
  const scene    = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0f1a);
  scene.fog = new THREE.Fog(0x0f0f1a, 30, 80);

  const w = container.clientWidth, h = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
  camera.position.set(15, 12, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 + 0.1;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(20, 30, 20);
  dirLight.castShadow = true;
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight(0x4F46E5, 0.3);
  fillLight.position.set(-20, 10, -20);
  scene.add(fillLight);

  // Grid
  const grid = new THREE.GridHelper(40, 20, 0x222240, 0x1a1a30);
  scene.add(grid);

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  if (autoResize) {
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);
  }

  return { scene, camera, renderer, controls };
}

// Build a simple procedural 4-floor building for demo
function buildSampleBuilding(scene) {
  const floorColors = [0x4F46E5, 0x7C3AED, 0x06B6D4, 0x10B981];
  const floorMats = floorColors.map(c =>
    new THREE.MeshPhongMaterial({ color: c, transparent: true, opacity: 0.85 })
  );
  const wallMat = new THREE.MeshPhongMaterial({ color: 0x2a2a4a, transparent: true, opacity: 0.9 });
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x60a5fa, transparent: true, opacity: 0.3, side: THREE.DoubleSide
  });

  for (let floor = 0; floor < 4; floor++) {
    const y = floor * 3.2;

    // Floor slab
    const slabGeo = new THREE.BoxGeometry(16, 0.3, 12);
    const slab = new THREE.Mesh(slabGeo, floorMats[floor]);
    slab.position.set(0, y - 0.15, 0);
    slab.castShadow = true;
    slab.receiveShadow = true;
    slab.userData.floor = floor;
    scene.add(slab);

    // Walls (simplified outline)
    const wallThickness = 0.3;
    const wallH = 3.0;
    const walls = [
      { w:16, d:wallThickness, x:0, z:-6 },
      { w:16, d:wallThickness, x:0, z:6  },
      { w:wallThickness, d:12, x:-8, z:0 },
      { w:wallThickness, d:12, x:8,  z:0 },
    ];
    walls.forEach(wl => {
      const geo = new THREE.BoxGeometry(wl.w, wallH, wl.d);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(wl.x, y + wallH / 2, wl.z);
      mesh.castShadow = true;
      mesh.userData.floor = floor;
      scene.add(mesh);
    });

    // Windows (glass panels on front wall)
    for (let w = -6; w <= 6; w += 3) {
      const wGeo = new THREE.PlaneGeometry(1.8, 1.5);
      const window3d = new THREE.Mesh(wGeo, glassMat);
      window3d.position.set(w, y + 1.5, 6.01);
      window3d.userData.floor = floor;
      scene.add(window3d);
    }

    // Internal rooms (simplified boxes)
    const roomPositions = [
      { x: -5, z: -2.5 }, { x: 0, z: -2.5 }, { x: 5, z: -2.5 },
      { x: -5, z:  2.5 }, { x: 0, z:  2.5 }, { x: 5, z:  2.5 },
    ];
    roomPositions.forEach(rp => {
      const rGeo = new THREE.BoxGeometry(4, 2.5, 4);
      const rMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(floorColors[floor]).multiplyScalar(0.6),
        transparent: true, opacity: 0.5, wireframe: false
      });
      const room = new THREE.Mesh(rGeo, rMat);
      room.position.set(rp.x, y + 1.3, rp.z);
      room.userData.floor = floor;
      scene.add(room);
    });
  }

  // Staircase column
  const stairGeo = new THREE.BoxGeometry(1.5, 13, 1.5);
  const stairMat = new THREE.MeshPhongMaterial({ color: 0xFBBF24 });
  const stair = new THREE.Mesh(stairGeo, stairMat);
  stair.position.set(-6.5, 6, 4);
  scene.add(stair);
}

function isolateFloor(scene, floorIndex) {
  scene.traverse(obj => {
    if (obj.isMesh && obj.userData.floor !== undefined) {
      const isTarget = obj.userData.floor === floorIndex;
      obj.visible = true;
      if (obj.material) {
        obj.material.opacity = isTarget ? (obj.material.opacity > 0.7 ? 0.85 : obj.material.opacity) : 0.1;
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// MODEL MANAGEMENT PAGE
// ═══════════════════════════════════════════════════════════════
let fullModelViewer = null;

async function loadModelPage() {
  // Setup dropzone
  const dropzone = document.getElementById('modelDropzone');
  const fileInput = document.getElementById('modelFileInput');

  document.getElementById('browseModelBtn').onclick = () => fileInput.click();
  fileInput.onchange = e => handleModelUpload(e.target.files[0]);

  dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', e => {
    e.preventDefault(); dropzone.classList.remove('drag-over');
    handleModelUpload(e.dataTransfer.files[0]);
  });

  document.getElementById('refreshModels').onclick = loadModelList;
  await loadModelList();

  // Init full model viewer
  if (!fullModelViewer) {
    const container = document.getElementById('fullModelViewer');
    // Clear placeholder content
    while (container.childElementCount > 1) container.removeChild(container.firstChild);
    fullModelViewer = createThreeScene(container, true);
    buildSampleBuilding(fullModelViewer.scene);
  }
}

async function loadModelList() {
  const el = document.getElementById('modelList');
  if (DEMO_MODE) {
    el.innerHTML = renderModelCard({
      id: 'demo-model', filename: 'yit-building-demo.glb',
      originalFormat: 'glb', status: 'READY', isActive: true,
      version: '1.0', uploadedAt: new Date().toISOString(), processingNotes: 'Demo model',
    });
    return;
  }
  try {
    const data = await apiFetch('/models/');
    if (!data.models.length) {
      el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);">No models uploaded yet.</div>';
      return;
    }
    el.innerHTML = data.models.map(renderModelCard).join('');
  } catch (e) { el.innerHTML = `<div style="color:var(--error);padding:16px;">${e.message}</div>`; }
}

function renderModelCard(m) {
  const statusClass = { READY:'badge-success', PROCESSING:'badge-warning', FAILED:'badge-error', UPLOADING:'badge-info' }[m.status] || 'badge-info';
  return `
  <div style="padding:14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);margin-bottom:10px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text-primary);">📦 ${m.filename}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">v${m.version||'1.0'} · ${m.originalFormat?.toUpperCase()}</div>
      </div>
      <span class="badge ${statusClass}">${m.status}</span>
    </div>
    <div style="margin-top:8px;font-size:11px;color:var(--text-muted);">${m.processingNotes||''}</div>
    <div style="display:flex;gap:8px;margin-top:10px;">
      ${m.isActive ? '<span class="badge badge-success">● Active</span>' :
        `<button class="btn btn-sm btn-success" onclick="activateModel('${m.id}')">Activate</button>`}
      ${m.runtimeUrl ? `<a href="${m.runtimeUrl}" target="_blank" class="btn btn-sm btn-secondary">Preview URL</a>` : ''}
    </div>
  </div>`;
}

window.activateModel = async id => {
  try {
    await apiFetch(`/models/${id}/activate`, { method: 'POST' });
    toast('Model activated!', 'success');
    loadModelList();
  } catch (e) { toast(e.message, 'error'); }
};

async function handleModelUpload(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const allowed = ['glb','gltf','obj','fbx','skp','dae','3ds'];
  if (!allowed.includes(ext)) { toast(`Unsupported format: .${ext}`, 'error'); return; }

  const progressEl = document.getElementById('uploadProgress');
  const fillEl     = document.getElementById('uploadProgressFill');
  const percentEl  = document.getElementById('uploadPercent');
  const statusEl   = document.getElementById('uploadStatusMsg');
  const fileNameEl = document.getElementById('uploadFileName');

  progressEl.style.display = 'block';
  fileNameEl.textContent = file.name;
  statusEl.textContent = 'Uploading…';

  if (DEMO_MODE) {
    // Simulate upload
    for (let p = 0; p <= 100; p += 10) {
      fillEl.style.width = p + '%';
      percentEl.textContent = p + '%';
      await new Promise(r => setTimeout(r, 80));
    }
    statusEl.textContent = ext === 'glb' ? '✅ Ready! Activate in model list.' : '⚙️ Conversion required. See docs.';
    toast('Model uploaded (Demo Mode)', 'success');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        fillEl.style.width = pct + '%';
        percentEl.textContent = pct + '%';
      }
    };
    xhr.onload = () => {
      if (xhr.status === 201) {
        const resp = JSON.parse(xhr.responseText);
        statusEl.textContent = resp.message;
        toast('Model uploaded!', 'success');
        loadModelList();
      } else {
        statusEl.textContent = '❌ Upload failed.';
        toast('Upload failed', 'error');
      }
    };
    xhr.onerror = () => { statusEl.textContent = '❌ Network error.'; toast('Network error', 'error'); };

    const token = await getToken();
    xhr.open('POST', `${API}/models/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  } catch (e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════════════════════
// FLOORS
// ═══════════════════════════════════════════════════════════════
async function loadFloors() {
  const el = document.getElementById('floorsContent');
  el.innerHTML = '<div style="text-align:center;padding:32px;"><div class="spinner"></div></div>';

  floors = DEMO_MODE ? getDemoFloors() : (await apiFetch('/floors/').catch(() => ({ floors: getDemoFloors() }))).floors;

  el.innerHTML = `
  <div class="table-container">
    <table class="table">
      <thead><tr><th>Floor</th><th>Number</th><th>Elevation</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${floors.map(f => `
        <tr>
          <td style="font-weight:600;color:var(--text-primary);">${f.name}</td>
          <td><span class="badge badge-purple">Floor ${f.number}</span></td>
          <td>${f.elevation ?? (f.number * 3.5)} m</td>
          <td style="color:var(--text-muted);">${f.description || '—'}</td>
          <td><span class="badge ${f.isActive !== false ? 'badge-success' : 'badge-error'}">${f.isActive !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick='editFloor(${JSON.stringify(f)})'>Edit</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;

  document.getElementById('addFloorBtn').onclick = () => { clearFloorForm(); openModal('floorModal'); };
  document.getElementById('saveFloorBtn').onclick = saveFloor;
}

function getDemoFloors() {
  return [
    { id:'floor-0', name:'Ground Floor', number:0, elevation:0, description:'Main entrance, admin offices, canteen', isActive:true },
    { id:'floor-1', name:'First Floor',  number:1, elevation:3.5, description:'CS and ECE departments', isActive:true },
    { id:'floor-2', name:'Second Floor', number:2, elevation:7.0, description:'Computer labs, library', isActive:true },
    { id:'floor-3', name:'Third Floor',  number:3, elevation:10.5, description:'Staff rooms, conference rooms', isActive:true },
  ];
}

function clearFloorForm() {
  ['floorId','floorName','floorNumber','floorElevation','floorDescription'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('floorModalTitle').textContent = 'Add Floor';
}

window.editFloor = f => {
  document.getElementById('floorId').value          = f.id;
  document.getElementById('floorName').value        = f.name;
  document.getElementById('floorNumber').value      = f.number;
  document.getElementById('floorElevation').value   = f.elevation;
  document.getElementById('floorDescription').value = f.description || '';
  document.getElementById('floorModalTitle').textContent = 'Edit Floor';
  openModal('floorModal');
};

async function saveFloor() {
  const id   = document.getElementById('floorId').value;
  const data = {
    name:        document.getElementById('floorName').value,
    number:      parseInt(document.getElementById('floorNumber').value),
    elevation:   parseFloat(document.getElementById('floorElevation').value || '0'),
    description: document.getElementById('floorDescription').value,
    isActive:    true,
  };
  if (!data.name) { toast('Floor name required', 'error'); return; }

  try {
    if (!DEMO_MODE) {
      if (id) await apiFetch(`/floors/${id}`, { method:'PUT', body: JSON.stringify(data) });
      else     await apiFetch('/floors/',       { method:'POST', body: JSON.stringify(data) });
    }
    toast(id ? 'Floor updated!' : 'Floor created!', 'success');
    closeModal('floorModal');
    loadFloors();
  } catch (e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════════════════════
// ROOMS
// ═══════════════════════════════════════════════════════════════
async function loadRooms() {
  await ensureFloors();
  const el = document.getElementById('roomsContent');
  el.innerHTML = '<div style="text-align:center;padding:32px;"><div class="spinner"></div></div>';

  rooms = DEMO_MODE ? getDemoRooms() : (await apiFetch('/rooms/').catch(() => ({ rooms: getDemoRooms() }))).rooms;

  renderRoomsTable(rooms);

  // Floor selects in modal
  populateFloorSelect('roomFloor');

  document.getElementById('addRoomBtn').onclick = () => { clearRoomForm(); openModal('roomModal'); };
  document.getElementById('saveRoomBtn').onclick = saveRoom;

  document.getElementById('roomSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderRoomsTable(rooms.filter(r =>
      r.name.toLowerCase().includes(q) || (r.department||'').toLowerCase().includes(q) ||
      (r.category||'').toLowerCase().includes(q) || (r.roomNumber||'').toLowerCase().includes(q)
    ));
  });
}

function getDemoRooms() {
  return [
    { id:'r01', name:'Main Entrance',         floorId:'floor-0', roomNumber:'G-00', department:'Administration', category:'ENTRANCE',   isActive:true, isAccessible:true },
    { id:'r02', name:'Principal Office',      floorId:'floor-0', roomNumber:'G-01', department:'Administration', category:'OFFICE',     isActive:true, isAccessible:true },
    { id:'r03', name:'Canteen',               floorId:'floor-0', roomNumber:'G-10', department:'Facilities',     category:'CANTEEN',    isActive:true, isAccessible:true },
    { id:'r04', name:'CS Department Office',  floorId:'floor-1', roomNumber:'1-01', department:'Computer Science', category:'OFFICE',   isActive:true, isAccessible:true },
    { id:'r05', name:'CS Classroom 1',        floorId:'floor-1', roomNumber:'1-05', department:'Computer Science', category:'CLASSROOM', isActive:true, isAccessible:true },
    { id:'r06', name:'CS Classroom 2',        floorId:'floor-1', roomNumber:'1-06', department:'Computer Science', category:'CLASSROOM', isActive:true, isAccessible:true },
    { id:'r07', name:'ECE Department Office', floorId:'floor-1', roomNumber:'1-10', department:'Electronics',    category:'OFFICE',     isActive:true, isAccessible:true },
    { id:'r08', name:'Seminar Hall',          floorId:'floor-1', roomNumber:'1-20', department:'Administration', category:'SEMINAR',    isActive:true, isAccessible:true },
    { id:'r09', name:'CS Lab 1',              floorId:'floor-2', roomNumber:'2-01', department:'Computer Science', category:'LAB',      isActive:true, isAccessible:true },
    { id:'r10', name:'CS Lab 2',              floorId:'floor-2', roomNumber:'2-02', department:'Computer Science', category:'LAB',      isActive:true, isAccessible:true },
    { id:'r11', name:'CS Lab 3 (AI Lab)',     floorId:'floor-2', roomNumber:'2-03', department:'Computer Science', category:'LAB',      isActive:true, isAccessible:true },
    { id:'r12', name:'Library',               floorId:'floor-2', roomNumber:'2-10', department:'Library',         category:'LIBRARY',  isActive:true, isAccessible:true },
    { id:'r13', name:'HOD CSE Office',        floorId:'floor-2', roomNumber:'2-20', department:'Computer Science', category:'OFFICE',   isActive:true, isAccessible:true },
    { id:'r14', name:'Auditorium',            floorId:'floor-0', roomNumber:'G-20', department:'Administration', category:'AUDITORIUM', isActive:true, isAccessible:true },
    { id:'r15', name:'Staff Room',            floorId:'floor-3', roomNumber:'3-01', department:'Administration', category:'OFFICE',     isActive:true, isAccessible:true },
    { id:'r16', name:'Conference Room',       floorId:'floor-3', roomNumber:'3-05', department:'Administration', category:'OTHER',      isActive:true, isAccessible:true },
    { id:'r17', name:'Restroom (Ground)',      floorId:'floor-0', roomNumber:'G-30', department:'Facilities',    category:'RESTROOM',   isActive:true, isAccessible:true },
    { id:'r18', name:'Restroom (Floor 2)',     floorId:'floor-2', roomNumber:'2-30', department:'Facilities',    category:'RESTROOM',   isActive:true, isAccessible:true },
  ];
}

function renderRoomsTable(data) {
  const el = document.getElementById('roomsContent');
  const catIcon = { LAB:'🔬', CLASSROOM:'📚', OFFICE:'🏢', LIBRARY:'📖', CANTEEN:'🍽️',
                    AUDITORIUM:'🎭', SEMINAR:'📢', RESTROOM:'🚻', ENTRANCE:'🚪', OTHER:'📦' };
  el.innerHTML = `
  <div class="table-container">
    <table class="table">
      <thead><tr><th>Room</th><th>Number</th><th>Floor</th><th>Category</th><th>Department</th><th>Access</th><th>Actions</th></tr></thead>
      <tbody>
        ${data.map(r => {
          const floorName = floors.find(f => f.id === r.floorId)?.name || r.floorId;
          return `<tr>
            <td style="font-weight:600;color:var(--text-primary);">${catIcon[r.category]||'📦'} ${r.name}</td>
            <td><code style="font-size:11px;color:var(--text-accent);">${r.roomNumber||'—'}</code></td>
            <td><span class="badge badge-purple">${floorName}</span></td>
            <td><span class="badge badge-info">${r.category||'—'}</span></td>
            <td style="color:var(--text-muted);">${r.department||'—'}</td>
            <td>${r.isAccessible ? '<span class="badge badge-success">♿ Yes</span>' : '<span class="badge badge-warning">No</span>'}</td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick='editRoom(${JSON.stringify(r)})'>Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteRoom('${r.id}')">×</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function clearRoomForm() {
  ['roomId','roomName','roomNumber','roomDepartment','roomDescription','roomX','roomY','roomZ'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('roomAccessible').checked = true;
  document.getElementById('roomModalTitle').textContent = 'Add Room';
}

window.editRoom = r => {
  document.getElementById('roomId').value           = r.id;
  document.getElementById('roomName').value         = r.name;
  document.getElementById('roomNumber').value       = r.roomNumber || '';
  document.getElementById('roomFloor').value        = r.floorId;
  document.getElementById('roomDepartment').value   = r.department || '';
  document.getElementById('roomCategory').value     = r.category || 'CLASSROOM';
  document.getElementById('roomDescription').value  = r.description || '';
  document.getElementById('roomX').value            = r.coordinates?.x || 0;
  document.getElementById('roomY').value            = r.coordinates?.y || 0;
  document.getElementById('roomZ').value            = r.coordinates?.z || 0;
  document.getElementById('roomAccessible').checked = r.isAccessible !== false;
  document.getElementById('roomModalTitle').textContent = 'Edit Room';
  openModal('roomModal');
};

async function saveRoom() {
  const id = document.getElementById('roomId').value;
  const data = {
    name:        document.getElementById('roomName').value,
    roomNumber:  document.getElementById('roomNumber').value,
    floorId:     document.getElementById('roomFloor').value,
    department:  document.getElementById('roomDepartment').value,
    category:    document.getElementById('roomCategory').value,
    description: document.getElementById('roomDescription').value,
    coordinates: {
      x: parseFloat(document.getElementById('roomX').value||0),
      y: parseFloat(document.getElementById('roomY').value||0),
      z: parseFloat(document.getElementById('roomZ').value||0),
    },
    isAccessible: document.getElementById('roomAccessible').checked,
  };
  if (!data.name || !data.floorId) { toast('Name and floor required', 'error'); return; }
  try {
    if (!DEMO_MODE) {
      if (id) await apiFetch(`/rooms/${id}`, { method:'PUT', body:JSON.stringify(data) });
      else    await apiFetch('/rooms/',       { method:'POST', body:JSON.stringify(data) });
    } else {
      if (id) { const i = rooms.findIndex(r=>r.id===id); if (i>-1) rooms[i]={...rooms[i],...data}; }
      else rooms.push({ id:'r'+(rooms.length+1).toString().padStart(2,'0'), ...data });
    }
    toast(id ? 'Room updated!' : 'Room created!', 'success');
    closeModal('roomModal');
    renderRoomsTable(rooms);
  } catch(e) { toast(e.message, 'error'); }
}

window.deleteRoom = async id => {
  if (!confirm('Deactivate this room?')) return;
  try {
    if (!DEMO_MODE) await apiFetch(`/rooms/${id}`, { method:'DELETE' });
    else rooms = rooms.filter(r => r.id !== id);
    toast('Room removed.', 'success');
    renderRoomsTable(rooms);
  } catch(e) { toast(e.message, 'error'); }
};

// ═══════════════════════════════════════════════════════════════
// DOORS
// ═══════════════════════════════════════════════════════════════
async function loadDoors() {
  await ensureFloors();
  const el = document.getElementById('doorsContent');
  let doors = DEMO_MODE ? getDemoDoors() : (await apiFetch('/doors/').catch(()=>({doors:getDemoDoors()}))).doors;
  el.innerHTML = `
  <div class="table-container">
    <table class="table">
      <thead><tr><th>Door Name</th><th>Floor</th><th>Room</th><th>Node ID</th><th>Accessible</th><th>Actions</th></tr></thead>
      <tbody>
        ${doors.map(d => {
          const floorName = floors.find(f => f.id === d.floorId)?.name || d.floorId;
          return `<tr>
            <td style="font-weight:600;color:var(--text-primary);">🚪 ${d.name}</td>
            <td><span class="badge badge-purple">${floorName}</span></td>
            <td style="color:var(--text-muted);">${d.roomId||'—'}</td>
            <td><code style="font-size:11px;color:var(--text-accent);">${d.nodeId||'—'}</code></td>
            <td>${d.isAccessible?'<span class="badge badge-success">Yes</span>':'<span class="badge badge-warning">No</span>'}</td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteDoor('${d.id}')">×</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
  document.getElementById('addDoorBtn').onclick = () => toast('Use the Navigation Graph Editor to place doors.', 'info');
}

function getDemoDoors() {
  return [
    { id:'door-01', name:'Main Entrance Door', floorId:'floor-0', roomId:'r01', nodeId:'node-entrance', isAccessible:true },
    { id:'door-02', name:'CS Lab 1 Door',      floorId:'floor-2', roomId:'r09', nodeId:'node-lab1',     isAccessible:true },
    { id:'door-03', name:'Library Door',        floorId:'floor-2', roomId:'r12', nodeId:'node-library',  isAccessible:true },
    { id:'door-04', name:'Canteen Door',        floorId:'floor-0', roomId:'r03', nodeId:'node-canteen',  isAccessible:true },
    { id:'door-05', name:'Auditorium Door',     floorId:'floor-0', roomId:'r14', nodeId:'node-audi',     isAccessible:true },
  ];
}

window.deleteDoor = async id => {
  if (!confirm('Delete this door?')) return;
  try {
    if (!DEMO_MODE) await apiFetch(`/doors/${id}`, { method:'DELETE' });
    toast('Door removed.', 'success');
    loadDoors();
  } catch(e) { toast(e.message, 'error'); }
};

// ═══════════════════════════════════════════════════════════════
// DESTINATIONS
// ═══════════════════════════════════════════════════════════════
async function loadDestinations() {
  await ensureFloors();
  const el = document.getElementById('destContent');
  destinations = DEMO_MODE ? getDemoDestinations()
    : (await apiFetch('/destinations/').catch(()=>({destinations:getDemoDestinations()}))).destinations;

  populateFloorSelect('destFloor');
  renderDestinationsTable(destinations);

  document.getElementById('addDestBtn').onclick = () => { clearDestForm(); openModal('destModal'); };
  document.getElementById('saveDestBtn').onclick = saveDest;

  document.getElementById('destSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderDestinationsTable(destinations.filter(d =>
      d.name.toLowerCase().includes(q) || (d.department||'').toLowerCase().includes(q) ||
      (d.category||'').toLowerCase().includes(q)));
  });
}

function getDemoDestinations() {
  return [
    { id:'dest-01', name:'CS Lab 1',          floorId:'floor-2', category:'LAB',       department:'Computer Science', roomNumber:'2-01', description:'Main computer science lab', isActive:true, visitCount:45 },
    { id:'dest-02', name:'CS Lab 2',          floorId:'floor-2', category:'LAB',       department:'Computer Science', roomNumber:'2-02', description:'Advanced programming lab',  isActive:true, visitCount:32 },
    { id:'dest-03', name:'AI Lab',            floorId:'floor-2', category:'LAB',       department:'Computer Science', roomNumber:'2-03', description:'Artificial Intelligence and ML lab', isActive:true, visitCount:28 },
    { id:'dest-04', name:'Library',           floorId:'floor-2', category:'LIBRARY',   department:'Library',          roomNumber:'2-10', description:'College library with 10,000+ books', isActive:true, visitCount:67 },
    { id:'dest-05', name:'Canteen',           floorId:'floor-0', category:'CANTEEN',   department:'Facilities',       roomNumber:'G-10', description:'College canteen — open 8am to 5pm', isActive:true, visitCount:120 },
    { id:'dest-06', name:'Principal Office',  floorId:'floor-0', category:'OFFICE',    department:'Administration',   roomNumber:'G-01', description:'Principal\'s Office',       isActive:true, visitCount:15 },
    { id:'dest-07', name:'HOD CSE Office',    floorId:'floor-2', category:'OFFICE',    department:'Computer Science', roomNumber:'2-20', description:'Head of Department — CSE',  isActive:true, visitCount:22 },
    { id:'dest-08', name:'Auditorium',        floorId:'floor-0', category:'FACILITY',  department:'Administration',   roomNumber:'G-20', description:'Main college auditorium (500 seats)', isActive:true, visitCount:18 },
    { id:'dest-09', name:'Seminar Hall',      floorId:'floor-1', category:'FACILITY',  department:'Administration',   roomNumber:'1-20', description:'Seminar hall for events',   isActive:true, visitCount:12 },
    { id:'dest-10', name:'Main Entrance',     floorId:'floor-0', category:'OTHER',     department:'Administration',   roomNumber:'G-00', description:'College main entrance',     isActive:true, visitCount:200 },
    { id:'dest-11', name:'CS Department',     floorId:'floor-1', category:'OFFICE',    department:'Computer Science', roomNumber:'1-01', description:'CS department office',      isActive:true, visitCount:30 },
    { id:'dest-12', name:'Conference Room',   floorId:'floor-3', category:'FACILITY',  department:'Administration',   roomNumber:'3-05', description:'For meetings & events',     isActive:true, visitCount:8 },
  ];
}

function renderDestinationsTable(data) {
  const el = document.getElementById('destContent');
  const catIcons = { LAB:'🔬', CLASSROOM:'📚', OFFICE:'🏢', LIBRARY:'📖', CANTEEN:'🍽️', FACILITY:'🏛️', OTHER:'📍' };
  el.innerHTML = `
  <div class="table-container">
    <table class="table">
      <thead><tr><th>Destination</th><th>Floor</th><th>Category</th><th>Room No.</th><th>Visits</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${data.map(d => {
          const floorName = floors.find(f => f.id === d.floorId)?.name || d.floorId;
          return `<tr>
            <td>
              <div style="font-weight:600;color:var(--text-primary);">${catIcons[d.category]||'📍'} ${d.name}</div>
              <div style="font-size:11px;color:var(--text-muted);">${d.department||''}</div>
            </td>
            <td><span class="badge badge-purple">${floorName}</span></td>
            <td><span class="badge badge-cyan">${d.category}</span></td>
            <td style="color:var(--text-muted);">${d.roomNumber||'—'}</td>
            <td style="font-weight:600;color:var(--text-accent);">${d.visitCount||0}</td>
            <td><span class="badge ${d.isActive?'badge-success':'badge-error'}">${d.isActive?'Active':'Hidden'}</span></td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick='editDest(${JSON.stringify(d)})'>Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteDest('${d.id}')">×</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function clearDestForm() {
  ['destId','destName','destDepartment','destRoomNumber','destDescription','destNodeId'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('destModalTitle').textContent = 'Add Destination';
}

window.editDest = d => {
  document.getElementById('destId').value          = d.id;
  document.getElementById('destName').value        = d.name;
  document.getElementById('destFloor').value       = d.floorId;
  document.getElementById('destCategory').value    = d.category || 'LAB';
  document.getElementById('destDepartment').value  = d.department || '';
  document.getElementById('destRoomNumber').value  = d.roomNumber || '';
  document.getElementById('destDescription').value = d.description || '';
  document.getElementById('destNodeId').value      = d.nodeId || '';
  document.getElementById('destModalTitle').textContent = 'Edit Destination';
  openModal('destModal');
};

async function saveDest() {
  const id = document.getElementById('destId').value;
  const data = {
    name:        document.getElementById('destName').value,
    floorId:     document.getElementById('destFloor').value,
    category:    document.getElementById('destCategory').value,
    department:  document.getElementById('destDepartment').value,
    roomNumber:  document.getElementById('destRoomNumber').value,
    description: document.getElementById('destDescription').value,
    nodeId:      document.getElementById('destNodeId').value,
    isActive:    true,
  };
  if (!data.name || !data.floorId) { toast('Name and floor required', 'error'); return; }
  try {
    if (!DEMO_MODE) {
      if (id) await apiFetch(`/destinations/${id}`, { method:'PUT', body:JSON.stringify(data) });
      else    await apiFetch('/destinations/',       { method:'POST', body:JSON.stringify(data) });
    } else {
      if (id) { const i = destinations.findIndex(d=>d.id===id); if(i>-1) destinations[i]={...destinations[i],...data}; }
      else destinations.push({ id:'dest-'+(destinations.length+1).toString().padStart(2,'0'), visitCount:0, ...data });
    }
    toast(id ? 'Destination updated!' : 'Destination created!', 'success');
    closeModal('destModal');
    renderDestinationsTable(destinations);
  } catch(e) { toast(e.message, 'error'); }
}

window.deleteDest = async id => {
  if (!confirm('Deactivate this destination?')) return;
  try {
    if (!DEMO_MODE) await apiFetch(`/destinations/${id}`, { method:'DELETE' });
    else destinations = destinations.filter(d => d.id !== id);
    toast('Destination removed.', 'success');
    renderDestinationsTable(destinations);
  } catch(e) { toast(e.message, 'error'); }
};

// ═══════════════════════════════════════════════════════════════
// NAVIGATION GRAPH EDITOR
// ═══════════════════════════════════════════════════════════════
let graphState = { nodes:[], edges:[], selectedTool:'select', selectedNode:null, edgeSrc:null, scale:1, offsetX:0, offsetY:0 };

const NODE_COLORS = {
  CORRIDOR:'#60A5FA', DOOR:'#34D399', ROOM:'#A78BFA', STAIRCASE:'#FBBF24',
  ELEVATOR:'#F87171', ENTRANCE:'#4ADE80', EXIT:'#FB923C', DESTINATION:'#FB923C',
  LANDMARK:'#E879F9'
};

async function loadGraphEditor() {
  await ensureFloors();
  populateFloorSelect('graphFloorSelect');
  document.getElementById('graphFloorSelect').addEventListener('change', loadFloorGraph);

  // Tool buttons
  document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      graphState.selectedTool = btn.dataset.tool;
      graphState.edgeSrc = null;
    });
  });

  document.getElementById('graphSaveBtn').onclick = saveGraph;
  document.getElementById('graphLoadBtn').onclick  = loadFloorGraph;

  initGraphCanvas();
}

function initGraphCanvas() {
  const canvas = document.getElementById('graphCanvas');
  const container = canvas.parentElement;
  canvas.width  = container.clientWidth;
  canvas.height = container.clientHeight;

  canvas.addEventListener('click',     graphCanvasClick);
  canvas.addEventListener('mousedown', graphCanvasMouseDown);
  canvas.addEventListener('mousemove', graphCanvasMouseMove);
  canvas.addEventListener('mouseup',   graphCanvasMouseUp);

  drawGraph();
}

async function loadFloorGraph() {
  const floorId = document.getElementById('graphFloorSelect').value;
  if (!floorId) return;

  if (DEMO_MODE) {
    graphState.nodes = getDemoNodes().filter(n => n.floorId === floorId);
    graphState.edges = getDemoEdges().filter(e => e.floorId === floorId);
  } else {
    try {
      const [nd, ed] = await Promise.all([
        apiFetch(`/nodes/?floor=${floorId}`),
        apiFetch(`/edges/?floor=${floorId}`),
      ]);
      graphState.nodes = nd.nodes;
      graphState.edges = ed.edges;
    } catch (e) {
      graphState.nodes = getDemoNodes().filter(n => n.floorId === floorId);
      graphState.edges = getDemoEdges().filter(e => e.floorId === floorId);
    }
  }

  updateGraphStats();
  drawGraph();
  document.getElementById('graphHint').style.display = 'none';
}

function getDemoNodes() {
  // Ground floor
  const f0 = 'floor-0', f1='floor-1', f2='floor-2', f3='floor-3';
  return [
    // Floor 0
    { id:'n-entrance', floorId:f0, x:300, y:480, z:0, type:'ENTRANCE',   label:'Main Entrance' },
    { id:'n-cor-g1',   floorId:f0, x:300, y:350, z:0, type:'CORRIDOR',   label:'Corridor G1'   },
    { id:'n-cor-g2',   floorId:f0, x:200, y:250, z:0, type:'CORRIDOR',   label:'Corridor G2'   },
    { id:'n-cor-g3',   floorId:f0, x:400, y:250, z:0, type:'CORRIDOR',   label:'Corridor G3'   },
    { id:'n-canteen',  floorId:f0, x:150, y:150, z:0, type:'DESTINATION',label:'Canteen'        },
    { id:'n-audi',     floorId:f0, x:450, y:150, z:0, type:'DESTINATION',label:'Auditorium'     },
    { id:'n-principal',floorId:f0, x:300, y:150, z:0, type:'ROOM',       label:'Principal'      },
    { id:'n-stair-g',  floorId:f0, x:550, y:300, z:0, type:'STAIRCASE',  label:'Stairs G→1'    },
    { id:'n-elev-g',   floorId:f0, x:80,  y:300, z:0, type:'ELEVATOR',   label:'Elevator G'     },
    // Floor 1
    { id:'n-stair-1',  floorId:f1, x:550, y:300, z:3.5, type:'STAIRCASE', label:'Stairs 1' },
    { id:'n-cor-1a',   floorId:f1, x:400, y:300, z:3.5, type:'CORRIDOR',  label:'Corridor 1A' },
    { id:'n-cor-1b',   floorId:f1, x:250, y:300, z:3.5, type:'CORRIDOR',  label:'Corridor 1B' },
    { id:'n-cs-dept',  floorId:f1, x:200, y:200, z:3.5, type:'DESTINATION',label:'CS Dept'   },
    { id:'n-seminar',  floorId:f1, x:400, y:180, z:3.5, type:'DESTINATION',label:'Seminar Hall'},
    { id:'n-stair-12', floorId:f1, x:550, y:150, z:3.5, type:'STAIRCASE', label:'Stairs 1→2'},
    // Floor 2
    { id:'n-stair-2',  floorId:f2, x:550, y:300, z:7, type:'STAIRCASE',  label:'Stairs 2' },
    { id:'n-cor-2a',   floorId:f2, x:400, y:300, z:7, type:'CORRIDOR',   label:'Corridor 2A' },
    { id:'n-cor-2b',   floorId:f2, x:250, y:300, z:7, type:'CORRIDOR',   label:'Corridor 2B' },
    { id:'n-lab1',     floorId:f2, x:150, y:200, z:7, type:'DESTINATION',label:'CS Lab 1'     },
    { id:'n-lab2',     floorId:f2, x:300, y:150, z:7, type:'DESTINATION',label:'CS Lab 2'     },
    { id:'n-library',  floorId:f2, x:450, y:180, z:7, type:'DESTINATION',label:'Library'      },
    { id:'n-hod',      floorId:f2, x:150, y:380, z:7, type:'ROOM',       label:'HOD CSE'      },
    // Floor 3
    { id:'n-stair-3',  floorId:f3, x:550, y:300, z:10.5, type:'STAIRCASE', label:'Stairs 3' },
    { id:'n-cor-3a',   floorId:f3, x:350, y:300, z:10.5, type:'CORRIDOR',  label:'Corridor 3A'},
    { id:'n-staff',    floorId:f3, x:200, y:200, z:10.5, type:'ROOM',      label:'Staff Room' },
    { id:'n-conf',     floorId:f3, x:400, y:180, z:10.5, type:'DESTINATION',label:'Conference'},
  ];
}

function getDemoEdges() {
  const f0='floor-0', f1='floor-1', f2='floor-2', f3='floor-3';
  return [
    // Floor 0
    { id:'e-g1', startNodeId:'n-entrance',  endNodeId:'n-cor-g1', distance:5,  isWalkable:true, floorId:f0 },
    { id:'e-g2', startNodeId:'n-cor-g1',    endNodeId:'n-cor-g2', distance:8,  isWalkable:true, floorId:f0 },
    { id:'e-g3', startNodeId:'n-cor-g1',    endNodeId:'n-cor-g3', distance:8,  isWalkable:true, floorId:f0 },
    { id:'e-g4', startNodeId:'n-cor-g2',    endNodeId:'n-canteen',distance:6,  isWalkable:true, floorId:f0 },
    { id:'e-g5', startNodeId:'n-cor-g2',    endNodeId:'n-principal',distance:5,isWalkable:true, floorId:f0 },
    { id:'e-g6', startNodeId:'n-cor-g3',    endNodeId:'n-audi',   distance:6,  isWalkable:true, floorId:f0 },
    { id:'e-g7', startNodeId:'n-cor-g1',    endNodeId:'n-stair-g',distance:10, isWalkable:true, floorId:f0 },
    { id:'e-g8', startNodeId:'n-cor-g2',    endNodeId:'n-elev-g', distance:8,  isWalkable:true, floorId:f0 },
    // Floor 1
    { id:'e-1a', startNodeId:'n-stair-1',  endNodeId:'n-cor-1a',  distance:5, isWalkable:true, floorId:f1 },
    { id:'e-1b', startNodeId:'n-cor-1a',   endNodeId:'n-cor-1b',  distance:8, isWalkable:true, floorId:f1 },
    { id:'e-1c', startNodeId:'n-cor-1b',   endNodeId:'n-cs-dept', distance:6, isWalkable:true, floorId:f1 },
    { id:'e-1d', startNodeId:'n-cor-1a',   endNodeId:'n-seminar', distance:7, isWalkable:true, floorId:f1 },
    { id:'e-1e', startNodeId:'n-stair-1',  endNodeId:'n-stair-12',distance:4, isWalkable:true, floorId:f1 },
    // Floor 2
    { id:'e-2a', startNodeId:'n-stair-2',  endNodeId:'n-cor-2a',  distance:5, isWalkable:true, floorId:f2 },
    { id:'e-2b', startNodeId:'n-cor-2a',   endNodeId:'n-cor-2b',  distance:8, isWalkable:true, floorId:f2 },
    { id:'e-2c', startNodeId:'n-cor-2b',   endNodeId:'n-lab1',    distance:6, isWalkable:true, floorId:f2 },
    { id:'e-2d', startNodeId:'n-cor-2b',   endNodeId:'n-lab2',    distance:7, isWalkable:true, floorId:f2 },
    { id:'e-2e', startNodeId:'n-cor-2a',   endNodeId:'n-library', distance:6, isWalkable:true, floorId:f2 },
    { id:'e-2f', startNodeId:'n-cor-2b',   endNodeId:'n-hod',     distance:5, isWalkable:true, floorId:f2 },
    // Floor 3
    { id:'e-3a', startNodeId:'n-stair-3',  endNodeId:'n-cor-3a',  distance:5, isWalkable:true, floorId:f3 },
    { id:'e-3b', startNodeId:'n-cor-3a',   endNodeId:'n-staff',   distance:6, isWalkable:true, floorId:f3 },
    { id:'e-3c', startNodeId:'n-cor-3a',   endNodeId:'n-conf',    distance:5, isWalkable:true, floorId:f3 },
    // Floor transitions
    { id:'e-t01', startNodeId:'n-stair-g', endNodeId:'n-stair-1',  distance:6, isWalkable:true, isFloorTransition:true, transitionType:'STAIR', floorId:'multi' },
    { id:'e-t12', startNodeId:'n-stair-12',endNodeId:'n-stair-2',  distance:6, isWalkable:true, isFloorTransition:true, transitionType:'STAIR', floorId:'multi' },
    { id:'e-t23', startNodeId:'n-stair-2', endNodeId:'n-stair-3',  distance:6, isWalkable:true, isFloorTransition:true, transitionType:'STAIR', floorId:'multi' },
  ];
}

let graphDragging = null, mouseStart = null;

function graphCanvasClick(e) {
  const canvas = document.getElementById('graphCanvas');
  const rect   = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const tool = graphState.selectedTool;

  if (tool === 'add-node') {
    const newNode = {
      id: 'node-' + Math.random().toString(36).substr(2,8),
      floorId: document.getElementById('graphFloorSelect').value,
      x: mx, y: my, z: 0,
      type: document.getElementById('nodeTypeSelect').value,
      label: document.getElementById('nodeTypeSelect').value,
    };
    graphState.nodes.push(newNode);
    updateGraphStats(); drawGraph();
  }

  if (tool === 'add-edge') {
    const hit = hitTestNode(mx, my);
    if (hit) {
      if (!graphState.edgeSrc) {
        graphState.edgeSrc = hit;
        toast(`Edge start: ${hit.label||hit.id}. Click another node.`, 'info');
      } else if (graphState.edgeSrc.id !== hit.id) {
        const dist = Math.sqrt((hit.x - graphState.edgeSrc.x)**2 + (hit.y - graphState.edgeSrc.y)**2);
        graphState.edges.push({
          id: 'edge-' + Math.random().toString(36).substr(2,8),
          startNodeId: graphState.edgeSrc.id,
          endNodeId:   hit.id,
          distance:    Math.round(dist * 0.1),
          isWalkable:  true,
          floorId:     document.getElementById('graphFloorSelect').value,
        });
        graphState.edgeSrc = null;
        updateGraphStats(); drawGraph();
        toast('Path connected!', 'success');
      }
    }
  }

  if (tool === 'select') {
    const hit = hitTestNode(mx, my);
    graphState.selectedNode = hit || null;
    if (hit) {
      document.getElementById('selectedNodeInfo').innerHTML =
        `<strong>${hit.label||hit.type}</strong><br>
         <span style="color:var(--text-muted);font-size:11px;">ID: ${hit.id}</span><br>
         <span class="badge badge-info">${hit.type}</span>`;
    } else {
      document.getElementById('selectedNodeInfo').textContent = 'None';
    }
    drawGraph();
  }

  if (tool === 'delete') {
    const hit = hitTestNode(mx, my);
    if (hit) {
      graphState.nodes = graphState.nodes.filter(n => n.id !== hit.id);
      graphState.edges = graphState.edges.filter(e => e.startNodeId !== hit.id && e.endNodeId !== hit.id);
      toast('Node deleted.', 'warning');
      updateGraphStats(); drawGraph();
    }
  }
}

function graphCanvasMouseDown(e) {
  if (graphState.selectedTool !== 'select') return;
  const canvas = document.getElementById('graphCanvas');
  const rect = canvas.getBoundingClientRect();
  const hit = hitTestNode(e.clientX - rect.left, e.clientY - rect.top);
  if (hit) { graphDragging = hit; mouseStart = { x:e.clientX, y:e.clientY }; }
}

function graphCanvasMouseMove(e) {
  if (!graphDragging) return;
  const dx = e.clientX - mouseStart.x;
  const dy = e.clientY - mouseStart.y;
  graphDragging.x += dx;
  graphDragging.y += dy;
  mouseStart = { x:e.clientX, y:e.clientY };
  drawGraph();
}

function graphCanvasMouseUp() { graphDragging = null; }

function hitTestNode(mx, my) {
  const R = 14;
  return graphState.nodes.find(n => Math.abs(n.x - mx) < R && Math.abs(n.y - my) < R) || null;
}

function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

  // Edges
  graphState.edges.forEach(e => {
    const a = graphState.nodes.find(n => n.id === e.startNodeId);
    const b = graphState.nodes.find(n => n.id === e.endNodeId);
    if (!a || !b) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = e.isFloorTransition ? '#FBBF24' : 'rgba(129,140,248,0.6)';
    ctx.lineWidth = e.isFloorTransition ? 2.5 : 1.5;
    ctx.setLineDash(e.isFloorTransition ? [6,3] : []);
    ctx.stroke();
    ctx.setLineDash([]);

    // Distance label
    const mx2 = (a.x + b.x) / 2, my2 = (a.y + b.y) / 2;
    ctx.fillStyle = 'rgba(160,160,200,0.8)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`${e.distance||''}m`, mx2, my2 - 4);
  });

  // Nodes
  graphState.nodes.forEach(n => {
    const color = NODE_COLORS[n.type] || '#818CF8';
    const isSelected = graphState.selectedNode?.id === n.id;
    const isEdgeSrc  = graphState.edgeSrc?.id === n.id;

    // Shadow / glow
    if (isSelected || isEdgeSrc) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = 20;
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, isSelected ? 13 : 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(n.label || n.type, n.x, n.y + 22);
  });
}

function updateGraphStats() {
  document.getElementById('graphNodeCount').textContent = graphState.nodes.length;
  document.getElementById('graphEdgeCount').textContent = graphState.edges.length;
}

async function saveGraph() {
  const floorId = document.getElementById('graphFloorSelect').value;
  if (!floorId) { toast('Select a floor first.', 'error'); return; }
  if (!DEMO_MODE) {
    try {
      await apiFetch('/nodes/batch', { method:'POST', body:JSON.stringify({
        nodes: graphState.nodes.map(n => ({ ...n, floorId }))
      })});
      await apiFetch('/edges/batch', { method:'POST', body:JSON.stringify({
        edges: graphState.edges.map(e => ({ ...e }))
      })});
      toast(`Graph saved! ${graphState.nodes.length} nodes, ${graphState.edges.length} edges.`, 'success');
    } catch(e) { toast(e.message, 'error'); }
  } else {
    toast(`Graph saved (Demo)! ${graphState.nodes.length} nodes, ${graphState.edges.length} edges.`, 'success');
  }
}

// ═══════════════════════════════════════════════════════════════
// QR CHECKPOINTS
// ═══════════════════════════════════════════════════════════════
async function loadQRCheckpoints() {
  await ensureFloors();
  populateFloorSelect('qrFloor');
  const grid = document.getElementById('qrGrid');
  const checkpoints = DEMO_MODE ? getDemoQR()
    : (await apiFetch('/qr/').catch(()=>({checkpoints:getDemoQR()}))).checkpoints;

  grid.innerHTML = checkpoints.map(qr => `
  <div class="qr-card">
    <div class="qr-placeholder">
      <svg viewBox="0 0 100 100" style="width:100px;height:100px;">
        <!-- Simplified QR pattern -->
        <rect fill="#000" x="10" y="10" width="30" height="30"/>
        <rect fill="#fff" x="15" y="15" width="20" height="20"/>
        <rect fill="#000" x="18" y="18" width="14" height="14"/>
        <rect fill="#000" x="60" y="10" width="30" height="30"/>
        <rect fill="#fff" x="65" y="15" width="20" height="20"/>
        <rect fill="#000" x="68" y="18" width="14" height="14"/>
        <rect fill="#000" x="10" y="60" width="30" height="30"/>
        <rect fill="#fff" x="15" y="65" width="20" height="20"/>
        <rect fill="#000" x="18" y="68" width="14" height="14"/>
        <rect fill="#000" x="45" y="10" width="5" height="5"/>
        <rect fill="#000" x="45" y="20" width="5" height="10"/>
        <rect fill="#000" x="10" y="45" width="10" height="5"/>
        <rect fill="#000" x="30" y="45" width="10" height="5"/>
        <rect fill="#000" x="45" y="45" width="10" height="5"/>
        <rect fill="#000" x="60" y="45" width="30" height="5"/>
        <rect fill="#000" x="45" y="55" width="15" height="5"/>
        <rect fill="#000" x="65" y="60" width="5" height="30"/>
        <rect fill="#000" x="75" y="70" width="15" height="5"/>
        <rect fill="#000" x="85" y="80" width="5" height="10"/>
        <text x="50" y="97" text-anchor="middle" font-size="5" fill="#333">${qr.id}</text>
      </svg>
    </div>
    <div style="font-weight:600;color:var(--text-primary);margin-bottom:4px;">${qr.label}</div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
      ${floors.find(f=>f.id===qr.floorId)?.name || qr.floorId}<br/>
      Node: <code style="color:var(--text-accent);">${qr.nodeId||'—'}</code>
    </div>
    <code style="font-size:9px;color:var(--text-muted);word-break:break-all;">${qr.qrData||''}</code>
    <div style="margin-top:10px;">
      <span class="badge ${qr.isActive?'badge-success':'badge-error'}">${qr.isActive?'Active':'Inactive'}</span>
    </div>
  </div>`).join('');

  document.getElementById('addQRBtn').onclick = () => openModal('qrModal');
  document.getElementById('saveQRBtn').onclick = saveQR;
}

function getDemoQR() {
  return [
    { id:'qr-entrance',  label:'Main Entrance',  floorId:'floor-0', nodeId:'n-entrance', qrData:'yit-nav://checkpoint/qr-entrance',  isActive:true, scanCount:45 },
    { id:'qr-canteen',   label:'Canteen Area',   floorId:'floor-0', nodeId:'n-canteen',  qrData:'yit-nav://checkpoint/qr-canteen',   isActive:true, scanCount:23 },
    { id:'qr-stair-g',   label:'Ground Stairs',  floorId:'floor-0', nodeId:'n-stair-g',  qrData:'yit-nav://checkpoint/qr-stair-g',  isActive:true, scanCount:18 },
    { id:'qr-lab1',      label:'CS Lab 1 Entry', floorId:'floor-2', nodeId:'n-lab1',     qrData:'yit-nav://checkpoint/qr-lab1',     isActive:true, scanCount:32 },
    { id:'qr-library',   label:'Library',        floorId:'floor-2', nodeId:'n-library',  qrData:'yit-nav://checkpoint/qr-library',  isActive:true, scanCount:28 },
    { id:'qr-stair-2',   label:'Floor 2 Stairs', floorId:'floor-2', nodeId:'n-stair-2',  qrData:'yit-nav://checkpoint/qr-stair-2', isActive:true, scanCount:15 },
  ];
}

async function saveQR() {
  const data = {
    label:       document.getElementById('qrLabel').value,
    floorId:     document.getElementById('qrFloor').value,
    nodeId:      document.getElementById('qrNodeId').value,
    description: document.getElementById('qrDescription').value,
  };
  if (!data.label || !data.floorId) { toast('Label and floor required', 'error'); return; }
  try {
    if (!DEMO_MODE) await apiFetch('/qr/', { method:'POST', body:JSON.stringify(data) });
    toast('QR checkpoint created!', 'success');
    closeModal('qrModal');
    loadQRCheckpoints();
  } catch(e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════════════════════
// ROUTE TESTING
// ═══════════════════════════════════════════════════════════════
async function loadRouteTester() {
  const allNodes = DEMO_MODE ? getDemoNodes() : (await apiFetch('/nodes/').catch(()=>({nodes:getDemoNodes()}))).nodes;
  nodes = allNodes;

  const allDests = DEMO_MODE ? getDemoDestinations()
    : (await apiFetch('/destinations/').catch(()=>({destinations:getDemoDestinations()}))).destinations;

  const startSel = document.getElementById('routeStartSelect');
  const endSel   = document.getElementById('routeEndSelect');
  startSel.innerHTML = '<option value="">Select start…</option>';
  endSel.innerHTML   = '<option value="">Select destination…</option>';

  allNodes.forEach(n => {
    const opt = `<option value="${n.id}">[${n.type}] ${n.label||n.id} (${floors.find(f=>f.id===n.floorId)?.name||n.floorId})</option>`;
    startSel.innerHTML += opt;
    endSel.innerHTML   += opt;
  });

  document.getElementById('calculateRouteBtn').onclick = calculateTestRoute;
}

async function calculateTestRoute() {
  const startId = document.getElementById('routeStartSelect').value;
  const endId   = document.getElementById('routeEndSelect').value;
  if (!startId || !endId) { toast('Select start and destination.', 'error'); return; }

  const btn = document.getElementById('calculateRouteBtn');
  btn.disabled = true;
  btn.textContent = 'Calculating…';

  document.getElementById('routeResultCard').style.display = 'none';
  document.getElementById('noRouteMsg').style.display = 'none';

  try {
    let result;
    if (!DEMO_MODE) {
      result = await apiFetch('/navigation/route', {
        method:'POST',
        body: JSON.stringify({
          startNodeId: startId, endNodeId: endId,
          accessibleOnly: document.getElementById('accessibleOnly').checked,
        })
      });
    } else {
      result = runDemoAstar(startId, endId);
    }

    if (result.error) {
      document.getElementById('noRouteMsg').style.display = 'block';
    } else {
      renderRouteResult(result);
    }
  } catch (e) {
    const demoResult = runDemoAstar(startId, endId);
    if (demoResult) renderRouteResult(demoResult);
    else document.getElementById('noRouteMsg').style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '🧭 Calculate A* Route';
  }
}

function runDemoAstar(startId, endId) {
  // Simple BFS on demo graph for demo mode
  const allNodes = getDemoNodes();
  const allEdges = getDemoEdges();
  const nodeMap = Object.fromEntries(allNodes.map(n=>[n.id,n]));

  const adj = {};
  allEdges.forEach(e => {
    if (!adj[e.startNodeId]) adj[e.startNodeId] = [];
    if (!adj[e.endNodeId])   adj[e.endNodeId]   = [];
    adj[e.startNodeId].push({ id:e.endNodeId, dist:e.distance, edge:e });
    adj[e.endNodeId].push({ id:e.startNodeId, dist:e.distance, edge:e });
  });

  // BFS (simplified)
  const visited = new Set();
  const queue = [{ id:startId, path:[startId], dist:0 }];
  visited.add(startId);

  while (queue.length) {
    const { id, path, dist } = queue.shift();
    if (id === endId) {
      const pathNodes = path.map(nid => nodeMap[nid]).filter(Boolean);
      const instructions = [];
      let totalDist = 0;

      for (let i=0; i<path.length-1; i++) {
        const a=nodeMap[path[i]], b=nodeMap[path[i+1]];
        if (!a||!b) continue;
        const edg = allEdges.find(e=>(e.startNodeId===a.id&&e.endNodeId===b.id)||(e.endNodeId===a.id&&e.startNodeId===b.id));
        const d = edg?.distance || 5;
        totalDist += d;

        if (edg?.isFloorTransition) {
          const fname = getDemoFloors().find(f=>f.id===b.floorId)?.name || b.floorId;
          instructions.push({ text:`Take ${edg.transitionType==='ELEVATOR'?'elevator':'staircase'} to ${fname}.`, type:edg.transitionType||'STAIR', distance:d });
        } else if (b.type==='DESTINATION'||b.type==='ROOM') {
          instructions.push({ text:`Your destination ${b.label} is ahead.`, type:'DESTINATION_NEAR', distance:d });
        } else {
          instructions.push({ text:`Walk ${d}m towards ${b.label||b.type}.`, type:'WALK', distance:d });
        }
      }
      instructions.unshift({ text:`Start from ${nodeMap[startId]?.label||startId}.`, type:'START', distance:0 });
      instructions.push({ text:`You have arrived at ${nodeMap[endId]?.label||endId}.`, type:'ARRIVED', distance:0 });

      const floors_ = [...new Set(pathNodes.map(n=>n.floorId))];
      return {
        path, instructions,
        summary: {
          totalDistance: totalDist,
          estimatedSeconds: Math.round(totalDist/1.2),
          estimatedMinutes: Math.round(totalDist/1.2/60*10)/10,
          floorCount: floors_.length,
          floors: floors_,
          nodeCount: path.length,
        }
      };
    }
    for (const nb of (adj[id]||[])) {
      if (!visited.has(nb.id)) { visited.add(nb.id); queue.push({ id:nb.id, path:[...path,nb.id], dist:dist+nb.dist }); }
    }
  }
  return null;
}

function renderRouteResult(result) {
  const card = document.getElementById('routeResultCard');
  card.style.display = 'block';

  const s = result.summary;
  document.getElementById('routeBadges').innerHTML = `
    <span class="badge badge-info">${s.totalDistance}m</span>
    <span class="badge badge-success">${s.estimatedMinutes} min</span>
    <span class="badge badge-purple">${s.floorCount} floor(s)</span>
    <span class="badge badge-cyan">${s.nodeCount} nodes</span>`;

  document.getElementById('routeSummary').innerHTML = `
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:0;">
      <div style="text-align:center;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md);">
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);">${s.totalDistance}m</div>
        <div style="font-size:11px;color:var(--text-muted);">Distance</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md);">
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);">${s.estimatedMinutes}</div>
        <div style="font-size:11px;color:var(--text-muted);">Minutes</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md);">
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);">${s.floorCount}</div>
        <div style="font-size:11px;color:var(--text-muted);">Floors</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-elevated);border-radius:var(--radius-md);">
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);">${s.nodeCount}</div>
        <div style="font-size:11px;color:var(--text-muted);">Waypoints</div>
      </div>
    </div>`;

  const typeIcons = { START:'🚶',WALK:'→',STAIR:'🪜',ELEVATOR:'🛗',DESTINATION_NEAR:'📍',ARRIVED:'✅',TURN:'↩',WAYPOINT:'·' };
  const typeClass = { START:'walk',WALK:'walk',STAIR:'stair',ELEVATOR:'elevator',ARRIVED:'arrive',DESTINATION_NEAR:'arrive' };

  document.getElementById('routeInstructions').innerHTML = result.instructions.map((ins, i) => `
  <div class="route-step">
    <div class="route-step-icon ${typeClass[ins.type]||'walk'}">${typeIcons[ins.type]||'→'}</div>
    <div style="flex:1;">
      <div style="font-size:14px;font-weight:500;color:var(--text-primary);">${ins.text}</div>
      ${ins.distance ? `<div style="font-size:12px;color:var(--text-muted);">${ins.distance}m</div>` : ''}
    </div>
    <div style="font-size:12px;color:var(--text-muted);font-weight:600;">${i+1}</div>
  </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');
  const users = DEMO_MODE ? getDemoUsers() : (await apiFetch('/users/').catch(()=>({users:getDemoUsers()}))).users;

  tbody.innerHTML = users.map(u => `
  <tr>
    <td style="font-weight:600;color:var(--text-primary);">${u.name||'—'}</td>
    <td style="color:var(--text-secondary);">${u.email||'—'}</td>
    <td><span class="badge ${u.role==='ADMIN'?'badge-purple':'badge-info'}">${u.role||'USER'}</span></td>
    <td style="color:var(--text-muted);font-size:12px;">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
    <td>
      ${u.role!=='SUPER_ADMIN' ? `
        <button class="btn btn-sm btn-secondary" onclick="promoteUser('${u.id||u.uid}','ADMIN')">Make Admin</button>
        <button class="btn btn-sm btn-danger" onclick="disableUser('${u.id||u.uid}')">Disable</button>` : '<span style="color:var(--text-muted);">Super Admin</span>'}
    </td>
  </tr>`).join('');
}

function getDemoUsers() {
  return [
    { uid:'admin-1', name:'Admin User',   email:'admin@yit.edu.in',   role:'ADMIN',       createdAt:'2024-01-01' },
    { uid:'user-1',  name:'Ravi Kumar',   email:'ravi@yit.edu.in',    role:'USER',        createdAt:'2024-02-10' },
    { uid:'user-2',  name:'Priya Shetty', email:'priya@yit.edu.in',   role:'USER',        createdAt:'2024-03-05' },
  ];
}

window.promoteUser = async (uid, role) => {
  if (!DEMO_MODE) { try { await apiFetch(`/users/${uid}/role`, { method:'PUT', body:JSON.stringify({role}) }); } catch(e) { toast(e.message,'error'); return; } }
  toast(`User promoted to ${role}!`, 'success');
  loadUsers();
};

window.disableUser = async uid => {
  if (!confirm('Disable this user?')) return;
  if (!DEMO_MODE) { try { await apiFetch(`/users/${uid}`, { method:'DELETE' }); } catch(e) { toast(e.message,'error'); return; } }
  toast('User disabled.', 'warning');
  loadUsers();
};

// ═══════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════
async function loadAnalytics() {
  const dests = DEMO_MODE ? getDemoDestinations()
    : (await apiFetch('/destinations/').catch(()=>({destinations:getDemoDestinations()}))).destinations;

  const sorted = [...dests].sort((a,b) => (b.visitCount||0) - (a.visitCount||0)).slice(0,8);
  const max = sorted[0]?.visitCount || 1;

  document.getElementById('popularDestChart').innerHTML = sorted.map(d => `
  <div class="chart-bar-row">
    <div class="chart-bar-label">${d.name}</div>
    <div class="chart-bar-track">
      <div class="chart-bar-fill" style="width:${(d.visitCount/max*100).toFixed(1)}%"></div>
    </div>
    <div class="chart-bar-value">${d.visitCount||0}</div>
  </div>`).join('');

  document.getElementById('recentSessions').innerHTML = `
  <div style="text-align:center;padding:32px;color:var(--text-muted);">
    <div style="font-size:48px;margin-bottom:8px;">📊</div>
    Navigation sessions will appear here after users start navigating.
    <br/><br/>
    <span class="badge badge-info">Sessions are logged by the Android app</span>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
// PUBLISH
// ═══════════════════════════════════════════════════════════════
async function publishMap() {
  if (!confirm('Publish current map data? This will make it available to all Android app users.')) return;
  try {
    if (!DEMO_MODE) {
      const result = await apiFetch('/publish/publish', { method:'POST' });
      toast(`✅ Map published! Version ${result.version}`, 'success');
    } else {
      toast('✅ Map published (Demo Mode)! Version 1', 'success');
    }
    const pubStatus = document.getElementById('publishStatus');
    pubStatus.className = 'badge badge-success';
    pubStatus.textContent = 'Published ✓';
  } catch(e) { toast(e.message, 'error'); }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
async function ensureFloors() {
  if (!floors.length) {
    floors = DEMO_MODE ? getDemoFloors()
      : (await apiFetch('/floors/').catch(()=>({floors:getDemoFloors()}))).floors;
  }
}

function populateFloorSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Select floor…</option>' +
    floors.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
}

// ── Start ────────────────────────────────────────────────────────
init();
