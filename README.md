# AniRD - Anime Streaming Platform

AniRD es una plataforma moderna y minimalista para ver anime online, diseñada para ofrecer una experiencia premium con un enfoque en la legibilidad y la facilidad de uso.

## ✨ Características Principales

- **Diseño Premium (Big Revamp):** Interfaz oscura elegante con animaciones suaves y micro-interacciones.
- **Historial de Reproducción:** Página dedicada de historial para retomar tus series exactamente donde las dejaste.
- **Sistema de Favoritos:** Guarda tus animes preferidos para acceder a ellos rápidamente.
- **Integración con AniList:** Metadatos enriquecidos que incluyen puntuaciones, géneros, años de lanzamiento y estados de emisión.
- **Navegación Móvil:** Menú inferior optimizado para dispositivos móviles.
- **Buscador Inteligente:** Filtrado por categorías (Popular, Películas, Últimos, Latino) y búsqueda en tiempo real.
- **Selector de Servidores y Calidad:** Múltiples opciones para asegurar la mejor reproducción posible.

## 🚀 Cómo Empezar

1. **Backend:** Asegúrate de tener instaladas las dependencias en la carpeta `anime1v-api`. Puedes usar el archivo `Iniciar AniRD API.bat` para levantar el servidor local rápidamente.
2. **Frontend:** Simplemente abre el archivo `anird.html` en cualquier navegador moderno.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **APIs:** Integración con Jikan API (MyAnimeList) y AniList para metadatos.
- **Backend:** Node.js (Anime1v API) para la obtención de enlaces de streaming.

## 📝 Notas de Versión Recientes

### v3.8 - Cloud Sync & Premium Authentication Update 🔐 (Nueva)
- **Rediseño Premium de Autenticación:** Interfaz de inicio de sesión y registro completamente reestructurada con estética Glassmorphism, sombreado de resplandor ambiental, campos de texto interactivos con foco reactivo en tiempo real, menú de pestañas estilo cápsula, animación de sacudida interactiva (`shake`) ante credenciales incorrectas y spinner animado para llamadas asíncronas.
- **Sincronización Inteligente Bidireccional (Two-Way Merge):** Fusión en dos vías entre IndexedDB y el backend de la Orange Pi comparando marcas de tiempo (`updatedAt` / `addedAt`) para unificar favoritos, historial y seguimiento de forma segura sin sobrescribir cambios recientes sin conexión.
- **Persistencia Antirruptura (Fetch Keepalive):** Configuración de llamadas a la API de sincronización con la bandera `{ keepalive: true }`, garantizando que el navegador complete la carga de datos al servidor incluso si el usuario cierra la pestaña o sale de la aplicación rápidamente.
- **Auto-Recuperación de Base de Datos:** Captura global de errores críticos de IndexedDB; si ocurre un bloqueo de versión o corrupción, el sistema borra de forma segura la base local y recarga la página para restaurar desde la nube de forma transparente.
- **Botón de Restablecimiento en Ajustes:** Nueva opción "Restablecer Local" en la pestaña de Ajustes del Perfil para depurar la base de datos local manualmente y forzar una resincronización limpia desde el servidor.
- **Navegación SPA en Logo:** El logo principal de AniRD en la barra superior se reestructuró con enrutamiento dinámico SPA para volver a la página de inicio instantáneamente sin recargas molestas del navegador.
- **Temporizador de 2 Minutos de Visualización Activa:** Medidor inteligente de 120 segundos que detiene el acumulador si la pestaña está oculta (`document.hidden`), con limpieza segura del hilo de ejecución en el enrutador para evitar fugas de memoria.

### v3.7 - Watched Episodes Update 👁️
- **Seguimiento Automatizado (Netflix Style):** Los episodios se marcan automáticamente como vistos al reproducirse. En el sidebar se muestra una barra de progreso roja llena al 100% en la base de la miniatura, un badge translúcido de `✓ Visto` con estética glassmorphic en la esquina superior, y una opacidad reducida al 65% para identificar visualmente qué episodios ya has consumido.
- **Botón de Marcado Manual de Episodio:** Añadido un botón premium `Marcar Visto` / `✓ Visto` en los controles principales del reproductor, sincronizado en tiempo real con IndexedDB.
- **Botón de Marcado de Temporada Completa:** Un nuevo botón `✓✓` en la cabecera del sidebar de episodios que permite marcar o desmarcar la temporada completa en bloque mediante transacciones ultra rápidas en IndexedDB, sin recargar el reproductor ni perder tu progreso.

