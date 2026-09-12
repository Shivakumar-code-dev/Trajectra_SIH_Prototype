package com.yit.indoornav.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.yit.indoornav.data.repository.NavigationRepository
import com.yit.indoornav.ui.navigation.Screen
import com.yit.indoornav.ui.theme.*
import kotlinx.coroutines.launch

// ─── Shared Auth UI Helpers ───────────────────────────────────────────────────

@Composable
fun AuthCard(content: @Composable ColumnScope.() -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BackgroundDark, Color(0xFF1A1A3A)))),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // Brand
            Box(
                modifier = Modifier
                    .size(70.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(Brush.linearGradient(listOf(IndigoPrimary, IndigoVariant))),
                contentAlignment = Alignment.Center,
            ) { Text("🧭", fontSize = 36.sp) }

            Spacer(Modifier.height(16.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                color = CardDark,
                tonalElevation = 4.dp,
            ) {
                Column(Modifier.padding(24.dp), content = content)
            }
        }
    }
}

@Composable
fun YITTextField(label: String, value: String, onValueChange: (String) -> Unit,
                  isPassword: Boolean = false, leadingIcon: @Composable (() -> Unit)? = null) {
    var showPassword by remember { mutableStateOf(false) }
    OutlinedTextField(
        value = value, onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = IndigoPrimary,
            unfocusedBorderColor = Color(0xFF2A2A48),
            focusedLabelColor = IndigoPrimary,
            cursorColor = IndigoPrimary,
            focusedContainerColor = Color(0xFF1E1E35),
            unfocusedContainerColor = Color(0xFF1E1E35),
        ),
        visualTransformation = if (isPassword && !showPassword) PasswordVisualTransformation() else VisualTransformation.None,
        leadingIcon = leadingIcon,
        trailingIcon = if (isPassword) {{
            IconButton(onClick = { showPassword = !showPassword }) {
                Icon(if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility, null,
                     tint = TextMuted)
            }
        }} else null,
        singleLine = true,
    )
}

@Composable
fun GradientButton(text: String, onClick: () -> Unit, loading: Boolean = false, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick, enabled = !loading,
        modifier = modifier.height(52.dp),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
        contentPadding = PaddingValues(0.dp),
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.horizontalGradient(listOf(IndigoPrimary, IndigoVariant))),
            contentAlignment = Alignment.Center,
        ) {
            if (loading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp), strokeWidth = 2.dp)
            else Text(text, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
        }
    }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

