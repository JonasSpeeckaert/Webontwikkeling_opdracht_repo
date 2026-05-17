import { DeckObj, SetObj } from "../Interfaces/index";
import { randomInt } from "node:crypto";

export function randomPrice(): number {
  const cents = Math.floor(Math.random() * 1000) + 1;
  return cents / 100;
}

export function getSpotlight(deckData: DeckObj[]): {
  spotlight: DeckObj[];
  prices: number[];
  cardConditions: string[];
} {
  const conditions: string[] = ["mint", "near mint", "good", "used"];
  const spotlight: DeckObj[] = [];
  const prices: number[] = [];
  const cardConditions: string[] = [];

  for (let i = 0; i < 6; i++) {
    const rndCard = randomInt(deckData.length);
    spotlight[i] = deckData[rndCard];
    const rndCondition = randomInt(conditions.length);
    cardConditions[i] = conditions[rndCondition];
    prices[i] = randomPrice();
  }

  return { spotlight, prices, cardConditions };
}

export async function fetchDeck(): Promise<any> {
  let deckData: DeckObj[];
  try {
    const fetchDeck = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/deck.json",
    );
    deckData = await fetchDeck.json();
    console.log("deckjson done");
    return deckData;
  } catch (err) {
    console.log("Something went wrong while fetching the deckdata" + err);
  }
  return undefined;
}

export async function fetchSets(): Promise<any> {
  let setData: SetObj[];
  try {
    const fetchSets = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/sets.json",
    );
    setData = await fetchSets.json();
    console.log("setsjson done");
    return setData;
  } catch (err) {
    console.log("Something went wrong while fetching the setdata" + err);
  }
  return undefined;
}
