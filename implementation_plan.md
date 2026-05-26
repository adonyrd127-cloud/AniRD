# Plan de Implementación: AniRD Android & TV (Zero-Downtime)

Este plan describe las mejoras de arquitectura, rendimiento y experiencia de usuario tanto en el contenedor nativo Kotlin (`anird-android/`) como en el frontend Vite (`frontend/`) para ofrecer soporte nativo completo para móviles y Android TV.

---

## 📌 Principio Rector: Zero-Downtime

Para asegurar que la aplicación siga funcionando en todo momento, seguiremos estas reglas estrictas:
- **No mezclar commits**: Los cambios de frontend (CSS/JS) y los nativos de Android (Kotlin/Gradle) se realizarán en ramas y commits separados.
- **Validación continua**: Cada cambio nativo irá acompañado de una compilación de prueba local exitosa antes de consolidarse.
- **Entorno de pruebas**: Los cambios de frontend se verificarán en el navegador y luego en la app.

---

## 🛠️ Cambios Propuestos

### FASE A: WebView Core (Estabilidad y Rendimiento)

Optimización de la configuración del WebView para habilitar aceleración por hardware, almacenamiento persistente, soporte multimedia seguro y depuración remota.

#### [MODIFY] [MainActivity.kt](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/java/com/example/anird/MainActivity.kt)
- Habilitar `domStorageEnabled`, `databaseEnabled`, y desactivar gestos requeridos para reproducir video (`mediaPlaybackRequiresUserGesture = false`).
- Configurar un `WebChromeClient` completo para soportar pantalla completa nativa (`onShowCustomView` / `onHideCustomView`) y autorizar permisos multimedia del sistema (`onPermissionRequest`).
- Crear un `WebViewClient` robusto para interceptar navegaciones a enlaces externos (abriéndolos en el navegador del sistema) y capturar errores de red (`onReceivedError`) inyectando una pantalla HTML de offline con botón "Reintentar".
- Habilitar WebView Remote Debugging condicionalizado a la compilación en modo `debug`.

#### [MODIFY] [AndroidManifest.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/AndroidManifest.xml)
- Configurar la actividad principal con aceleración de hardware habilitada: `android:hardwareAccelerated="true"`.
- Asociar la configuración de seguridad de red en el tag `<application>`.

#### [NEW] [network_security_config.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/res/xml/network_security_config.xml)
- Permitir tráfico de texto claro (cleartext HTTP) únicamente para las IPs locales de Tailscale de la Orange Pi (`100.101.132.92` y `100.110.101.28`). Todo lo demás forzado a HTTPS.

---

### FASE B: Características Nativas Móviles

Implementación de funciones modernas de Android para mejorar la integración con el sistema operativo móvil.

#### [MODIFY] [MainActivity.kt](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/java/com/example/anird/MainActivity.kt)
- **Picture-in-Picture (PiP)**: Detectar cuando el usuario sale de la app mediante `onUserLeaveHint()` y llamar a `enterPictureInPictureMode()` si hay reproducción activa consultando al bridge del frontend. Ocultar la interfaz principal en el callback `onPictureInPictureModeChanged()`.
- **Media Session**: Integrar `MediaSessionCompat` para registrar controles multimedia y soportar notificaciones en pantalla de bloqueo y dispositivos Bluetooth externos.
- **Shortcuts & Deep Links**: Resolver deep links entrantes (`anird://history`, `anird://favorites`, `anird://anime/{id}`) y navegar a la ruta correspondiente en el WebView.
- **Edge-to-Edge**: Extender el WebView por detrás de la barra de navegación y barra de estado de Android, y añadir padding seguro dinámicamente mediante `ViewCompat.setOnApplyWindowInsetsListener`.

#### [MODIFY] [AndroidManifest.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/AndroidManifest.xml)
- Declarar soporte para PiP (`android:supportsPictureInPicture="true"`) y registrar cambios de configuración soportados para evitar la destrucción de la actividad.
- Registrar el archivo de accesos directos dinámicos.

#### [NEW] [shortcuts.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/res/xml/shortcuts.xml)
- Definir accesos directos para "Historial (Continuar Viendo)" y "Favoritos" que apunten a los deep links de la app.

#### [NEW] [ic_launcher.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml)
- Crear el vector/definición adaptativo asociando el color de fondo `#0f0f0f` y el logo transparente en primer plano.

#### [MODIFY] [app/build.gradle.kts](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/build.gradle.kts)
- Añadir dependencias de media (`androidx.media:media`).

#### [MODIFY] Frontend JS/CSS ([main.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/main.js) y [global.css](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/styles/global.css))
- Registrar el bridge global `window.AniRDBridge` con métodos `isPlaying()`, `enterPip()`, `exitPip()`, `play()`, `pause()`, `nextEpisode()`, `prevEpisode()`, y reportar eventos nativos con `notifyPlayback()`.
- Añadir estilos CSS de `.pip-mode` para optimizar el renderizado del reproductor en la pequeña ventana flotante.