@Composable
fun LoginScreen(navController: NavHostController, repo: NavigationRepository) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    AuthCard {
        Text("Welcome Back", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Sign in to navigate YIT campus", fontSize = 13.sp, color = TextSecondary, modifier = Modifier.padding(top=4.dp, bottom=20.dp))

        if (error.isNotEmpty()) {
            Surface(color = Color(0x1FEF4444), shape = RoundedCornerShape(10.dp)) {
                Text("⚠ $error", color = Color(0xFFEF4444), fontSize = 13.sp, modifier = Modifier.padding(10.dp))
            }
            Spacer(Modifier.height(12.dp))
        }

        YITTextField("Email", email, { email = it; error="" },
            leadingIcon = { Icon(Icons.Default.Email, null, tint=TextMuted) })
        Spacer(Modifier.height(12.dp))
        YITTextField("Password", password, { password = it; error="" }, isPassword=true,
            leadingIcon = { Icon(Icons.Default.Lock, null, tint=TextMuted) })

        Row(Modifier.fillMaxWidth().padding(top=4.dp), horizontalArrangement = Arrangement.End) {
            TextButton(onClick = { navController.navigate(Screen.ForgotPass.route) }) {
                Text("Forgot password?", color = CyanAccent, fontSize = 13.sp)
            }
        }

        Spacer(Modifier.height(8.dp))

        GradientButton("Sign In", modifier = Modifier.fillMaxWidth(), loading = loading) {
            if (email.isBlank() || password.isBlank()) { error = "Please fill all fields."; return@GradientButton }
            scope.launch {
                loading = true
                val result = repo.loginUser(email.trim(), password)
                loading = false
                result.onSuccess {
                    navController.navigate(Screen.Home.route) { popUpTo(Screen.Login.route) { inclusive=true } }
                }.onFailure { e ->
                    error = when {
                        e.message?.contains("password") == true -> "Incorrect password."
                        e.message?.contains("user") == true    -> "No account found with this email."
                        else -> "Login failed. Check credentials."
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
            Text("Don't have an account?", color = TextSecondary, fontSize = 13.sp)
            TextButton(onClick = { navController.navigate(Screen.Register.route) }) {
                Text("Register", color = IndigoPrimary, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────

@Composable
fun RegisterScreen(navController: NavHostController, repo: NavigationRepository) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPass by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    AuthCard {
        Text("Create Account", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Join YIT Indoor Navigation", fontSize = 13.sp, color = TextSecondary, modifier = Modifier.padding(top=4.dp, bottom=20.dp))

        if (error.isNotEmpty()) {
            Surface(color = Color(0x1FEF4444), shape = RoundedCornerShape(10.dp)) {
                Text("⚠ $error", color = Color(0xFFEF4444), fontSize = 13.sp, modifier = Modifier.padding(10.dp))
            }
            Spacer(Modifier.height(12.dp))
        }

        YITTextField("Full Name", name, { name = it; error="" },
            leadingIcon = { Icon(Icons.Default.Person, null, tint=TextMuted) })
        Spacer(Modifier.height(12.dp))
        YITTextField("Email", email, { email = it; error="" },
            leadingIcon = { Icon(Icons.Default.Email, null, tint=TextMuted) })
        Spacer(Modifier.height(12.dp))
        YITTextField("Password", password, { password = it; error="" }, isPassword=true,
            leadingIcon = { Icon(Icons.Default.Lock, null, tint=TextMuted) })
        Spacer(Modifier.height(12.dp))
        YITTextField("Confirm Password", confirmPass, { confirmPass = it; error="" }, isPassword=true,
            leadingIcon = { Icon(Icons.Default.Lock, null, tint=TextMuted) })

        Spacer(Modifier.height(20.dp))

        GradientButton("Create Account", modifier = Modifier.fillMaxWidth(), loading = loading) {
            when {
                name.isBlank() || email.isBlank() || password.isBlank() -> error = "All fields are required."
                password != confirmPass -> error = "Passwords do not match."
                password.length < 6    -> error = "Password must be at least 6 characters."
                else -> {
                    scope.launch {
                        loading = true
                        val result = repo.registerUser(name.trim(), email.trim(), password)
                        loading = false
                        result.onSuccess {
                            navController.navigate(Screen.Home.route) { popUpTo(Screen.Login.route) { inclusive=true } }
                        }.onFailure { e ->
                            error = if (e.message?.contains("email") == true) "Email already in use." else "Registration failed."
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(12.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
            Text("Already have an account?", color = TextSecondary, fontSize = 13.sp)
            TextButton(onClick = { navController.popBackStack() }) {
                Text("Sign In", color = IndigoPrimary, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

@Composable
fun ForgotPasswordScreen(navController: NavHostController, repo: NavigationRepository) {
    var email by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var sent by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    AuthCard {
        Text("Reset Password", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        Text("Enter your email to receive a reset link", fontSize = 13.sp, color = TextSecondary, modifier = Modifier.padding(top=4.dp, bottom=20.dp))

        if (sent) {
            Surface(color = Color(0x1F10B981), shape = RoundedCornerShape(10.dp)) {
                Text("✅ Reset email sent! Check your inbox.", color = EmeraldGreen, fontSize = 13.sp, modifier = Modifier.padding(12.dp))
            }
        } else {
            if (error.isNotEmpty()) {
                Surface(color = Color(0x1FEF4444), shape = RoundedCornerShape(10.dp)) {
                    Text("⚠ $error", color = Color(0xFFEF4444), fontSize = 13.sp, modifier = Modifier.padding(10.dp))
                }
                Spacer(Modifier.height(12.dp))
            }
            YITTextField("Email", email, { email = it; error="" },
                leadingIcon = { Icon(Icons.Default.Email, null, tint=TextMuted) })
            Spacer(Modifier.height(20.dp))
            GradientButton("Send Reset Link", modifier = Modifier.fillMaxWidth(), loading = loading) {
                if (email.isBlank()) { error = "Enter your email."; return@GradientButton }
                scope.launch {
                    loading = true
                    repo.resetPassword(email.trim()).onSuccess { sent = true }.onFailure { e -> error = e.message ?: "Failed." }
                    loading = false
                }
            }
        }

        Spacer(Modifier.height(12.dp))
        TextButton(onClick = { navController.popBackStack() }, modifier = Modifier.fillMaxWidth()) {
            Text("← Back to Login", color = TextSecondary)
        }
    }
}
