import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DeckObj, SetObj, User } from "../Interfaces/index";
import {
  getSpotlight,
  randomPrice,
  fetchDeck,
  fetchSets,
} from "./helperFunctions";
import bcrypt from "bcrypt";
import { error } from "console";

dotenv.config();

const saltRounds: number = 10;
let deckData: DeckObj[];
let setData: SetObj[];

export const client = new MongoClient(process.env.CONNECTION_STRING!);
const deckCollection = client
  .db("Milestone")
  .collection<DeckObj>("deck_collection");
const setCollection = client
  .db("Milestone")
  .collection<SetObj>("sets_collection");

export const userCollection = client
  .db("Milestone")
  .collection<User>("user_collection");

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

async function createInitialUsers() {
  if ((await userCollection.countDocuments()) >= 2) {
    return;
  }
  let adminUsername: string | undefined = process.env.ADMIN_USERNAME;
  let adminPassword: string | undefined = process.env.ADMIN_PASSWORD;
  let userUsername: string | undefined = process.env.USER_USERNAME;
  let userPassword: string | undefined = process.env.USER_PASSWORD;
  if (!adminPassword || !adminUsername || !userUsername || !userPassword) {
    throw new Error(
      "ADMIN_USERNAME, ADMIN_PASSWORD, USER_USERNAME, USER_PASSWORD can't be UNDEFINED",
    );
  }
  await userCollection.insertMany([
    {
      username: adminUsername,
      password: await bcrypt.hash(adminPassword, saltRounds),
      role: "ADMIN",
    },
    {
      username: userUsername,
      password: await bcrypt.hash(userPassword, saltRounds),
      role: "USER",
    },
  ]);
}

export async function login(username: string, password: string) {
  if (username === "" || password === "") {
    throw new Error("Username and Password required");
  }
  let user: User | null = await userCollection.findOne({ username: username });
  if (user) {
    if (await bcrypt.compare(password, user.password!)) {
      return user;
    } else {
      throw new Error("Incorrect password");
    }
  } else {
    throw new Error("User not found");
  }
}

export async function createUser(user: User) {
  if (user.username === "" || user.password === "") {
    throw new Error("Username and Password required");
  }
  const existingUser = await userCollection.findOne({username : user.username})
  if(existingUser){
    throw new Error("username bestaat al")
  }
  user.password = await bcrypt.hash(user.password!, saltRounds);
  return await userCollection.insertOne(user);
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
    await createInitialUsers();
    console.log("Connected to database");
    process.on("SIGINT", exit);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
