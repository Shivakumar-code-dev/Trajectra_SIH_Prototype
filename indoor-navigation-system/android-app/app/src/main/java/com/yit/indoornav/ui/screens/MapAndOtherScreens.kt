package com.yit.indoornav.ui.screens

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation.NavHostController
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.ui.theme.*

@Composable
fun Map3DScreen(navController: NavHostController, repo: NavigationRepository) {
    var selectedFloor by remember { mutableStateOf(0) }
    val floors = listOf("Ground" to 0, "1st Floor" to 1, "2nd Floor" to 2, "3rd Floor" to 3)

    Box(Modifier.fillMaxSize().background(BackgroundDark)) {
        Column(Modifier.fillMaxSize()) {
            // Top bar
            Surface(color = Color(0xFF1A1A3A)) {
                Row(
                    Modifier.fillMaxWidth().padding(horizontal=16.dp, vertical=12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, null, tint = TextSecondary)
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("3D Campus Map", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text("Yenepoya Institute of Technology", fontSize = 12.sp, color = TextSecondary)
                    }
                    Icon(Icons.Default.Layers, null, tint = CyanAccent)
                }
            }

            // Floor selector
            ScrollableTabRow(
                selectedTabIndex = selectedFloor,
                containerColor = Color(0xFF1A1A3A),
                contentColor = IndigoPrimary,
                edgePadding = 16.dp,
            ) {
                floors.forEachIndexed { index, (label, _) ->
                    Tab(
                        selected = selectedFloor == index,
                        onClick = { selectedFloor = index },
                        text = { Text(label, fontSize = 13.sp, fontWeight = if (selectedFloor == index) FontWeight.Bold else FontWeight.Normal) },
                    )
                }
            }

            // 3D Viewer (WebView with embedded Three.js)
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled  = true
                        webViewClient = WebViewClient()
                        loadDataWithBaseURL(
                            null,
                            generate3DViewerHtml(selectedFloor),
                            "text/html", "utf-8", null,
                        )
                    }
                },
                update = { webView ->
                    webView.evaluateJavascript("isolateFloor($selectedFloor)", null)
                },
                modifier = Modifier.weight(1f).fillMaxWidth(),
            )

            // Instructions
            Surface(color = Color(0xFF1A1A3A)) {
                Column(Modifier.fillMaxWidth().padding(16.dp)) {
                    Text("🕹 Pinch to zoom · Drag to rotate · Two-finger to pan", color = TextMuted, fontSize = 12.sp)
                }
            }
        }
    }
}

private fun generate3DViewerHtml(selectedFloor: Int): String = """
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0f0f1a; overflow:hidden; }
  canvas { display:block; }
</style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.162.0/examples/js/controls/OrbitControls.js"></script>
<script>
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1a);
scene.fog = new THREE.Fog(0x0f0f1a, 30, 80);

const W = window.innerWidth, H = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 200);
camera.position.set(15, 12, 15);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(W,H);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI/2 + 0.1;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(20,30,20); dir.castShadow=true; scene.add(dir);
const fill = new THREE.DirectionalLight(0x4F46E5, 0.3);
fill.position.set(-20,10,-20); scene.add(fill);

// Grid
scene.add(new THREE.GridHelper(40,20,0x222240,0x1a1a30));

const floorColors=[0x4F46E5,0x7C3AED,0x06B6D4,0x10B981];
const allMeshes=[];

for(let fl=0;fl<4;fl++){
  const y=fl*3.2;
  const fmat=new THREE.MeshPhongMaterial({color:floorColors[fl],transparent:true,opacity:0.85});
  const wmat=new THREE.MeshPhongMaterial({color:0x2a2a4a,transparent:true,opacity:0.9});
  const gmat=new THREE.MeshPhongMaterial({color:0x60a5fa,transparent:true,opacity:0.3,side:THREE.DoubleSide});

  const slab=new THREE.Mesh(new THREE.BoxGeometry(16,0.3,12),fmat);
  slab.position.set(0,y-0.15,0); slab.castShadow=true; slab.receiveShadow=true;
  slab.userData.floor=fl; scene.add(slab); allMeshes.push(slab);

  [{w:16,d:0.3,x:0,z:-6},{w:16,d:0.3,x:0,z:6},{w:0.3,d:12,x:-8,z:0},{w:0.3,d:12,x:8,z:0}].forEach(w=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w.w,3,w.d),wmat);
    m.position.set(w.x,y+1.5,w.z); m.castShadow=true; m.userData.floor=fl; scene.add(m); allMeshes.push(m);
  });

  for(let wi=-6;wi<=6;wi+=3){
    const wm=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.5),gmat);
    wm.position.set(wi,y+1.5,6.01); wm.userData.floor=fl; scene.add(wm); allMeshes.push(wm);
  }

  [{x:-5,z:-2.5},{x:0,z:-2.5},{x:5,z:-2.5},{x:-5,z:2.5},{x:0,z:2.5},{x:5,z:2.5}].forEach(rp=>{
    const rm=new THREE.Mesh(new THREE.BoxGeometry(4,2.5,4),
      new THREE.MeshPhongMaterial({color:new THREE.Color(floorColors[fl]).multiplyScalar(0.6),transparent:true,opacity:0.5}));
    rm.position.set(rp.x,y+1.3,rp.z); rm.userData.floor=fl; scene.add(rm); allMeshes.push(rm);
  });
}

const stairM=new THREE.Mesh(new THREE.BoxGeometry(1.5,13,1.5),new THREE.MeshPhongMaterial({color:0xFBBF24}));
stairM.position.set(-6.5,6,4); stairM.userData.floor=-1; scene.add(stairM);

window.isolateFloor = function(fl) {
  allMeshes.forEach(m=>{
    if(m.userData.floor===-1){m.material.opacity=0.9;return;}
    m.material.opacity=m.userData.floor===fl?0.85:0.05;
  });
};
isolateFloor($selectedFloor);

function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}
animate();
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
</script>
</body></html>
""".trimIndent()

