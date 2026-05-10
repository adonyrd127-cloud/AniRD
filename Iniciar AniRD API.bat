@echo off
title AniRD - API de Anime
color 0A
echo.
echo  ============================================
echo    AniRD - Servidor de API iniciando...
echo  ============================================
echo.
echo  La API estara disponible en:
echo  http://localhost:3000
echo.
echo  Puedes abrir tu pagina anird.html ahora.
echo  NO cierres esta ventana mientras usas la pagina.
echo.
echo  ============================================
echo.
node "C:\Users\adony\.gemini\antigravity\brain\ebdba232-85e7-4c0c-849d-9c47a959fa7f\scratch\anime1v-api\src\server.js"
echo.
echo  El servidor se detuvo. Presiona cualquier tecla para cerrar.
pause > nul
