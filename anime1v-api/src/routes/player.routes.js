const express = require("express");
const axios = require("axios");

const router = express.Router();

// Permitir que estas páginas se carguen en iframes desde cualquier origen (frontend puede estar en otro puerto)
router.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.removeHeader("Content-Security-Policy");
  next();
});

const PROXY_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// ─────────────────────────────────────────────────────────────────────────────
// 1. HLS Player — Sirve una página HTML limpia con Hls.js + <video>
//    El navegador carga esta página en un iframe. Hls.js consume el .m3u8
//    a través de nuestro proxy /proxy/m3u8/:hash, eliminando el bloqueo 403
//    de Cloudflare por completo.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/hls/:hash", (req, res) => {
  const hash = req.params.hash;
  if (!hash || !/^[a-f0-9]+$/i.test(hash)) {
    return res.status(400).send("Hash inválido");
  }

  // Construir la URL del proxy m3u8 relativa al host actual
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const m3u8ProxyUrl = `${baseUrl}/player/m3u8/${hash}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AniRD Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    video {
      width: 100%; height: 100%;
      object-fit: contain;
      background: #000;
    }
    .error-msg {
      display: none; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%); color: #fff; font-family: sans-serif;
      text-align: center; padding: 20px;
    }
    .error-msg span { font-size: 40px; display: block; margin-bottom: 10px; }
  </style>
</head>
<body>
  <video id="player" controls autoplay playsinline></video>
  <div class="error-msg" id="error-msg">
    <span>⚠️</span>
    <p>No se pudo cargar el video HLS</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js"></script>
  <script>
    (function() {
      var video = document.getElementById('player');
      var errorMsg = document.getElementById('error-msg');
      var src = ${JSON.stringify(m3u8ProxyUrl)};

      if (Hls.isSupported()) {
        var hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
        hls.on(Hls.Events.ERROR, function(event, data) {
          if (data.fatal) {
            errorMsg.style.display = 'block';
            video.style.display = 'none';
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari nativo
        video.src = src;
        video.addEventListener('loadedmetadata', function() {
          video.play().catch(function() {});
        });
      } else {
        errorMsg.style.display = 'block';
        video.style.display = 'none';
      }
    })();
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.send(html);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. MP4Upload Player — Extrae la URL directa .mp4 y sirve HTML limpio
//    Sin scripts de anuncios, sin PopCash, sin Exoclick, sin overlays.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/mp4upload/:embedId", async (req, res) => {
  const embedId = req.params.embedId;
  if (!embedId || !/^[a-z0-9]+$/i.test(embedId)) {
    return res.status(400).send("Embed ID inválido");
  }

  let directMp4Url = null;

  try {
    const embedUrl = `https://www.mp4upload.com/embed-${embedId}.html`;
    const response = await axios.get(embedUrl, {
      headers: {
        "User-Agent": PROXY_UA,
        Referer: "https://www.mp4upload.com/",
      },
      timeout: 8000,
    });

    const html = response.data;
    const match =
      html.match(/src:\s*["'](https?:[^\s"']+\.mp4[^\s"']*)["']/i) ||
      html.match(/(https?:\/\/[^\s"']+\.mp4upload\.com[^\s"']*\.mp4[^\s"']*)/i);

    if (match && match[1]) {
      directMp4Url = match[1];
    }
  } catch (_e) {
    // Si falla la extracción, se mostrará un mensaje de error
  }

  if (!directMp4Url) {
    return res.status(502).send(`<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0}body{background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center}</style></head>
<body><div><p style="font-size:40px">⚠️</p><p>No se pudo extraer el video de MP4Upload</p></div></body></html>`);
  }

  const playerHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AniRD Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    video {
      width: 100%; height: 100%;
      object-fit: contain;
      background: #000;
    }
  </style>
</head>
<body>
  <video id="player" controls autoplay playsinline>
    <source src="${directMp4Url}" type="video/mp4">
  </video>
  <script>
    var v = document.getElementById('player');
    v.play().catch(function(){});
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.send(playerHtml);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Proxy de playlist .m3u8 — Descarga la playlist de Zilla-Networks
//    server-side (evitando Cloudflare 403) y reescribe las URLs de segmentos
//    .ts para que pasen por nuestro proxy /proxy/ts
// ─────────────────────────────────────────────────────────────────────────────
router.get("/m3u8/:hash", async (req, res) => {
  const hash = req.params.hash;
  if (!hash || !/^[a-f0-9]+$/i.test(hash)) {
    return res.status(400).send("Hash inválido");
  }

  try {
    const m3u8Url = `https://player.zilla-networks.com/m3u8/${hash}`;
    const response = await axios.get(m3u8Url, {
      headers: {
        "User-Agent": PROXY_UA,
        Referer: "https://player.zilla-networks.com/",
      },
      timeout: 10000,
      responseType: "text",
    });

    let playlist = response.data;

    // Determinar URL base del origen para resolver URLs relativas de segmentos
    const originBase = m3u8Url.substring(0, m3u8Url.lastIndexOf("/") + 1);
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Reescribir cada línea de segmento .ts para que pase por nuestro proxy
    const lines = playlist.split("\n");
    const rewrittenLines = lines.map((line) => {
      const trimmed = line.trim();
      // Ignorar líneas vacías y directivas M3U8
      if (!trimmed || trimmed.startsWith("#")) {
        return line;
      }
      // Es una URL de segmento — resolver a URL absoluta y proxear
      let segmentUrl;
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        segmentUrl = trimmed;
      } else {
        segmentUrl = originBase + trimmed;
      }
      return `${baseUrl}/player/ts?url=${encodeURIComponent(segmentUrl)}`;
    });

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.send(rewrittenLines.join("\n"));
  } catch (error) {
    console.error("[HLS Proxy] Error al obtener m3u8:", error.message);
    res.status(502).send("Error al obtener playlist HLS");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Proxy de segmentos .ts — Proxy transparente para segmentos de video HLS.
//    Descarga el segmento server-side y lo retransmite al navegador.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/ts", async (req, res) => {
  const segmentUrl = req.query.url;
  if (!segmentUrl) {
    return res.status(400).send("Parámetro url requerido");
  }

  // Validar que la URL apunta a un dominio de streaming permitido
  try {
    const parsed = new URL(segmentUrl);
    const host = parsed.hostname.toLowerCase();
    const allowed =
      host.includes("zilla-networks") ||
      host.includes("zilla") ||
      host.includes("cdn") ||
      host.includes("stream") ||
      host.includes("hls");

    if (!allowed) {
      return res.status(403).send("Dominio no permitido para proxy de segmentos");
    }
  } catch (_e) {
    return res.status(400).send("URL inválida");
  }

  try {
    const response = await axios.get(segmentUrl, {
      headers: {
        "User-Agent": PROXY_UA,
        Referer: "https://player.zilla-networks.com/",
      },
      timeout: 15000,
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"] || "video/mp2t");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }

    response.data.pipe(res);
  } catch (error) {
    console.error("[TS Proxy] Error al obtener segmento:", error.message);
    res.status(502).send("Error al obtener segmento de video");
  }
});

module.exports = router;
