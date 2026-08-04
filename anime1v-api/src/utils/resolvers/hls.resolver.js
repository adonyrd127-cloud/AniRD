const { axiosGet } = require('../resolver-helpers');
const { unpack, detect } = require('unpacker');

async function extractHls(pageUrl) {
  console.log(`[HLS RESOLVER] Resolviendo: ${pageUrl}`);
  try {
    const res = await axiosGet(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
        'Accept': '*/*',
        'Referer': pageUrl
      }
    });
    const html = res.data;
    if (!html || typeof html !== 'string') return pageUrl;

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
          console.warn('[HLS RESOLVER] Error des-empaquetando JS:', e.message);
        }
      }
    }

    // Patterns ordered by specificity - m3u8 first, then mp4 fallback
    const patterns = [
      /sources?\s*:\s*\[\s*\{[^}]*(?:file|src)\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i,
      /"file"\s*:\s*"([^"]+\.m3u8[^"]*)"/i,
      /"source"\s*:\s*"([^"]+\.m3u8[^"]*)"/i,
      /file\s*:\s*'([^']+\.m3u8[^']*)'/i,
      /video\s*src\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /source\s+src\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /data-src\s*=\s*["']([^"']+\.m3u8[^"']*)["']/i,
      /(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i,
      // mp4 fallback
      /sources?\s*:\s*\[\s*\{[^}]*(?:file|src)\s*:\s*["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i,
      /"file"\s*:\s*"([^"]+\.mp4[^"]*)"/i,
      /file\s*:\s*'([^']+\.mp4[^']*)'/i,
      /(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/i,
    ];

    for (const pattern of patterns) {
      const match = contentToSearch.match(pattern);
      if (match && match[1]) {
        let url = match[1];
        // Normalize protocol-relative URLs
        if (url.startsWith('//')) {
          url = 'https:' + url;
        }
        // Skip analytics/tracking URLs
        if (/google|analytics|facebook|beacon|cloudflare/i.test(url)) continue;
        console.log(`[HLS RESOLVER] Match encontrado: ${url}`);
        return url;
      }
    }
    
    console.log(`[HLS RESOLVER] No se encontró stream directo, retornando URL embed: ${pageUrl}`);
    return pageUrl;
  } catch (error) {
    console.error(`[HLS RESOLVER] Error: ${error.message}`);
    return pageUrl;
  }
}

module.exports = { extractHls };

