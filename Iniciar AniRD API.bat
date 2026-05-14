@echo off
title AniRD v3.0 - Full Suite
color 0B
echo.
echo  =======================================================
echo    AniRD v3.0 - Iniciando Sistema de Streaming
echo  =======================================================
echo.
echo  [1/2] Iniciando API Backend en ventana separada...
start "AniRD API" cmd /c "cd anime1v-api && title AniRD API && npm run start"
echo  [OK] API lanzada en puerto 3000.
echo.
echo  [2/2] Iniciando Frontend Vite...
echo.
echo  =======================================================
echo    LA WEB ESTARA DISPONIBLE EN: http://localhost:5173
echo  =======================================================
echo.
cd frontend
npm run dev
pause