// ─── PROFILE ──────────────────────────────────────────────────────────────────

@Composable
fun ProfileScreen(navController: NavHostController, repo: NavigationRepository) {
    val user = repo.getCurrentUser()
    val scope = rememberCoroutineScope()

    Box(Modifier.fillMaxSize().background(BackgroundDark)) {
        Column(Modifier.fillMaxSize()) {
            // Header
            Box(
                Modifier.fillMaxWidth().height(200.dp)
                    .background(androidx.compose.ui.graphics.Brush.verticalGradient(listOf(Color(0xFF1E1E5A), BackgroundDark))),
                contentAlignment = Alignment.BottomCenter,
            ) {
                IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.TopStart).padding(8.dp)) {
                    Icon(Icons.Default.ArrowBack, null, tint = TextSecondary)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(bottom = 16.dp)) {
                    Box(
                        Modifier.size(72.dp)
                            .background(androidx.compose.ui.graphics.Brush.linearGradient(listOf(IndigoPrimary, IndigoVariant)), shape = RoundedCornerShape(36.dp)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            (user?.email?.firstOrNull() ?: 'U').uppercaseChar().toString(),
                            fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.White,
                        )
                    }
                    Spacer(Modifier.height(10.dp))
                    Text(user?.displayName ?: user?.email?.split("@")?.firstOrNull() ?: "Student", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    Text(user?.email ?: "—", fontSize = 13.sp, color = TextSecondary)
                }
            }

            Column(Modifier.padding(20.dp)) {
                Surface(color = CardDark, shape = RoundedCornerShape(16.dp)) {
                    Column {
                        ProfileItem("Email", user?.email ?: "—", "✉️")
                        Divider(color = Color(0xFF1E1E3A))
                        ProfileItem("UID", user?.uid?.take(12)?.plus("…") ?: "—", "🔑")
                        Divider(color = Color(0xFF1E1E3A))
                        ProfileItem("Role", "STUDENT", "👤")
                    }
                }

                Spacer(Modifier.height(24.dp))

                Button(
                    onClick = {
                        scope.launch {
                            repo.logout()
                            navController.navigate(Screen.Login.route) { popUpTo(Screen.Home.route) { inclusive = true } }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0x1FEF4444)),
                ) {
                    Text("Sign Out", color = Color(0xFFEF4444), fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Composable
fun ProfileItem(label: String, value: String, icon: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(icon, fontSize = 18.sp)
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(label, fontSize = 11.sp, color = TextMuted)
            Text(value, fontSize = 14.sp, color = TextPrimary, fontWeight = FontWeight.Medium)
        }
    }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

@Composable
fun SettingsScreen(navController: NavHostController) {
    var accessibleRoutes by remember { mutableStateOf(false) }
    var notifications by remember { mutableStateOf(true) }

    Box(Modifier.fillMaxSize().background(BackgroundDark)) {
        Column(Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Default.ArrowBack, null, tint = TextSecondary)
                }
                Text("Settings", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
            }

            Column(Modifier.padding(horizontal = 20.dp)) {
                Surface(color = CardDark, shape = RoundedCornerShape(16.dp)) {
                    Column {
                        SwitchItem("Accessible Routes", "Prefer wheelchair-friendly paths", accessibleRoutes) { accessibleRoutes = it }
                        Divider(color = Color(0xFF1E1E3A))
                        SwitchItem("Notifications", "Get navigation updates", notifications) { notifications = it }
                    }
                }

                Spacer(Modifier.height(16.dp))
                Surface(color = CardDark, shape = RoundedCornerShape(16.dp)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("About", fontWeight = FontWeight.SemiBold, color = TextPrimary)
                        Spacer(Modifier.height(8.dp))
                        Text("YIT IndoorNav v1.0.0", color = TextSecondary, fontSize = 13.sp)
                        Text("Yenepoya Institute of Technology", color = TextMuted, fontSize = 12.sp)
                        Text("Moodbidri, Karnataka, India", color = TextMuted, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun SwitchItem(title: String, subtitle: String, checked: Boolean, onCheck: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, fontSize = 14.sp, color = TextPrimary, fontWeight = FontWeight.Medium)
            Text(subtitle, fontSize = 12.sp, color = TextMuted)
        }
        Switch(checked = checked, onCheckedChange = onCheck,
               colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = IndigoPrimary))
    }
}
