# Walkthrough: Soporte para Controles de Smart TV y Modo Pantalla Gigante (v3.11.0)

¡El Modo Smart TV ha sido completado y desplegado con éxito! La aplicación AniRD ahora es 100% compatible con televisores, lo que permite controlarla en su totalidad usando únicamente las teclas direccionales (arriba, abajo, izquierda, derecha), el botón de selección (Enter) y la tecla de retroceso (Backspace) de cualquier control remoto físico o teclado.

---

## 📺 ¿Qué hemos implementado?

### 1. Motor de Navegación Espacial (`spatialNavigation.js`)
- **Autónomo e Inteligente**: Escanea dinámicamente el DOM de forma reactiva (con un `MutationObserver`) para detectar todos los elementos interactivos visibles en pantalla, incluyendo portadas de anime, botones de reproducción, controles de servidor e items del historial.
- **Shadow DOM Ready**: Resuelve las barreras del Shadow DOM de Web Components de forma nativa para permitir el enfoque suave sobre componentes encapsulados como `<anime-card>`.
- **Algoritmo de Proximidad 2D**: Al presionar una flecha del control remoto, calcula la distancia euclidiana entre centros geométricos, aplicando una penalización del triple en el eje secundario para garantizar un movimiento intuitivo y natural sobre cuadrículas y filas de carruseles.
- **Teclas Clave Soportadas**:
  - `Arrows`: Mueve el foco visual suavemente.
  - `Enter`: Simula un clic (activa enlaces, abre fichas, reproduce episodios).
  - `Backspace` / `Escape`: Simula un retroceso suave (`window.history.back()`) sin interrumpir la escritura en campos de búsqueda.

### 2. Botón e Inicialización (`main.js`)
- **Control al Instante**: Inyectado un botón interactivo `📺 Modo TV` en la barra lateral `.desktop-sidebar`.
- **Auto-detección Inteligente**: Detecta de manera automática navegadores integrados en televisores (como Android TV, Samsung Tizen, LG WebOS, Roku, Apple TV, Fire TV, etc.) mediante el User Agent para encender el motor espacial al instante.
- **Persistencia Local**: Guarda el estado de tu preferencia en el almacenamiento local del navegador (`localStorage`) para recordar si quieres mantener el Modo TV encendido o apagado en tus visitas.
- **Sincronización Zustand**: Escucha los cambios de ruta y refresca la lista de elementos enfocables de forma fluida cada vez que navegas a una nueva página.

### 3. Interfaz Premium de TV o "10-foot UI" (`global.css`)
- **Estilo de Foco Neon Coral Premium**: Los elementos enfocados obtienen un contorno coral grueso brillante (`#ff0055`), se escalan un 105% con transiciones fluidas y proyectan un resplandor de neón coral vibrante.
- **Legibilidad de Lejos**: Cuando el Modo TV está encendido, el tamaño de fuente general se amplía un 25%, el fondo del sitio se vuelve más oscuro y las portadas del catálogo de anime se expanden para verse impecables a 3 metros de distancia.
- **Cero Elementos Móviles**: Se oculta la barra de navegación móvil inferior cuando estás en Modo TV para que la pantalla quede limpia y espaciosa para el control remoto.

---

## 🛠️ Cómo Activar los Cambios en tu Orange Pi

Para desplegar esta nueva versión corregida y con soporte de TV en tu Orange Pi, ejecuta los siguientes comandos en tu terminal SSH:

```bash
# 1. Entrar al directorio del proyecto en la Orange Pi
cd ~/AniRD

# 2. Descartar cualquier cambio local temporal que impida la descarga limpia
git stash
git stash drop

# 3. Descargar la última versión corregida y la etiqueta v3.11.0 de GitHub
git pull

# 4. Detener y levantar nuevamente los servicios en Docker forzando la compilación
docker compose down
docker compose up -d --build
```

---

## 🧪 Resumen de Archivos Modificados

- **[NEW]** `frontend/src/services/spatialNavigation.js` - El motor completo de la navegación espacial para televisores.
- **[MODIFY]** `frontend/src/main.js` - Inyección del botón de TV y hooks de carga de Zustand.
- **[MODIFY]** `frontend/src/styles/global.css` - Estilos responsivos de televisión y el foco de neón coral `.focused`.
