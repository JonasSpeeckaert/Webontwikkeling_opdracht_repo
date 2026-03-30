import express from "express";
import ejs from "ejs";
import { DeckObj, SetObj } from "../Interfaces/index";
import { randomInt } from "node:crypto";

const app = express();

let deckData: DeckObj[];
let setData: SetObj[];

app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  let spotlight: DeckObj[] = [];
  let prices: number[] = [];
  let conditions: string[] = ["mint", "near mint", "good", "used"];
  let cardConditions: string[] = [];
  for (let i = 0; i < 6; i++) {
    let rnd: number = randomInt(deckData.length);
    spotlight[i] = deckData[rnd];
    rnd = randomInt(4);
    cardConditions[i] = conditions[rnd];
    prices[i] = randomPrice();
  }
  res.render("index", { spotlight, prices, cardConditions });
});

app.get("/cards", (req, res) => {
  const searchTerm: string =
    typeof req.query.search === "string" ? req.query.search : "";
  const sortCategory =
    typeof req.query.sortCategory === "string"
      ? req.query.sortCategory
      : "name";
  const sortDirection =
    typeof req.query.sortDirection === "string"
      ? req.query.sortDirection
      : "asc";
  let filteredCards = deckData.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const rarityOrder = ["common", "uncommon", "rare", "mythic", "legendary"];

  let sortedCards = [...filteredCards].sort((a, b) => {
    if (sortCategory === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortCategory === "manaValue") {
      return sortDirection === "asc"
        ? a.manaValue - b.manaValue
        : b.manaValue - a.manaValue;
    } else if (sortCategory === "rarity") {
      const aRarity = rarityOrder.indexOf(a.rarity.toLowerCase());
      const bRarity = rarityOrder.indexOf(b.rarity.toLowerCase());
      return sortDirection === "asc" ? aRarity - bRarity : bRarity - aRarity;
    } else if (sortCategory === "set") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.cardSet.name)
        : b.name.localeCompare(a.cardSet.name);
    } else {
      return 0;
    }
  });

  res.render("cards", {
    deckData: sortedCards,
    sortDirection: sortDirection,
    sortCategory: sortCategory,
    search: searchTerm,
  });
});

app.get("/:id", (req, res) => {
  let id = req.params.id;
  let foundCard = deckData.find((el) => el.id === id);

  if (!foundCard) {
    res.status(404).send("<h1>Oeps er ging iets mis....</h1>");
    return;
  }
  res.render("carddetails", { foundCard, deckData, setData });
});

app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.send("<h1>Oeps er ging iets mis....</h1>");
});

app.listen(app.get("port"), async () => {
  console.log("Server is listening on port: " + app.get("port"));
  try {
    const fetchDeck = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/deck.json",
    );
    deckData = await fetchDeck.json();
    console.log("deckjson done");

    const fetchSets = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/sets.json",
    );

    setData = await fetchSets.json();
    console.log("setsjson done");
  } catch (err) {
    console.log("Something went wrong while fetching the data" + err);
  }
});

function randomPrice(): number {
  const cents = Math.floor(Math.random() * 1000) + 1;
  return cents / 100;
}
