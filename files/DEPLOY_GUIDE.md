# AniRD v4.2 — Guía de Deploy: Fix Layout TV/Android

## 📋 Resumen de los 3 bugs arreglados

| Bug | Causa | Fix |
|-----|-------|-----|
| Hero no visible | No había `padding-top` → quedaba detrás del nav fijo | `home-page-wrapper` con padding-top: 70px |
| TV mode no se activa | Nunca se detectaba el user-agent Android automáticamente | `autoDetect()` en spatialNavigation.js |
| Scroll roto en #app | `scrollIntoView` conflictuaba con `lockWindowScroll` | `_scrollElementIntoView()` usa el #app directamente |

---

## 🚀 Pasos de deploy en Orange Pi

```bash
# 1. Ir al proyecto
cd ~/AniRD

# 2. Limpiar cambios locales temporales
git stash && git stash drop

# 3. Bajar el código nuevo
git pull

# 4. Reconstruir y levantar
docker compose down
docker compose up -d --build

# 5. Verificar que esté corriendo
docker ps
docker logs anird-web --tail=20
docker logs anird-api --tail=20
```

## 📁 Archivos modificados

```
frontend/src/pages/HomePage.js          ← Fix #1: padding-top + error handling
frontend/src/services/spatialNavigation.js ← Fix #2: auto-detect TV + scroll fix
frontend/src/styles/global.css          ← Agregar tv-layout-patch.css al final
```

## ✏️ Cómo aplicar el patch de CSS

Opción A (recomendada): Agregar al final de `global.css`:
```bash
cat tv-layout-patch.css >> frontend/src/styles/global.css
```

Opción B: Importar en tu `main.js` o `index.html`:
```html
<link rel="stylesheet" href="/src/styles/tv-layout-patch.css">
```

## 🧪 Cómo verificar en la TV

1. Abrir la app → debe verse el hero completo con imagen de fondo
2. Abrir DevTools del navegador en PC → ir a `http://10.0.0.9:8090`
3. Revisar Console por errores de API
4. Si ves "Error al cargar X" en el banner rojo → problema de conexión al backend (puerto 3005)

## 🔍 Debug rápido

En la TV/WebView, si el contenido sigue sin aparecer, abrir desde un PC:
```
http://10.0.0.9:8090
```
y verificar en DevTools > Network si las llamadas a Jikan API responden.

Si el backend no responde:
```bash
docker logs anird-api --tail=50
```
