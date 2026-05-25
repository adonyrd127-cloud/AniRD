# AniRD Android

App nativa Android para la plataforma AniRD.

## Requisitos
- Android Studio Hedgehog o superior
- Android SDK 26+
- Kotlin 1.9+

## Configuración
1. Abre el proyecto en Android Studio.
2. Crea `anird-android/local.properties` y define la URL de tu API:
   ```properties
   API_BASE_URL=http://TU_IP_TAILSCALE:3005
   ```
3. Build > Make Project

## Releases
Los APKs firmados se publican en las [GitHub Releases](../../releases).
No descargues el APK de la rama — puede estar desactualizado.
