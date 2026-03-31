import { DeckObj } from "../Interfaces/index";
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