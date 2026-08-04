const { axiosGet } = require('../resolver-helpers');
const { unpack, detect } = require('unpacker');
const { URL } = require('url');

async function extractUpnshare(pageUrl) {
  console.log(`[UPNSHARE RESOLVER] Resolviendo: ${pageUrl}`);
  try {
    // Convert to embed URL if needed
    let urlToFetch = pageUrl;
    try {
      const parsed = new URL(pageUrl);
      if (parsed.pathname.startsWith('/d/')) {
        parsed.pathname = parsed.pathname.replace('/d/', '/e/');
        urlToFetch = parsed.toString();
        console.log(`[UPNSHARE RESOLVER] Convertida a embed: ${urlToFetch}`);
      } else if (!parsed.pathname.includes('/e/') && !parsed.pathname.includes('/embed/')) {
        // Try adding /e/ prefix
        const slug = parsed.pathname.split('/').filter(Boolean).pop();
        if (slug) {
          parsed.pathname = `/e/${slug}`;
          urlToFetch = parsed.toString();
          console.log(`[UPNSHARE RESOLVER] Reformateada: ${urlToFetch}`);
        }
      }
    } catch (_) {}

    const referer = (() => {
      try { return new URL(pageUrl).origin + '/'; } catch (_) { return 'https://upnshare.com/'; }
    })();

    const res = await axiosGet(urlToFetch, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
        'Accept': '*/*',
        'Referer': referer
      }
    });
    const html = res.data;
    if (!html || typeof html !== 'string') return urlToFetch;

    let contentToSearch = html;
    const scriptMatch = html.match(
      /<script[^>]*>\s*(eval\(function\(p,a,c,k,e,d\)[\s\S]*?\)<\/script>|eval\(function\(p,a,c,k,e,d\)[\s\S]*)/i
    );
    if (scriptMatch) {
      const packedJs = scriptMatch[1] || scriptMatch[0];
      if (detect(packedJs)) {
        try {
          const unpacked = unpack(packedJs);
          contentToSearch += '\n' + unpacked;
        } catch (e) {
          console.warn('[UPNSHARE RESOLVER] Error des-empaquetando JS:', e.message);
        }
      }
    }

    const patterns = [
      // video.js / plyr sources array
      /sources?\s*:\s*\[\s*\{[^}]*src\s*:\s*["'](https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)["']/i,
      // JWPlayer file config
      /"file"\s*:\s*"([^"]+\.(?:m3u8|mp4)[^"]*)"/i,
      /file\s*:\s*'([^']+\.(?:m3u8|mp4)[^']*)'/i,
      // Generic source/video attributes
      /source\s+src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i,
      /video\s*src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i,
      /data-src\s*=\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i,
      // Generic URL patterns
      /(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i,
      /(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/i,
    ];

    for (const pattern of patterns) {
      const match = contentToSearch.match(pattern);
      if (match && match[1]) {
        let url = match[1];
        if (url.startsWith('//')) {
          url = 'https:' + url;
        }
        // Skip analytics/tracking URLs
        if (/google|analytics|facebook|beacon|cloudflare|bigbuckbunny|test-video|sample/i.test(url)) continue;
        console.log(`[UPNSHARE RESOLVER] Match encontrado: ${url}`);
        return url;
      }
    }

    console.log(`[UPNSHARE RESOLVER] No se encontró video directo, retornando URL embed limpia: ${urlToFetch}`);
    return urlToFetch;
  } catch (error) {
    console.error(`[UPNSHARE RESOLVER] Error: ${error.message}`);
    return pageUrl;
  }
}

module.exports = { extractUpnshare };

