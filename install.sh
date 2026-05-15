#!/bin/bash

# Script de instalación automática para AniRD en Orange Pi / Linux
echo "🚀 Iniciando instalación de AniRD..."

# 1. Verificar si Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo "🐳 Instalando Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  echo "✅ Docker instalado."
else
  echo "✅ Docker ya está instalado."
fi

# 2. Verificar si Docker Compose está instalado
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "📦 Instalando Docker Compose..."
  sudo apt-get update
  sudo apt-get install -y docker-compose
  echo "✅ Docker Compose instalado."
else
  echo "✅ Docker Compose ya está instalado."
fi

# 3. Clonar o actualizar el repositorio
if [ -d "AniRD" ]; then
  echo "git actualizando repositorio..."
  cd AniRD
  git pull
else
  echo "📥 Clonando repositorio..."
  git clone https://github.com/adonyrd127-cloud/AniRD.git
  cd AniRD
fi

# 4. Levantar los contenedores
echo "🏗️ Construyendo y levantando contenedores (esto puede tardar unos minutos en ARM)..."
sudo docker-compose up -d --build

# 5. Finalizar
IP=$(hostname -I | awk '{print $1}')
echo "-------------------------------------------------------"
echo "🎉 ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!"
echo "-------------------------------------------------------"
echo "📱 Puedes acceder desde tu PC o Móvil en:"
echo "👉 http://$IP:8080"
echo "-------------------------------------------------------"
echo "Nota: Si no puedes acceder, asegúrate de que tu Orange Pi"
echo "esté en la misma red WiFi/LAN que tu dispositivo."
