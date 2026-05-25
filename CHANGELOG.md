# Changelog — AniRD

Todas las versiones notables se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [4.4.3] — 2026-05-25
### Added
- Integración de variables de entorno seguras con `.env.example` y soporte de Docker Compose para obligar la definición de variables críticas.
- Limitación de CORS y ocultamiento/encriptación en caliente de secretos de producción.
- Rate limiting con `express-rate-limit` en rutas de autenticación del backend (`/api/v1/auth`) para frustrar ataques de fuerza bruta.
- Health checks de Docker en el backend en base al endpoint `/health` y retardo dinámico de inicio en el frontend.
- Caché local en memoria con `node-cache` en el backend para optimizar peticiones externas (Jikan y AniList) y prevenir rate limits globales.
- Logging JSON estructurado ultrarrápido con `pino` y `pino-http` ideal para arquitecturas ARM (Orange Pi).
- Validación robusta de tipos y parámetros de entrada con esquemas declarativos en `zod`.
- Soporte PWA instalable de alto rendimiento en el frontend con service worker optimizado de caché selectivo (sin APIs).
- Carga perezosa (lazy loading) y descodificación asíncrona (`decoding="async"`) en imágenes dinámicas.

## [4.2.0] — 2026-05-10
### Fixed
- Solución definitiva a la desaparición del reproductor en pantalla completa móvil mediante disolución de contexto de apilamiento en CSS (`position: static !important` en padres).
- Anulación de relación de aspecto en fullscreen y tamaño adaptativo dinámico (`width: 100vw; height: 100vh`).

## [4.1.0] — 2026-05-02
### Fixed
- Solución de usabilidad para televisores inteligentes (Smart TV) con navegación D-pad.
- Scroll interno habilitado verticalmente (`overflow-y: auto !important`) en `#app` limitado a `100vh`.
- Eliminación del atributo restrictivo `sandbox` en el iframe del reproductor web para habilitar la carga en Smart TVs.

## [3.8.0] — 2026-04-20
### Added
- Rediseño premium de autenticación (Glassmorphism, foco interactivo, menú cápsula, animación shake ante errores).
- Sincronización bidireccional Two-Way Merge (IndexedDB ↔ backend) basada en marcas de tiempo (`updatedAt` / `addedAt`).
- Persistencia antirruptura mediante `fetch` con bandera `{ keepalive: true }`.
- Auto-recuperación de IndexedDB ante fallos críticos.

## [3.7.0] — 2026-04-05
### Added
- Marcado de episodios como vistos (estilo Netflix) con barra de progreso roja y badge traslúcido.
- Botones de marcado manual de episodio y de marcado/desmarcado por temporadas en bloque.

## [3.6.0] — 2026-03-15
### Added
- Modo Ambiente (Cinematic Glow) basado en la imagen del anime de fondo.
- Theater Mode (Modo Cine) e interruptor para apagar luces ("Dim Lights").
- Selectores de servidores en base a píldoras interactivas.

## [3.5.0] — 2026-02-10
### Added
- Menú de categorías premium y sistema de notificaciones de nuevos episodios.
- Contador regresivo exacto en tarjetas y secciones.
