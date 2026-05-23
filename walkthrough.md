# Walkthrough: AniRD Native Android APK Wrapper (v4.0.0)

¡Hemos creado y compilado la versión móvil nativa y Smart TV de **AniRD** en un paquete APK ultra-ligero y optimizado (v4.0.0)! Esta versión se construyó siguiendo tus instrucciones detalladas de encapsular el servicio web alojado en tu servidor Orange Pi (`http://10.0.0.9:8090`) de forma fluida y nativa.

---

## 📱 Características Clave de la Versión v4.0.0 (APK)

1. **WebView de Alto Rendimiento con Jetpack Compose**:
   - Construido nativamente en **Kotlin** utilizando la pila moderna de Jetpack Compose (`AndroidView` y `WebView`).
   - Soporte total para ejecución de **JavaScript**, almacenamiento web persistente (`domStorageEnabled = true`), reproducción automática de contenido multimedia y políticas de contenido mixto (para soportar los reproductores/iframe externos).
2. **Soporte de Navegación Física (Botón "Atrás")**:
   - Integración nativa con `onBackPressedDispatcher` de Android 13+. Si estás navegando dentro de la app de anime, presionar el botón físico "Atrás" de tu móvil o control remoto te regresará a la página web anterior en lugar de cerrar la aplicación.
3. **Seguridad y Compatibilidad de Red (Cleartext Traffic)**:
   - Configurado `android:usesCleartextTraffic="true"` y permisos de `android.permission.INTERNET` en el manifiesto (`AndroidManifest.xml`). Esto permite conectarse a tu red local local HTTP (`http://10.0.0.9:8090`) en Android Pie (9.0) o superior, esquivando el bloqueo de conexiones no-HTTPS por defecto.
4. **Diseño de Icono Premium Adaptativo**:
   - **Fondo (`ic_launcher_background.xml`)**: Color azul marino premium (`#090A10`) con un resplandor circular rojo en el centro con opacidad del 8%.
   - **Primer Plano (`ic_launcher_foreground.xml`)**: Logotipo vectorizado premium en forma de nube con un degradado lineal blanco-rosa y un acento inferior fucsia.

---

## 📦 Detalles de la Entrega y Repositorio Git

- **Ubicación del APK**: El instalador final compilado y firmado de depuración se encuentra en la raíz del proyecto:
  👉 [AniRD_v4.0.0.apk](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/AniRD_v4.0.0.apk) (Tamaño: ~11.3 MB)
- **Código Fuente**: Todo el código fuente de Android se organizó de manera impecable y limpia en el directorio [anird-android/](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/anird-android/).
- **Sincronización en GitHub**: Se han agregado y confirmado todos los cambios de esta versión en tu repositorio principal de GitHub. El comando `git push` completó con éxito la subida de los cambios a la rama `master`.

---

## 🛠️ Cómo Instalar el APK en tus Dispositivos (Móvil, Tablet o Smart TV)

Dado que es un APK nativo (generado como build de depuración para evitar la necesidad de configurar almacenes de claves pesados o cuentas de desarrollador de Google Play), puedes instalarlo directamente siguiendo estos sencillos pasos:

### En tu Teléfono o Tablet Android:
1. Pasa el archivo `AniRD_v4.0.0.apk` a tu teléfono (puedes descargarlo desde el repositorio de GitHub directamente o transferirlo mediante USB/Google Drive/WhatsApp).
2. Abre el archivo en el explorador de archivos de tu Android.
3. Si el sistema te lo solicita, concede el permiso de **"Instalar aplicaciones de fuentes desconocidas"** a tu explorador de archivos o navegador.
4. Haz clic en **Instalar** y ¡listo! La aplicación aparecerá en tu cajón de apps con el icono premium de AniRD.

### En tu Smart TV / TV Box (Android TV, Fire TV, etc.):
1. Instala en tu Smart TV la aplicación **"Send Files to TV"** desde la Google Play Store (y la misma app en tu teléfono Android).
2. Transfiere el archivo `AniRD_v4.0.0.apk` desde tu teléfono a la Smart TV usando dicha aplicación.
3. Usa un explorador de archivos en tu Smart TV (como *File Commander* o *AnExplorer*) para abrir el archivo APK en la carpeta de descargas de la TV.
4. Concede los permisos pertinentes e instala la aplicación.
5. Abre la aplicación y navega de forma nativa e intuitiva con el control remoto D-Pad.
