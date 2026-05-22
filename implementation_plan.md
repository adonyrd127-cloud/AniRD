# Plan de Implementación: Robustecimiento del Buscador Local y Despliegue en Orange Pi

Este plan detalla los cambios técnicos adicionales para blindar el frontend contra fallos de red o diferencias de títulos en la búsqueda de episodios, junto con la solución definitiva y los comandos exactos para aplicar esta actualización en la Orange Pi del usuario.

## 📌 Diagnóstico del Estado Actual

1. **Por qué sigue saliendo "Video no disponible" y se muestran los 13 capítulos**:
   - En la Orange Pi del usuario, la actualización previa fue abortada por git debido a un conflicto local en el archivo `anime1v-api/data/rate-limit.json` (que registra las peticiones locales).
   - Por esta razón, el comando `git pull` falló y la Orange Pi sigue ejecutando el frontend desactualizado y el backend desactualizado (que usa el dominio inactivo `.io` y por eso no encuentra videos).
   
2. **Cómo lo solucionaremos**:
   - **En el código**: Haremos que la búsqueda de episodios en el frontend sea **infalible**. Si el título principal falla al buscarse localmente, buscaremos automáticamente con todos los títulos alternativos de MyAnimeList (Inglés, Japonés y Sinónimos). Además, si es un anime en emisión ("Currently Airing") y la API local no responde, consultaremos la lista real de episodios emitidos en Jikan en lugar de mostrar ciegamente toda la temporada futura.
   - **En el servidor (Orange Pi)**: Facilitaremos la secuencia exacta de comandos para resolver el conflicto de git, descargar el código corregido y compilar/iniciar los nuevos contenedores en Docker de forma automática.

---

## 🛠️ Cambios Propuestos

### [Component: Frontend - Robustecimiento del Buscador y Episodios]

#### [MODIFY] [AnimeDetailPage.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/pages/AnimeDetailPage.js)
- **Búsqueda Multi-Título**: Modificar la función `renderEpisodes` para que itere sobre el título principal, título en inglés, japonés y sinónimos al consultar `apiService.searchLocal`. Esto garantiza que si AnimeFLV tiene el anime bajo otro nombre, la coincidencia sea del 100%.
- **Control Estricto de Emisión (Plan de Respaldo)**: Si la API local falla en encontrar el anime y el anime está en emisión ("Currently Airing"), en lugar de rellenar `epCount` con el total planificado (por ejemplo, 13), consultaremos el endpoint de episodios de Jikan (`/anime/{id}/episodes`) para mostrar únicamente los que ya han salido al aire.

#### [MODIFY] [WatchPage.js](file:///c:/Users/adony/OneDrive/Escritorio/pagina%20de%20anime/frontend/src/pages/WatchPage.js)
- **Búsqueda Multi-Título**: Aplicar el mismo algoritmo ultra-robusto de búsqueda multi-título en la página del reproductor para asegurar que cargue los servidores locales de forma impecable sin importar discrepancias de nombres.

---

## 🚀 Guía de Despliegue en la Orange Pi

Para que todo funcione a la perfección en tu Orange Pi, debes ejecutar los siguientes comandos para destrabar Git, descargar las correcciones de la cabecera y el scraper, y reconstruir los contenedores:

```bash
# 1. Entrar al directorio del proyecto
cd ~/AniRD

# 2. Descartar cambios en archivos temporales/locales (como rate-limit.json) para evitar conflictos en git
git stash
git stash drop

# 3. Descargar la última versión corregida desde GitHub
git pull

# 4. Detener, reconstruir y levantar de nuevo los contenedores en Docker con el código nuevo compilado
docker compose down
docker compose up -d --build
```

---

## 🧪 Plan de Verificación

### Pruebas Locales (Windows)
1. Ejecutar las búsquedas y servidores para "Tongari Boushi no Atelier" con scripts para verificar que el backend responda con los 8 capítulos correctos y los enlaces StreamWish/Streamtape activos.
2. Compilar el frontend localmente con `npm run build` para garantizar que la sintaxis de las mejoras en los componentes de página esté libre de errores.
