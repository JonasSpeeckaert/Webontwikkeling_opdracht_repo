import express from "express";
import ejs from "ejs";
import { DeckObj, SetObj } from "../Interfaces/index";
import { randomInt } from "node:crypto";
import {
  getSpotlight,
  randomPrice,
  fetchDeck,
  fetchSets,
} from "./helperFunctions";

const app = express();

let deckData: DeckObj[];
let setData: SetObj[];

app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  const { spotlight, prices, cardConditions } = getSpotlight(deckData);
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

app.get("/cards/:id", (req, res) => {
  let id = req.params.id;
  let foundCard = deckData.find((el) => el.id === id);

  if (!foundCard) {
    res.status(404).send("<h1>Oeps er ging iets mis....</h1>");
    return;
  }
  res.render("carddetails", { foundCard, deckData, setData });
});

app.get("/sets", (req, res) => {
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
  const legalFilter =
    typeof req.query.legalFilter === "string" ? req.query.legalFilter : "all";

  let filteredSets = setData.filter((set) =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (legalFilter === "legal") {
    filteredSets = filteredSets.filter((set) => set.isStandardLegal === true);
  } else if (legalFilter === "notLegal") {
    filteredSets = filteredSets.filter((set) => set.isStandardLegal === false);
  }

  let sortedSets = [...filteredSets].sort((a, b) => {
    if (sortCategory === "releaseYear") {
      return sortDirection === "asc"
        ? a.releaseYear - b.releaseYear
        : b.releaseYear - a.releaseYear;
    } else {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  res.render("sets", {
    setData: sortedSets,
    sortDirection,
    sortCategory,
    search: searchTerm,
    legalFilter,
  });
});

app.get("/sets/:id", (req, res) => {
  let id = req.params.id;
  let foundSet = setData.find((el) => el.id === id);

  if (!foundSet) {
    res.status(404).send("<h1>Oeps er ging iets mis....</h1>");
    return;
  }
  res.render("setdetails", { foundSet, deckData, setData });
});

app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.render("404");
});

app.listen(app.get("port"), async () => {
  console.log("Server is listening on port: " + app.get("port"));
  deckData = await fetchDeck();
  setData = await fetchSets();
});