### v3.6 - Premium Playback Update 🎬
- **Modo Ambiente (Cinematic Glow):** Resplandor ambiental de fondo dinámico y desenfocado basado en la imagen del anime activo, brindando una atmósfera inmersiva de cine.
- **Theater Mode (Modo Cine) Inteligente:** Redimensión del reproductor a tamaño completo usando posicionamiento CSS Grid puro para evitar recargar el iframe del video, reteniendo el progreso de la reproducción.
- **Apagar Luces (Dim Lights):** Overlay oscuro elegante al 94% sobre toda la página que resalta únicamente el reproductor de video para máxima concentración.
- **Selectores Premium Estilo Animex:** Reemplazo de los dropdowns estáticos clásicos por píldoras de botones interactivos para servidores (`Uwu`, `Mochi`, `Beep`) e idiomas (`Subtitulado` / `Latino`).
- **Ficha Técnica Ampliada & Cuenta Regresiva:** Detalles enriquecidos (Estudio, Duración, Episodios, Géneros) al lado del póster del anime con sinopsis expandible mediante un botón de "... ver más" inteligente, junto a un temporizador interactivo para próximos episodios en emisión.
- **Sidebar de Episodios con Miniaturas:** Rediseño completo del listado de episodios usando tarjetas horizontales con miniaturas y títulos dinámicos provistos por AniList, acompañados de un buscador en tiempo real y selector de orden.
- **Animes Recomendados:** Carrusel de sugerencias y recomendaciones de Jikan cargadas en paralelo en la parte inferior con skeletons de carga fluida.
- **Botón de Favorito IndexedDB:** Sincronización en tiempo real con IndexedDB mediante `dbService` directamente desde el panel de reproducción.

### v3.5 - The Discovery Update 🌟

- **Menú de Categorías Premium:** Reemplazo de enlaces estáticos por un menú desplegable (Dropdown) con 15 géneros y estética Glassmorphism, perfectamente alineado con la barra de navegación.
- **Sistema de Notificaciones Inteligente:** Nuevo ícono de campana en la barra superior. Un motor matemático `offline-first` calcula y te avisa exactamente cuándo se estrena un nuevo episodio de los animes que sigues, sin sobrecargar la API.
- **Conteo Regresivo Exacto:** Las tarjetas de animes en las secciones de Favoritos y Mi Perfil ahora muestran un temporizador en vivo (ej. "⏱ 3d 5h para nuevo cap.") con el tiempo exacto faltante para el próximo episodio.
- **Inicio Expandido (Home Page):** Se añadieron 3 nuevos carruseles ("Últimos Lanzamientos", "Animes en Latino", "Acción y Aventura") con carga en paralelo (0 retraso).
- **Desplazamiento Fluido (Scroll Buttons):** Implementación de botones laterales (❮ ❯) al pasar el ratón por los carruseles del inicio para deslizar horizontalmente al puro estilo Netflix.
- **Sincronización Perfecta de Episodios:** La página de detalles de anime ahora verifica en tiempo real con el servidor local para asegurarse de que los últimos episodios emitidos (ej. cap 8) no se oculten si Jikan/MAL va retrasado.
- **Optimización del Catálogo Latino:** Reestructuración de la búsqueda usando IDs de Productores (Crunchyroll/Funimation) en lugar de filtros de texto, devolviendo miles de resultados correctos en la categoría "Latino".

### v3.0 - The Cloud Update ☁️
- **Sincronización Multi-dispositivo:** Tus favoritos e historial ahora se guardan en tu Orange Pi y se sincronizan automáticamente en cualquier dispositivo.
- **Sistema de Cuentas:** Registro e inicio de sesión seguro con JWT y persistencia de datos.
- **Mi Biblioteca Personal:** Nueva sección en el perfil para gestionar animes seguidos y favoritos con una interfaz visual mejorada.
- **Estadísticas en Tiempo Real:** Contador de episodios vistos y animes en seguimiento directamente en tu perfil.
- **Estabilización de UI:** Corrección de parpadeos en animaciones y optimización de carga de componentes.

### v2.1 - Personalización y Seguimiento
- **Modo Claro (Light Theme):** Soporte completo para tema claro con corrección de contraste en textos, tarjetas y navegación.
- **Preferencias de Audio:** Selección inteligente entre Latino y Subtitulado que se aplica automáticamente al reproductor y episodios.
- **Sistema de Seguimiento:** Nueva sección "Siguiendo" en el perfil con **Reloj de Cuenta Regresiva** para próximos estrenos.
- **Buscador Rediseñado:** Botón de búsqueda tipo "píldora" con atajos de teclado y estética profesional.
- **Identidad Visual:** Implementación de Favicon personalizado para la marca AniRD.
- **Optimización:** Limpieza masiva de archivos obsoletos y mejora en la arquitectura de componentes.

### v2.0 - The Big Revamp
- Rediseño completo de la UI/UX inspirado en estándares modernos de streaming.
- Mejora crítica en la legibilidad de las tarjetas de episodios.
- Restauración completa de la funcionalidad de Historial.

## 🤝 Créditos y Agradecimientos

Este proyecto es posible gracias a las increíbles APIs abiertas de la comunidad:

- **[Jikan API](https://jikan.moe/):** API oficial de MyAnimeList que utilizamos para la búsqueda global y datos generales.
- **[AniList API](https://anilist.gitbook.io/):** Utilizada para metadatos enriquecidos, puntuaciones y estados de emisión.
- **[Anime1v API](https://github.com/FxxMorgan/anime1v-api):** El motor original del backend adaptado para el streaming de contenidos.

---
*Desarrollado con ❤️ por adonyrd127*

