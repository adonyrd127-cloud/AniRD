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

### v3.6 - Premium Playback Update 🎬 (Nueva)
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

