import express, { Router } from "express";
import { DeckObj, SetObj } from "../../Interfaces";
import { getDecks, getCardById, getSets, updateCard } from "../database";

export function setRouter() {
  const router = express.Router();

  router.get("/sets", async (req, res) => {
    let setData: SetObj[] = await getSets();
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
      filteredSets = filteredSets.filter(
        (set) => set.isStandardLegal === false,
      );
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

  router.get("/sets/:id", async (req, res) => {
    let setData: SetObj[] = await getSets();
    let deckData: DeckObj[] = await getDecks();
    let id = req.params.id;
    let foundSet = setData.find((el) => el.id === id);

    if (!foundSet) {
      res.status(404).send("<h1>Oeps er ging iets mis....</h1>");
      return;
    }
    res.render("setdetails", { foundSet, deckData, setData });
  });

  return router;
}
