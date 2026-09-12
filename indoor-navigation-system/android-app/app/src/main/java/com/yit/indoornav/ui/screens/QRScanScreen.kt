package com.yit.indoornav.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.FlashOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.navigation.NavHostController
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import com.yit.indoornav.data.model.QRCheckpoint
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.ui.navigation.Screen
import com.yit.indoornav.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun QRScanScreen(navController: NavHostController, repo: NavigationRepository) {
    val context         = LocalContext.current
    val lifecycleOwner  = LocalLifecycleOwner.current
    val scope           = rememberCoroutineScope()

    var hasPermission   by remember { mutableStateOf(false) }
    var scanned         by remember { mutableStateOf(false) }
    var checkpoint      by remember { mutableStateOf<QRCheckpoint?>(null) }
    var error           by remember { mutableStateOf("") }
    var loading         by remember { mutableStateOf(false) }
    var torchEnabled    by remember { mutableStateOf(false) }
    var camera: Camera? by remember { mutableStateOf(null) }

    // Permission launcher
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        hasPermission = granted
    }

    LaunchedEffect(Unit) {
        hasPermission = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) ==
                android.content.pm.PackageManager.PERMISSION_GRANTED
        if (!hasPermission) launcher.launch(Manifest.permission.CAMERA)
    }

    fun onQRScanned(rawValue: String) {
        if (scanned || loading) return
        scanned = true
        loading = true
        error = ""

        // Parse yit-nav://checkpoint/{id} or just {id}
        val checkpointId = when {
            rawValue.startsWith("yit-nav://checkpoint/") ->
                rawValue.removePrefix("yit-nav://checkpoint/")
            rawValue.startsWith("qr-") -> rawValue
            else -> rawValue.trim()
        }

        scope.launch {
            repo.getQRCheckpoint(checkpointId)
                .onSuccess { cp ->
                    checkpoint = cp
                    loading = false
                }
                .onFailure { e ->
                    error = "QR not recognized: ${e.message}"
                    loading = false
                    scanned = false
                }
        }
    }

    Box(Modifier.fillMaxSize().background(Color.Black)) {
        if (!hasPermission) {
            // Permission denied state
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
                    Text("📷", fontSize = 56.sp)
                    Spacer(Modifier.height(16.dp))
                    Text("Camera Permission Required", fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 18.sp)
                    Spacer(Modifier.height(8.dp))
                    Text("Allow camera access to scan QR checkpoints for indoor positioning.", color = TextSecondary, fontSize = 13.sp)
                    Spacer(Modifier.height(20.dp))
                    Button(onClick = { launcher.launch(Manifest.permission.CAMERA) },
                           colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)) {
                        Text("Grant Permission")
                    }
                }
            }
        } else if (checkpoint != null) {
            // ── QR Resolved State ──────────────────────────────────────
            val cp = checkpoint!!
            Box(Modifier.fillMaxSize().background(BackgroundDark), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                    Text("✅", fontSize = 56.sp)
                    Spacer(Modifier.height(16.dp))
                    Text("Location Set!", fontWeight = FontWeight.Bold, color = EmeraldGreen, fontSize = 24.sp)
                    Spacer(Modifier.height(8.dp))
                    Text(cp.label, color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Medium)
                    Spacer(Modifier.height(4.dp))
                    Text("Node ID: ${cp.nodeId}", color = TextMuted, fontSize = 12.sp)

                    Spacer(Modifier.height(28.dp))
                    Surface(color = Color(0x1F10B981), shape = RoundedCornerShape(12.dp)) {
                        Text("Your current location has been set to this QR checkpoint. Now select a destination to navigate.",
                             color = EmeraldGreen, fontSize = 13.sp, modifier = Modifier.padding(16.dp))
                    }

                    Spacer(Modifier.height(24.dp))
                    Button(
                        onClick = { navController.navigate(Screen.Search.route) },
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    ) { Text("Choose Destination →", fontWeight = FontWeight.Bold, color = Color.White) }

                    Spacer(Modifier.height(10.dp))
                    TextButton(onClick = {
                        checkpoint = null; scanned = false
                    }) { Text("Scan Another QR", color = TextSecondary) }
                }
            }
        } else {
            // ── Camera Scanner ─────────────────────────────────────────
            AndroidView(
                factory = { ctx ->
                    val previewView = PreviewView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT,
                        )
                    }

                    val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also {
                            it.surfaceProvider = previewView.surfaceProvider
                        }

                        val barcodeScanner = BarcodeScanning.getClient()
                        val analysis = ImageAnalysis.Builder()
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST).build()

                        @SuppressLint("UnsafeOptInUsageError")
                        analysis.setAnalyzer(ContextCompat.getMainExecutor(ctx)) { imageProxy ->
                            val media = imageProxy.image ?: run { imageProxy.close(); return@setAnalyzer }
                            val image = InputImage.fromMediaImage(media, imageProxy.imageInfo.rotationDegrees)
                            barcodeScanner.process(image)
                                .addOnSuccessListener { barcodes ->
                                    for (barcode in barcodes) {
                                        if (barcode.format == Barcode.FORMAT_QR_CODE) {
                                            barcode.rawValue?.let { onQRScanned(it) }
                                        }
                                    }
                                }
                                .addOnCompleteListener { imageProxy.close() }
                        }

                        try {
                            cameraProvider.unbindAll()
                            camera = cameraProvider.bindToLifecycle(lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA, preview, analysis)
                        } catch (e: Exception) {
                            Log.e("QRScan", "Camera bind failed", e)
                        }
                    }, ContextCompat.getMainExecutor(ctx))
                    previewView
                },
                modifier = Modifier.fillMaxSize(),
            )

            // ── Scanner Overlay ────────────────────────────────────────
            Column(Modifier.fillMaxSize()) {
                // Top bar
                Surface(color = Color(0xCC000000)) {
                    Row(
                        Modifier.fillMaxWidth().padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        IconButton(onClick = { navController.popBackStack() }) {
                            Icon(Icons.Default.ArrowBack, null, tint = Color.White)
                        }
                        Text("Scan QR Checkpoint", color = Color.White, fontWeight = FontWeight.SemiBold,
                             modifier = Modifier.weight(1f))
                        IconButton(onClick = {
                            torchEnabled = !torchEnabled
                            camera?.cameraControl?.enableTorch(torchEnabled)
                        }) {
                            Icon(if (torchEnabled) Icons.Default.FlashOff else Icons.Default.FlashOn, null, tint = Color.White)
                        }
                    }
                }

                Spacer(Modifier.weight(1f))

                // ── QR Frame cutout guide ──────────────────────────────
                Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Box(
                        Modifier.size(240.dp).background(Color.Transparent)
                    ) {
                        // Corner brackets
                        val cornerSize = 32.dp; val strokeW = 4.dp
                        val cornerColor = IndigoPrimary
                        // Top-left
                        Divider(Modifier.width(cornerSize).align(Alignment.TopStart).offset(y=0.dp), thickness = strokeW, color = cornerColor)
                        Divider(Modifier.height(cornerSize).width(strokeW).align(Alignment.TopStart), thickness = strokeW, color = cornerColor)
                        // Top-right
                        Divider(Modifier.width(cornerSize).align(Alignment.TopEnd).offset(y=0.dp), thickness = strokeW, color = cornerColor)
                        // Bottom-left
                        Divider(Modifier.width(cornerSize).align(Alignment.BottomStart), thickness = strokeW, color = cornerColor)
                        // Bottom-right
                        Divider(Modifier.width(cornerSize).align(Alignment.BottomEnd), thickness = strokeW, color = cornerColor)
                    }
                }

                Spacer(Modifier.weight(1f))

                // Bottom hint
                Surface(color = Color(0xCC000000)) {
                    Column(
                        Modifier.fillMaxWidth().padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        if (loading) {
                            CircularProgressIndicator(color = IndigoPrimary, modifier = Modifier.size(24.dp))
                            Spacer(Modifier.height(8.dp))
                            Text("Verifying QR code…", color = Color.White, fontSize = 14.sp)
                        } else if (error.isNotEmpty()) {
                            Text("❌ $error", color = Color(0xFFEF4444), fontSize = 13.sp)
                        } else {
                            Text("Point your camera at a QR checkpoint label.", color = Color.White, fontSize = 14.sp)
                            Text("QR codes are placed near doors, stairs, and entrances.", color = Color(0x99FFFFFF), fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
