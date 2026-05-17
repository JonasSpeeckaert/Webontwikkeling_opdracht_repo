import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import MongoStore from 'connect-mongo';
import { User, FlashMessage } from "../Interfaces";

declare module 'express-session' {
    export interface SessionData {
        user? : User;
        flashMessage : FlashMessage;
    }
}

const mongoStore = MongoStore.create({
    mongoUrl: process.env.CONNECTION_STRING,
    dbName: "Milestone",
    collectionName: "LoginCollection"     
});

mongoStore.on("error", (error) => {
    console.error(error);
});

export default session({
    secret: process.env.SESSION_SECRET ?? "password_to_session",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});