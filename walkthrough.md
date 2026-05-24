# Walkthrough: AniRD Smart TV Usability & Android APK Wrapper (v4.2.0)

¡Esta actualización (v4.2.0) introduce correcciones críticas de usabilidad para televisores inteligentes (Smart TVs), consolida la creación del APK nativo móvil/TV y soluciona de forma definitiva el problema del reproductor que desaparecía al activar la pantalla completa en dispositivos móviles!

---

## 📱 Solución Definitiva a la Desaparición del Reproductor en Pantalla Completa Móvil (v4.2.0)

* **El Diagnóstico**: En la versión móvil, al hacer clic en "Pantalla Completa", el reproductor de video (`#video-container`) pasaba a tener una regla `position: fixed !important`. Sin embargo, debido a que se encontraba anidado dentro de contenedores padres con animaciones de entrada (`.page-enter` con `transform: translateY(0)`), transiciones dinámicas (`.watch-layout-v5` y `.player-section-v5`) o propiedades de apilamiento en el WebView, se creaba un **contexto de apilamiento local**. Esto provocaba que `position: fixed` se calculara relativo al elemento padre y se recortara por completo (clipped), haciendo que el reproductor desapareciera visualmente de la pantalla mientras que el resto de los botones y textos se desplazaban hacia arriba.
* **La Corrección**:
  1. **Disolución de Contexto de Apilamiento Padres**: Creamos una regla ultra-robusta en `global.css` que, al activarse la pantalla completa (`body.mobile-fullscreen-active` o `body.tv-fullscreen-active`), anula automáticamente cualquier propiedad restrictiva en la cadena de padres (`#app`, `.page-enter`, `.watch-layout-v5` y `.player-section-v5`), eliminando `transform`, `animation`, `transition`, `will-change`, `perspective`, `filter`, `backdrop-filter`, `clip-path`, `mask`, `contain`, y forzando `position: static !important; overflow: visible !important; z-index: auto !important;`.
  2. **Garantía de Visualización Fullscreen**: Forzamos a `#video-container` a ignorar cualquier relación de aspecto restrictiva mediante `aspect-ratio: auto !important; transition: none !important;` y establecimos su tamaño a `width: 100vw !important; height: 100vh !important; min-width: 100vw !important; min-height: 100vh !important;` con un `z-index: 999999 !important;`.
  3. **Resultado**: Ahora, al presionar "Pantalla Completa" en el celular, el reproductor de video cubre el 100% de la pantalla de forma perfecta, fluida y sin desaparecer, mostrando el botón flotante de cierre ("✕") en la esquina superior derecha y permitiendo salir con el gesto de retroceso nativo.

---

## 📺 Soluciones a los Problemas Críticos de Smart TV (v4.1.0)

### 1. Problema 1 (Mi Perfil Inaccesible) y Problema 2 (Falta de Navegación en Episodios)
* **El Diagnóstico**: Para evitar descuadres visuales y saltos bruscos en el navegador de la Smart TV, el servicio de navegación espacial (`spatialNavigation.js`) bloquea físicamente el scroll de la ventana (`window.scrollY = 0`). Dado que la vista de perfil (`/profile`) y de detalle del anime (`/anime/:id`) superan los 1080px de alto, la lista de episodios y los ajustes de perfil se renderizaban por debajo de la pantalla, quedando **completamente invisibles e inalcanzables**.
* **Las Correcciones**:
  1. **Scroll Interno del Contenedor Principal (`#app`)**: Limitamos la altura de `#app` al 100% de la pantalla de TV (`100vh`) de forma global en Modo TV y habilitamos el desbordamiento interno vertical (`overflow-y: auto !important`). Ahora toda la interfaz fluye y se desplaza de forma impecable y suave al mover el foco con el control remoto, manteniendo la barra lateral y cabecera fijas como una app nativa (estilo Netflix/Crunchyroll).
  2. **Pestañas Focusables por D-pad**: Añadimos `tabindex="0"` a los elementos `.tab-item` en `AnimeDetailPage.js` y agregamos el selector de pestañas en `spatialNavigation.js`. Ahora las pestañas "EPISODIOS" y "PERSONAJES" son alcanzables y activables con el botón Enter de tu control remoto.
  3. **Estilos de Enfoque Neon Coral**: Diseñamos clases de enfoque `.focused` personalizadas para las tarjetas de episodios (`.ep-card-animex`) y pestañas en `global.css`, brindando un resplandor neón sumamente visible a distancia.

### 2. Problema 3 (Reproductor de Video en Blanco)
* **El Diagnóstico**: El reproductor `<iframe>` utilizaba el atributo restrictivo `sandbox`. Al intentar cargar reproductores de streaming externos, estos requieren acceso a cookies, localStorage o renderizado HLS, lo cual era bloqueado por el sandbox, provocando que el player crasheara en silencio y se mostrara **completamente en blanco**.
* **La Corrección**:
  - **Eliminamos el atributo `sandbox` del iframe** en `WatchPage.js` de forma definitiva. Ahora los reproductores web de los servidores se inicializan perfectamente, mostrando los controles nativos y reproduciendo el flujo HLS sin restricciones en cualquier marca de Smart TV.

---

## 🛠️ Resumen de Archivos Modificados

- **[MODIFY]** [global.css](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/styles/global.css) - Añadida regla de disolución de contexto de apilamiento para padres, corrección de relación de aspecto en fullscreen y desactivación de transiciones sobre `#video-container`.
- **[MODIFY]** [walkthrough.md](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/walkthrough.md) - Actualizada la documentación oficial a la versión v4.2.0.

---

## 🚀 Despliegue en tu Orange Pi

Todos los cambios han sido compilados exitosamente mediante Vite y subidos a tu repositorio de GitHub. Dado que la aplicación web se lee de forma dinámica desde el backend de tu Orange Pi, **no es necesario que recompiles ni reinstales el APK en tus dispositivos**.

Para desplegar la actualización y aplicar los cambios de inmediato en tu Orange Pi, ejecuta los siguientes comandos en tu terminal SSH:

```bash
# 1. Entrar al directorio del proyecto en la Orange Pi
cd ~/AniRD

# 2. Descartar cualquier cambio temporal local
git stash
git stash drop

# 3. Descargar la última actualización de GitHub
git pull

# 4. Reconstruir y levantar los contenedores en segundo plano
docker compose down
docker compose up -d --build
```

Una vez completado, abre AniRD en tu dispositivo móvil o Smart TV. Verás que la pantalla completa emulada por CSS en celulares ahora es 100% visible, fluida y robusta, resolviendo la anomalía anterior por completo.100% fluida e intuitiva con tu mando a distancia.
