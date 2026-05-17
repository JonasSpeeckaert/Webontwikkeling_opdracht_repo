import { ObjectId } from "mongodb";

export interface SetObj {
  id: string;
  name: string;
  code: string;
  releaseYear: number;
  isStandardLegal: boolean;
  logoUrl: string;
}

export interface DeckObj {
  id: string;
  name: string;
  description: string;
  manaValue: number;
  isLegendary: boolean;
  releaseDate: string;
  imageUrl: string;
  imagePath: string;
  rarity: string;
  types: string[];
  cardSet: SetObj;
}

export interface User {
  _id?: ObjectId;
  username: string;
  password?: string;
  role: "ADMIN" | "USER";
}

export interface FlashMessage {
    type: "error" | "success"
    message: string;
}