---

### FASE C: Compatibilidad Completa con Android TV

Mejorar la usabilidad de la app en televisores adaptando la interfaz táctil a navegación por D-pad y control de TV seguro.

#### [MODIFY] [AndroidManifest.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/AndroidManifest.xml)
- Añadir el intent filter `LEANBACK_LAUNCHER` para aparecer en el launcher de Android TV.
- Declarar características de hardware (`android.hardware.touchscreen` y `android.software.leanback`) con `required="false"`.
- Registrar el banner de televisión.

#### [NEW] [tv_banner.png](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/res/drawable-xhdpi/tv_banner.png)
- Crear/ubicar un banner descriptivo oscuro de 640x360px adaptado a las directrices de Android TV.

#### [MODIFY] [MainActivity.kt](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/java/com/example/anird/MainActivity.kt)
- **HDMI CEC**: Capturar en `onKeyDown()` teclas multimedia del control remoto (`KEYCODE_MEDIA_PLAY_PAUSE`, `KEYCODE_MEDIA_NEXT`, `KEYCODE_MEDIA_PREVIOUS`, `KEYCODE_MEDIA_FAST_FORWARD`, `KEYCODE_MEDIA_REWIND`) y delegar la acción al frontend.
- **Back Key TV**: Capturar el botón físico atrás para cerrar diálogos o modales del frontend mediante el bridge antes de salir de la aplicación.
- **TV Mode Class**: Inyectar dinámicamente la clase CSS `.tv-mode` al cargar la página si el sistema detecta soporte para televisión.

#### [MODIFY] [global.css](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/styles/global.css)
- Implementar **Overscan-Safe Margins** bajo `body.tv-mode` para evitar recortes de bordes en pantallas viejas.
- Crear bordes de foco y sombras consistentes para navegación D-pad.

#### [MODIFY] [spatialNavigation.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/services/spatialNavigation.js)
- Agregar nuevos elementos interactivos (carruseles, pills de servidores, selector de idiomas, botones de configuración y login) al registro de navegación por D-pad, asignándoles dinámicamente `tabindex="0"`.

---

### FASE D: Builds y Gestión de Versiones

Configuración robusta del sistema de compilación y empaquetado para mantener entornos independientes y compilaciones automáticas fiables.

#### [MODIFY] [app/build.gradle.kts](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/build.gradle.kts)
- Implementar sabores de compilación (Flavors): `dev`, `prod`, `tv`.
- Parametrizar dinámicamente la variable `API_BASE_URL` y la flag de depuración de WebView en `BuildConfig` en lugar de dejarlas en código duro.

#### [NEW] [android-release.yml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/.github/workflows/android-release.yml)
- Crear el flujo de trabajo de GitHub Actions para compilar y firmar el APK en releases de producción automáticamente.

#### [NEW] [proguard-rules.pro](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/proguard-rules.pro)
- Definir reglas para proteger el puente `@JavascriptInterface` y las dependencias de Media Session de la ofuscación de R8.

---

### FASE E: UX, Offline y Autenticación de Vanguardia

Integración de pantallas de carga nativas, canales de notificaciones dedicados y autenticación segura por biometría.

#### [MODIFY] [app/build.gradle.kts](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/build.gradle.kts) y [libs.versions.toml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/gradle/libs.versions.toml)
- Añadir la librería `androidx.core:core-splashscreen` y `androidx.biometric:biometric`.

#### [MODIFY] [res/values/themes.xml](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/res/values/themes.xml)
- Definir el estilo de la Splash Screen nativa `Theme.AniRD.Starting` heredando de `Theme.SplashScreen` y enlazándolo a `Theme.AniRD`.

#### [MODIFY] [MainActivity.kt](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/app/src/main/java/com/example/anird/MainActivity.kt)
- **Splash Screen**: Instalar mediante `installSplashScreen()` manteniendo el logo nativo activo en pantalla hasta que el WebView notifique que `onPageFinished()` ha concluido.
- **Canales de Notificación**: Crear canales dedicados para "Nuevos episodios" y "Sincronización".
- **Autenticación Biométrica**: Implementar solicitud biométrica utilizando `BiometricPrompt` y recuperar de forma ultra-segura el JWT desde `EncryptedSharedPreferences` para auto-iniciar sesión inyectándolo en el bridge del frontend.

---

## 🧪 Plan de Verificación

1. **Pruebas de compilación local**:
   - `gradlew assembleDevDebug` -> Compilación rápida para verificar lógica nativa de WebView y componentes principales.
   - `gradlew assembleProdDebug` -> Compilación para verificar integraciones completas en móvil.
   - `gradlew assembleTvDebug` -> Compilación específica para televisores.
2. **Pruebas en emulador/dispositivo**:
   - Verificar navegación general D-pad y overscan margins en modo TV.
   - Probar Picture-in-Picture saliendo al launcher de Android mientras un video se reproduce.
   - Validar controles de barra de notificaciones multimedia.
