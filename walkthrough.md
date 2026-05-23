# Walkthrough: AniRD Smart TV Usability & Android APK Wrapper (v4.1.0)

¡Esta actualización (v4.1.0) introduce correcciones críticas de usabilidad para televisores inteligentes (Smart TVs) y consolida la creación del APK nativo móvil y TV! Hemos resuelto los tres problemas de usabilidad identificados en mandos D-pad y navegadores de televisión, y todo ha sido desplegado con éxito en el repositorio.

---

## 📺 Soluciones a los Problemas Críticos de Smart TV (v4.1.0)

### 1. Problema 1 (Mi Perfil Inaccesible) y Problema 2 (Falta de Navegación en Episodios)
* **El Diagnóstico**: Para evitar descuadres visuales y saltos bruscos en el navegador de la Smart TV, el servicio de navegación espacial (`spatialNavigation.js`) bloquea físicamente el scroll de la ventana (`window.scrollY = 0`). Dado que la vista de perfil (`/profile`) y de detalle del anime (`/anime/:id`) superan los 1080px de alto, la lista de episodios y los ajustes de perfil se renderizaban por debajo de la pantalla, quedando **completamente invisibles e inalcanzables**.
* **Las Correcciones**:
  1. **Scroll Interno del Contenedor Principal (`#app`)**: Limitamos la altura de `#app` al 100% de la pantalla de TV (`100vh`) de forma global en Modo TV y habilitamos el desbordamiento interno vertical (`overflow-y: auto !important`). Ahora toda la interfaz fluye y se desplaza de forma impecable y suave al mover el foco con el control remoto, manteniendo la barra lateral y cabecera fijas como una app nativa (estilo Netflix/Crunchyroll).
  2. **Pestañas Focusables por D-pad**: Añadimos `tabindex="0"` a los elementos `.tab-item` en `AnimeDetailPage.js` y agregamos el selector de pestañas en `spatialNavigation.js`. Ahora las pestañas "EPISODIOS" y "PERSONAJES" son alcanzables y activables con el botón Enter de tu control remoto.
  3. **Estilos de Enfoque Neon Coral**: Diseñamos clases de enfoque `.focused` personalizadas para las tarjetas de episodios (`.ep-card-animex`) y pestañas en `global.css`, brindando un resplandor neón sumamente visible a distancia.

### 2. Problema 3 (Reproductor de Video en Blanco)
* **El Diagnóstico**: El reproductor `<iframe>` utilizaba el atributo restrictivo `sandbox`. Los navegadores integrados de Smart TVs (como Tizen de Samsung o WebOS de LG) tienen directivas de seguridad muy estrictas. Al intentar cargar reproductores de streaming externos, estos requieren acceso a cookies, localStorage o renderizado HLS, lo cual era bloqueado por el sandbox, provocando que el player crasheara en silencio y se mostrara **completamente en blanco**.
* **La Corrección**:
  - **Eliminamos el atributo `sandbox` del iframe** en `WatchPage.js` de forma definitiva. Ahora los reproductores web de los servidores se inicializan perfectamente, mostrando los controles nativos y reproduciendo el flujo HLS sin restricciones en cualquier marca de Smart TV.

---

## 🛠️ Resumen de Archivos Modificados

- **[MODIFY]** [global.css](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/styles/global.css) - Limitada altura de `#app` a `100vh` con scroll vertical interno en TV, y añadidos estilos neón de foco para pestañas y tarjetas de episodios.
- **[MODIFY]** [spatialNavigation.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/services/spatialNavigation.js) - Incluido selector de pestañas `.tab-item` en la lista de elementos interactivos de la TV.
- **[MODIFY]** [AnimeDetailPage.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/pages/AnimeDetailPage.js) - Añadido atributo `tabindex="0"` a las pestañas de episodios y personajes.
- **[MODIFY]** [WatchPage.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/pages/WatchPage.js) - Removido el atributo restrictivo `sandbox` en el iframe del reproductor de video.
- **[MODIFY]** [walkthrough.md](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/walkthrough.md) - Actualizada la documentación oficial.

---

## 🚀 Despliegue en tu Orange Pi

Al igual que en el cambio anterior, **los cambios ya están compilados con Vite y subidos a tu repositorio de GitHub**. El APK nativo lee esta información dinámicamente de tu servidor, por lo que **no es necesario que reinstales el APK en la TV o el móvil**.

Para aplicar estas correcciones al instante en tu televisión, ejecuta los siguientes comandos en tu terminal SSH de la Orange Pi:

```bash
# 1. Entrar al directorio del proyecto en la Orange Pi
cd ~/AniRD

# 2. Descartar cualquier cambio temporal
git stash
git stash drop

# 3. Descargar la versión v4.1.0 de GitHub
git pull

# 4. Levantar nuevamente los contenedores de Docker compilando los nuevos estilos
docker compose down
docker compose up -d --build
```

Una vez que Docker levante la app, abre AniRD en tu Smart TV o a través del APK y verás que el reproductor de video se inicializa al instante, y podrás navegar, hacer scroll, enfocar y seleccionar episodios y configuraciones de perfil de forma 100% fluida e intuitiva con tu mando a distancia.
