const animeflvService = require("../services/animeflv.service.js");

async function run() {
  const url = "https://www4.animeflv.net/ver/tongari-boushi-no-atelier-8";
  console.log("Getting links for:", url);
  try {
    const links = await animeflvService.getEpisodeLinks(url);
    console.log("Links Success:", links.success);
    console.log("Servers:", JSON.stringify(links.data?.servers, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
