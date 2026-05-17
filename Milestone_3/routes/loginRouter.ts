import express from "express";
import { secureMiddleware } from "../secureMiddelware";
import { DeckObj, User } from "../../Interfaces";
import { login, getDecks, createUser } from "../database";
import { flashMiddleware } from "../flashMiddelware";

export function loginRouter() {
  const router = express.Router();

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    try {
      let user: User = await login(username, password);
      delete user.password;
      req.session.user = user;
      res.redirect("/dashboard");
    } catch (e: any) {
      req.session.flashMessage = { type: "error", message: e.message };
      res.redirect("/login");
    }
  });

  router.get("/register", async (req, res) => {
    res.render("register");
  });

  router.post("/register", async (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    let role;
    try {
      let user: User = {
        username: username,
        password: password,
        role: "USER",
      };
      await createUser(user);
      res.redirect("/login");
    } catch (e: any) {
      req.session.flashMessage = { type: "error", message: e.message };
      res.redirect("/register");
    }
  });

  router.post("/logout", secureMiddleware, async (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });

  router.get("/dashboard", secureMiddleware, async (req, res) => {
    let deckData: DeckObj[] = await getDecks();
    req.session.flashMessage = { type: "success", message: "Login successful" };
    res.render("dashboard", { user: req.session.user, deckData });
  });

  return router;
}
