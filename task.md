# Lista de Tareas: AniRD Android & TV (Zero-Downtime)

- [/] **FASE A: WebView Core**
  - [x] Configuración óptima del WebView en `MainActivity.kt` (DOM storage, autoplay, hardware acceleration)
  - [x] Habilitar `hardwareAccelerated="true"` en `AndroidManifest.xml`
  - [x] Crear `network_security_config.xml` para HTTP de Tailscale
  - [x] Implementar `WebChromeClient` personalizado para fullscreen nativo y permisos de cámara/audio
  - [x] Implementar `WebViewClient` robusto para interceptar enlaces externos y offline error view
  - [x] WebView Remote Debugging en builds debug
  - [ ] Probar compilación inicial de la Fase A (En progreso)

- [ ] **FASE 8: Corrección Profunda de Reproducción de Videos (TV)**
  - [x] Habilitar cookies de terceros en `TvPlayerActivity`
  - [x] Optimizar `shouldOverrideUrlLoading` para permitir subframes incondicionalmente
  - [x] Manejar de forma robusta el fullscreen nativo (`onShowCustomView` y `onHideCustomView`) en `TvPlayerActivity`
  - [x] Manejar errores SSL en `WebViewClient`
  - [x] Actualizar el HTML del iframe para añadir permisos `allow="autoplay; encrypted-media; picture-in-picture"` y corregir el protocolo relativo (`//` -> `https:`)
  - [x] Habilitar hardware accelerated en `TvPlayerActivity` en `tv/AndroidManifest.xml`
  - [ ] Compilar y validar APKs (`assembleTvDebug`, `assembleDevDebug`)
  - [ ] Subir cambios a GitHub (rama `master`)

- [ ] **FASE B: Características Nativas Móviles**
  - [x] Agregar dependencia `androidx.media:media`
  - [x] Configurar Picture-in-Picture (PiP) en `AndroidManifest.xml` y `MainActivity.kt`
  - [x] Crear bridge de JS para PiP en el frontend Vite
  - [x] Implementar `MediaSessionCompat` para notificaciones y lock screen
  - [x] Crear App Shortcuts en `res/xml/shortcuts.xml` y en `AndroidManifest.xml`
  - [x] Manejar deep links en `MainActivity.kt`
  - [x] Crear Adaptive Icon (`ic_launcher.xml` y color background)
  - [x] Implementar Edge-to-Edge display con insets dinámicos
  - [ ] Probar compilación y verificar las características nativas móviles

- [ ] **FASE C: Soporte de Android TV**
  - [x] Agregar `LEANBACK_LAUNCHER` e intent-filter en `AndroidManifest.xml`
  - [x] Crear Banner de TV (640x360px `tv_banner.png`)
  - [x] Capturar HDMI CEC keys del control remoto en `onKeyDown()`
  - [x] Inyectar clase `.tv-mode` desde Kotlin y agregar Overscan-Safe Margins en el frontend CSS
  - [x] Añadir soporte y estilos de foco D-pad en `spatialNavigation.js` y `global.css`
  - [ ] Probar compilación de TV y navegación

- [ ] **FASE D: Builds y Release**
  - [x] Configurar build flavors (`dev`, `prod`, `tv`) en `app/build.gradle.kts`
  - [x] Usar variables dinámicas de `BuildConfig` en Kotlin
  - [x] Crear `.github/workflows/android-release.yml` para CI
  - [x] Configurar reglas de ProGuard/R8 para el bridge JS y Media Session
  - [ ] Probar compilación de sabores (flavors)

- [ ] **FASE E: UX y Seguridad de Vanguardia**
  - [x] Agregar dependencias `androidx.core:core-splashscreen` y `androidx.biometric:biometric`
  - [x] Crear tema de Splash Screen en `res/values/themes.xml` y aplicarlo
  - [x] Implementar `installSplashScreen()` en `MainActivity.kt`
  - [x] Configurar canales dedicados de notificaciones
  - [x] Implementar Autenticación Biométrica y `EncryptedSharedPreferences`
  - [ ] Compilación final y verificación general de todas las fases
