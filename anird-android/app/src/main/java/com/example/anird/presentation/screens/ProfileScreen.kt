package com.example.anird.presentation.screens
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Icon
import androidx.compose.runtime.collectAsState
import androidx.compose.material.icons.filled.*

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.anird.presentation.viewmodels.AuthUiState
import com.example.anird.presentation.viewmodels.AuthViewModel
import com.example.anird.theme.AniRDAccent
import com.example.anird.theme.AniRDBackground
import com.example.anird.theme.AniRDBorder
import com.example.anird.theme.AniRDError
import com.example.anird.theme.AniRDPrimary
import com.example.anird.theme.AniRDPrimaryDim
import com.example.anird.theme.AniRDSurface
import com.example.anird.theme.AniRDSurfaceBright
import com.example.anird.theme.AniRDSurfaceVariant
import com.example.anird.theme.AniRDTextPrimary
import com.example.anird.theme.AniRDTextSecondary
import com.example.anird.theme.AniRDTextTertiary

private val BG = AniRDBackground
private val Surface = AniRDSurface
private val SurfaceVariant = AniRDSurfaceVariant
private val SurfaceBright = AniRDSurfaceBright
private val Primary = AniRDPrimary
private val PrimaryDim = AniRDPrimaryDim
private val Accent = AniRDAccent
private val TextPrimary = AniRDTextPrimary
private val TextSecondary = AniRDTextSecondary
private val TextTertiary = AniRDTextTertiary
private val Border = AniRDBorder

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: AuthViewModel = hiltViewModel()
) {
    val isLoggedIn by viewModel.isLoggedIn.collectAsState()
    val username by viewModel.username.collectAsState()
    val uiState by viewModel.uiState.collectAsState()
    val syncing by viewModel.syncing.collectAsState()

    val serverIp by viewModel.serverIp.collectAsState()
    val serverPort by viewModel.serverPort.collectAsState()
    var showServerConfigDialog by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BG)
            .statusBarsPadding()
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "Mi Perfil",
            color = TextPrimary,
            fontSize = 22.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(start = 20.dp, top = 16.dp, bottom = 16.dp)
        )

        if (!isLoggedIn) {
            LoginCard(
                uiState = uiState,
                onLoginClick = { user, pass -> viewModel.login(user, pass) },
                onRegisterClick = { user, pass -> viewModel.register(user, pass) },
                onConfigureServerClick = { showServerConfigDialog = true }
            )
        } else {
            ProfileDetails(
                username = username ?: "Usuario",
                syncing = syncing,
                onSyncClick = { viewModel.syncLibrary() },
                onLogoutClick = { viewModel.logout() },
                onConfigureServerClick = { showServerConfigDialog = true }
            )
        }
    }

    if (showServerConfigDialog) {
        var ipInput by remember { mutableStateOf(serverIp) }
        var portInput by remember { mutableStateOf(serverPort) }

        ModalBottomSheet(
            onDismissRequest = { showServerConfigDialog = false },
            sheetState = sheetState,
            containerColor = SurfaceVariant,
            dragHandle = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp, bottom = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .width(36.dp)
                            .height(4.dp)
                            .background(TextTertiary.copy(alpha = 0.4f), RoundedCornerShape(2.dp))
                    )
                }
            },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 8.dp)
                    .padding(bottom = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Configurar Servidor",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "Configura la IP y puerto del servidor backend de AniRD para conectar la aplicación móvil.",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "IP del Servidor",
                        color = TextTertiary,
                        fontSize = 11.sp
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .background(Surface, RoundedCornerShape(12.dp))
                            .border(1.dp, Border, RoundedCornerShape(12.dp))
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        androidx.compose.foundation.text.BasicTextField(
                            value = ipInput,
                            onValueChange = { ipInput = it },
                            textStyle = androidx.compose.ui.text.TextStyle(
                                color = TextPrimary,
                                fontSize = 14.sp
                            ),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(
                                keyboardType = KeyboardType.Uri,
                                imeAction = ImeAction.Next
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "Puerto",
                        color = TextTertiary,
                        fontSize = 11.sp
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .background(Surface, RoundedCornerShape(12.dp))
                            .border(1.dp, Border, RoundedCornerShape(12.dp))
                            .padding(horizontal = 16.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        androidx.compose.foundation.text.BasicTextField(
                            value = portInput,
                            onValueChange = { portInput = it },
                            textStyle = androidx.compose.ui.text.TextStyle(
                                color = TextPrimary,
                                fontSize = 14.sp
                            ),
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(
                                keyboardType = KeyboardType.Number,
                                imeAction = ImeAction.Done
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .background(Primary, RoundedCornerShape(14.dp))
                        .clickable {
                            viewModel.updateServerConfig(ipInput, portInput)
                            showServerConfigDialog = false
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Guardar",
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showServerConfigDialog = false }
                        .padding(vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Cancelar",
                        color = TextSecondary,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
fun LoginCard(
    uiState: AuthUiState,
    onLoginClick: (String, String) -> Unit,
    onRegisterClick: (String, String) -> Unit,
    onConfigureServerClick: () -> Unit
) {
    var isRegisterMode by remember { mutableStateOf(false) }
    var usernameText by remember { mutableStateOf("") }
    var passwordText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .background(SurfaceVariant, RoundedCornerShape(20.dp))
            .border(1.dp, Border, RoundedCornerShape(20.dp))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Logo text
        Text(
            text = "AniRD",
            color = Primary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Black
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "Inicia sesión para sincronizar",
            color = TextSecondary,
            fontSize = 13.sp
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Username field
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = "Usuario",
                color = TextTertiary,
                fontSize = 11.sp
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(SurfaceVariant, RoundedCornerShape(12.dp))
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    androidx.compose.foundation.text.BasicTextField(
                        value = usernameText,
                        onValueChange = { usernameText = it },
                        textStyle = androidx.compose.ui.text.TextStyle(
                            color = TextPrimary,
                            fontSize = 15.sp
                        ),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Password field
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = "Contraseña",
                color = TextTertiary,
                fontSize = 11.sp
            )
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .background(SurfaceVariant, RoundedCornerShape(12.dp))
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    androidx.compose.foundation.text.BasicTextField(
                        value = passwordText,
                        onValueChange = { passwordText = it },
                        textStyle = androidx.compose.ui.text.TextStyle(
                            color = TextPrimary,
                            fontSize = 15.sp
                        ),
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Error message with fade animation
        AnimatedVisibility(
            visible = uiState is AuthUiState.Error,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            if (uiState is AuthUiState.Error) {
                Text(
                    text = uiState.message,
                    color = AniRDError,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
            }
        }

        // Loading spinner inline
        if (uiState is AuthUiState.Loading) {
            androidx.compose.material3.CircularProgressIndicator(
                color = Primary,
                strokeWidth = 2.dp,
                modifier = Modifier
                    .size(20.dp)
                    .padding(bottom = 4.dp)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Login / Register button
        val isLoading = uiState is AuthUiState.Loading
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(
                    if (isLoading) PrimaryDim else Primary,
                    RoundedCornerShape(14.dp)
                )
                .then(
                    if (!isLoading) {
                        Modifier.clickable {
                            if (isRegisterMode) {
                                onRegisterClick(usernameText, passwordText)
                            } else {
                                onLoginClick(usernameText, passwordText)
                            }
                        }
                    } else {
                        Modifier
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (isRegisterMode) "REGISTRARSE" else "INICIAR SESIÓN",
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Toggle login/register
        Text(
            text = if (isRegisterMode) "¿Ya tienes cuenta? Inicia sesión" else "¿No tienes cuenta? Regístrate",
            color = TextSecondary,
            fontSize = 12.sp,
            modifier = Modifier
                .clickable { isRegisterMode = !isRegisterMode }
                .padding(4.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Server config link
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .clickable { onConfigureServerClick() }
                .padding(4.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Settings,
                contentDescription = null,
                tint = Primary,
                modifier = Modifier.size(14.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Configurar Servidor",
                color = Primary,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
fun ProfileDetails(
    username: String,
    syncing: Boolean,
    onSyncClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onConfigureServerClick: () -> Unit
) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("anird_prefs", android.content.Context.MODE_PRIVATE) }
    var notifsEnabled by remember { mutableStateOf(prefs.getBoolean("new_episodes_notif_enabled", true)) }

    // Stats from SharedPreferences (hardcoded defaults for now)
    val followingCount = remember { prefs.getInt("stat_following", 12) }
    val favoritesCount = remember { prefs.getInt("stat_favorites", 5) }
    val watchedCount = remember { prefs.getInt("stat_watched", 28) }
    val lastSyncTime = remember { prefs.getString("last_sync_time", "") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // ── Profile Header ──
        Box(
            modifier = Modifier
                .padding(top = 8.dp)
                .size(88.dp)
                .clip(CircleShape)
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(Primary, PrimaryDim)
                    ),
                    shape = CircleShape
                )
                .border(
                    width = 1.dp,
                    color = Color.White.copy(alpha = 0.1f),
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = username.take(1).uppercase(),
                color = Color.White,
                fontSize = 36.sp,
                fontWeight = FontWeight.Black
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        Text(
            text = username,
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = "Miembro de AniRD",
            color = TextTertiary,
            fontSize = 12.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        // ── Stats Row ──
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            StatCard(
                modifier = Modifier.weight(1f),
                count = followingCount,
                label = "Siguiendo"
            )
            StatCard(
                modifier = Modifier.weight(1f),
                count = favoritesCount,
                label = "Favoritos"
            )
            StatCard(
                modifier = Modifier.weight(1f),
                count = watchedCount,
                label = "Vistos"
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ── Cloud Sync Card ──
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceVariant, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Cloud,
                    contentDescription = null,
                    tint = TextSecondary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Sincronización en la nube",
                    color = TextPrimary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Respalda tus animes seguidos, favoritos e historial en tu cuenta para acceder en cualquier dispositivo.",
                color = TextSecondary,
                fontSize = 12.sp,
                lineHeight = 18.sp,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(14.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .background(
                        if (syncing) SurfaceBright else Accent,
                        RoundedCornerShape(14.dp)
                    )
                    .then(
                        if (!syncing) {
                            Modifier.clickable { onSyncClick() }
                        } else {
                            Modifier
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (syncing) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        androidx.compose.material3.CircularProgressIndicator(
                            color = Accent,
                            strokeWidth = 2.dp,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Sincronizando...",
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                } else {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Sincronizar ahora",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            if (!lastSyncTime.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Última sincronización: $lastSyncTime",
                    color = TextTertiary,
                    fontSize = 10.sp,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ── Settings Section ──
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceVariant, RoundedCornerShape(16.dp))
        ) {
            SettingsToggleItem(
                icon = Icons.Default.Notifications,
                title = "Notificaciones de nuevos episodios",
                checked = notifsEnabled,
                onCheckedChange = { checked ->
                    notifsEnabled = checked
                    prefs.edit().putBoolean("new_episodes_notif_enabled", checked).apply()
                }
            )

            HorizontalDivider(
                thickness = 1.dp,
                color = Border,
                modifier = Modifier.padding(start = 52.dp)
            )

            SettingsItem(
                icon = Icons.Default.Lock,
                title = "Seguridad de cuenta"
            )

            HorizontalDivider(
                thickness = 1.dp,
                color = Border,
                modifier = Modifier.padding(start = 52.dp)
            )

            SettingsItem(
                icon = Icons.Default.Star,
                title = "Calificar AniRD"
            )

            HorizontalDivider(
                thickness = 1.dp,
                color = Border,
                modifier = Modifier.padding(start = 52.dp)
            )

            SettingsItem(
                icon = Icons.Default.Settings,
                title = "Servidor Backend",
                onClick = onConfigureServerClick
            )

            HorizontalDivider(
                thickness = 1.dp,
                color = Border,
                modifier = Modifier.padding(start = 52.dp)
            )

            SettingsItem(
                icon = Icons.Default.Info,
                title = "Acerca de la aplicación"
            )
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ── Logout Button ──
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(SurfaceVariant, RoundedCornerShape(14.dp))
                .border(1.dp, AniRDError, RoundedCornerShape(14.dp))
                .clickable { onLogoutClick() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "CERRAR SESIÓN",
                color = AniRDError,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // ── Delete Account ──
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { /* Demo eliminar cuenta */ }
                .padding(vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Eliminar cuenta",
                color = AniRDError,
                fontSize = 13.sp
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    count: Int,
    label: String
) {
    Column(
        modifier = modifier
            .background(SurfaceVariant, RoundedCornerShape(12.dp))
            .padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = count.toString(),
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            color = TextTertiary,
            fontSize = 11.sp
        )
    }
}

@Composable
fun SettingsItem(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit = {}
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                if (isPressed) SurfaceBright else Color.Transparent
            )
            .clickable(interactionSource = interactionSource, indication = null) { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            contentDescription = title,
            tint = TextSecondary,
            modifier = Modifier.size(22.dp)
        )

        Spacer(modifier = Modifier.width(14.dp))

        Text(
            text = title,
            color = TextPrimary,
            fontSize = 14.sp,
            modifier = Modifier.weight(1f)
        )

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = TextTertiary,
            modifier = Modifier.size(18.dp)
        )
    }
}

@Composable
fun SettingsToggleItem(
    icon: ImageVector,
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                if (isPressed) SurfaceBright else Color.Transparent
            )
            .clickable(interactionSource = interactionSource, indication = null) {
                onCheckedChange(!checked)
            }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            icon,
            contentDescription = title,
            tint = TextSecondary,
            modifier = Modifier.size(22.dp)
        )

        Spacer(modifier = Modifier.width(14.dp))

        Text(
            text = title,
            color = TextPrimary,
            fontSize = 14.sp,
            modifier = Modifier.weight(1f)
        )

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedTrackColor = Primary,
                uncheckedTrackColor = SurfaceBright,
                checkedThumbColor = Color.White,
                uncheckedThumbColor = TextTertiary
            )
        )
    }
}
