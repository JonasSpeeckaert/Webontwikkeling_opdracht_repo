import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DeckObj, SetObj } from "../Interfaces/index";
import {
  getSpotlight,
  randomPrice,
  fetchDeck,
  fetchSets,
} from "./helperFunctions";

dotenv.config();

let deckData: DeckObj[];
let setData: SetObj[];

export const client = new MongoClient(process.env.CONNECTION_STRING!);
const deckCollection = client
  .db("Milestone")
  .collection<DeckObj>("deck_collection");
const setCollection = client
  .db("Milestone")
  .collection<SetObj>("sets_collection");

async function seedDeck() {
  if ((await deckCollection.countDocuments()) === 0) {
    let decks = await fetchDeck();
    deckCollection.insertMany(decks);
    console.log("added " + decks.length + " to deckCollection");
  }
}

async function seedSet() {
  if ((await setCollection.countDocuments()) === 0) {
    let sets = await fetchSets();
    setCollection.insertMany(sets);
    console.log("added " + sets.length + " to setCollection");
  }
}

async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}

export async function getDecks() {
  return deckCollection.find({}).toArray();
}

export async function getSets() {
  return setCollection.find({}).toArray();
}

export async function getCardById(id: string) {
  return await deckCollection.findOne({ id: id });
}

export async function updateCard(id: string, card: DeckObj) {
  return await deckCollection.updateOne({ id: id }, { $set: card });
}

export async function connect() {
  try {
    await client.connect();
    await seedDeck();
    await seedSet();
    console.log("Connected to database");
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
  }
}
