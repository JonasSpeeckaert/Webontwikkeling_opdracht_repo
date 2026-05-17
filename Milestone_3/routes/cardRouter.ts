import express from "express";
import { DeckObj, SetObj } from "../../Interfaces";
import { getDecks, getCardById, getSets, updateCard } from "../database";

export function cardRouter() {
  const router = express.Router();

  router.get("/cards", async (req, res) => {
    let deckData: DeckObj[] = await getDecks();
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

  router.get("/cards/:id", async (req, res) => {
    let id = req.params.id;
    let foundCard = await getCardById(id);
    let deckData: DeckObj[] = await getDecks();
    let setData: SetObj[] = await getSets();

    if (!foundCard) {
      res.status(404).send("<h1>Oeps er ging iets mis....</h1>");
      return;
    }
    res.render("carddetails", { foundCard, deckData, setData });
  });

  router.get("/cards/:id/update", async (req, res) => {
    let id: string = req.params.id;
    let card: DeckObj | null = await getCardById(id);
    res.render("update", {
      card: card,
    });
  });

  router.post("/cards/:id/update", async (req, res) => {
    let id: string = req.params.id;
    let card: DeckObj = req.body;
    await updateCard(id, card);
    res.redirect(`/cards/${id}`);
  });

  return router;
}
