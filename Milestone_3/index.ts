import express from "express";
import ejs from "ejs";
import { DeckObj, SetObj } from "../Interfaces/index";
import { getSpotlight } from "./helperFunctions";
import { connect, getDecks, getSets } from "./database";
import session from "./session";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { loginRouter } from "./routers/loginRouter";
import { cardRouter } from "./routers/cardRouter";
import { setRouter } from "./routers/setRouter";
import { flashMiddleware } from "./middleware/flashMiddleware";

const app = express();

let deckData: DeckObj[];
let setData: SetObj[];

app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session);

app.use((req, res, next) => {
  res.locals.user = req.session.user ?? null;
  next();
}); //checkt of gebruiker aangemeld is om dan de locals.user de user te geven die in de session zit. zo wordt de dashboard link toegevoegd op andere paginas en niet enkel op de dashboard pagina

app.use(flashMiddleware);
app.use(loginRouter());
app.use(cardRouter());
app.use(setRouter());

app.get("/", (req, res) => {
  const { spotlight, prices, cardConditions } = getSpotlight(deckData);
  res.render("index", { spotlight, prices, cardConditions });
});

app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.render("404");
});

app.listen(app.get("port"), async () => {
  console.log("Server started on http://localhost:" + app.get("port"));
  await connect();
  deckData = await getDecks();
  setData = await getSets();
});
