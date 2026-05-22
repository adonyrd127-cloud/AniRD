const animeflvService = require("../services/animeflv.service.js");

async function run() {
  console.log("Searching with DEFAULT_DOMAIN (www4.animeflv.io):");
  try {
    const res1 = await animeflvService.searchAnime("Naruto");
    console.log("Result success:", res1.success);
    console.log("Result count:", res1.data?.results?.length);
  } catch (err) {
    console.error("Error with DEFAULT_DOMAIN:", err.message);
  }

  console.log("\nSearching with explicit domain (www4.animeflv.net):");
  try {
    const res2 = await animeflvService.searchAnime("Naruto", "www4.animeflv.net");
    console.log("Result success:", res2.success);
    console.log("Result count:", res2.data?.results?.length);
    if (res2.data?.results?.length > 0) {
      console.log("Sample result title:", res2.data.results[0].title);
      console.log("Sample result URL:", res2.data.results[0].url);
      
      console.log("\nGetting info for:", res2.data.results[0].url);
      const info = await animeflvService.getAnimeInfo(res2.data.results[0].url);
      console.log("Info success:", info.success);
      console.log("Episodes count:", info.data?.episodes?.length);
      
      if (info.data?.episodes?.length > 0) {
        const firstEp = info.data.episodes[info.data.episodes.length - 1]; // First episode chronologically
        console.log("Episode URL:", firstEp.url);
        console.log("\nGetting links for episode:", firstEp.url);
        const links = await animeflvService.getEpisodeLinks(firstEp.url);
        console.log("Links success:", links.success);
        console.log("Servers count:", Object.keys(links.data?.servers || {}).reduce((acc, k) => acc + links.data.servers[k].length, 0));
        console.log("Sub servers:", links.data?.servers?.sub);
      }
    }
  } catch (err) {
    console.error("Error with explicit domain:", err.message);
  }
}

run();
