const { axiosGet } = require('../resolver-helpers');
const { unpack, detect } = require('unpacker');
const { URL } = require('url');

async function extractMp4upload(pageUrl) {
  console.log(`[MP4UPLOAD RESOLVER] Resolviendo: ${pageUrl}`);
  try {
    let embedUrl = pageUrl;
    try {
      const parsed = new URL(pageUrl);
      if (!parsed.pathname.includes('embed-') && !parsed.pathname.endsWith('.html')) {
        const slug = parsed.pathname.split('/').filter(Boolean).pop();
        if (slug) {
          parsed.pathname = `/embed-${slug}.html`;
          embedUrl = parsed.toString();
          console.log(`[MP4UPLOAD RESOLVER] Convertida a URL embed: ${embedUrl}`);
        }
      }
    } catch (_) {}

    const referer = (() => {
      try { return new URL(pageUrl).origin + '/'; } catch (_) { return 'https://www.mp4upload.com/'; }
    })();

    const res = await axiosGet(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
        'Accept': '*/*',
        'Referer': referer
      }
    });

    const html = res.data;
    if (!html || typeof html !== 'string') {
      return embedUrl;
    }

    // 1. Unpack JS if packed
    const scriptMatch = html.match(
      /<script[^>]*>\s*(eval\(function\(p,a,c,k,e,d\)[\s\S]*?\)<\/script>|eval\(function\(p,a,c,k,e,d\)[\s\S]*)/i
    );

    let contentToSearch = html;
    if (scriptMatch) {
      const packedJs = scriptMatch[1] || scriptMatch[0];
      if (detect(packedJs)) {
        try {
          const unpacked = unpack(packedJs);
          contentToSearch += '\n' + unpacked;
        } catch (e) {
          console.warn('[MP4UPLOAD RESOLVER] Error des-empaquetando JS:', e.message);
        }
      }
    }

    // 2. Extract video mp4 URL patterns
    const patterns = [
      /player\.src\s*\(\s*\{\s*type\s*:\s*["']video\/mp4["']\s*,\s*src\s*:\s*["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i,
      /src\s*:\s*["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i,
      /"file"\s*:\s*"([^"]+\.mp4[^"]*)"/i,
      /file\s*:\s*'([^']+\.mp4[^']*)'/i,
      /(https?:\/\/[^\s"'<>]+mp4upload[^\s"'<>]+\.mp4[^\s"'<>]*)/i,
      /(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/i,
    ];

    for (const pattern of patterns) {
      const match = contentToSearch.match(pattern);
      if (match && match[1]) {
        let url = match[1];
        if (url.startsWith('//')) {
          url = 'https:' + url;
        }
        if (!/google|analytics|facebook|beacon|cloudflare|bigbuckbunny|test-video|sample/i.test(url)) {
          console.log(`[MP4UPLOAD RESOLVER] Stream MP4 directo encontrado: ${url}`);
          return url;
        }
      }
    }

    console.log(`[MP4UPLOAD RESOLVER] Retornando URL de embed limpia: ${embedUrl}`);
    return embedUrl;
  } catch (error) {
    console.error(`[MP4UPLOAD RESOLVER] Error: ${error.message}`);
    return pageUrl;
  }
}

module.exports = { extractMp4upload };
