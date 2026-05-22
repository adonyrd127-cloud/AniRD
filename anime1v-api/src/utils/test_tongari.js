const animeflvService = require("../services/animeflv.service.js");

async function run() {
  console.log("Searching for 'Witch Hat Atelier'...");
  try {
    const searchRes = await animeflvService.searchAnime("Witch Hat Atelier");
    console.log("Search Success:", searchRes.success);
    console.log("Search Results count:", searchRes.data?.results?.length);
  } catch (err) {
    console.error("Error during test:", err);
  }

  console.log("\nSearching for 'Tongari Boushi no Atelier'...");
  try {
    const searchRes2 = await animeflvService.searchAnime("Tongari Boushi no Atelier");
    console.log("Search Success:", searchRes2.success);
    console.log("Search Results count:", searchRes2.data?.results?.length);
  } catch (err) {
    console.error("Error during test:", err);
  }
}

run();
