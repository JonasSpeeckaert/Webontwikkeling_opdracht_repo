import * as readline from "readline-sync";
import { mainModule } from "process";
import { DeckObj, SetObj } from "../Interfaces/index";
import { read, realpath } from "fs";

let deckBool: boolean = false;
let setBool: boolean = false;

start();

async function start() {
  let dataDeck: DeckObj[] = await fetchDeck();
  let dataSets: SetObj[] = await fetchSets();

  if (setBool && deckBool) {
    main(dataDeck, dataSets);
  }
}

async function fetchDeck(): Promise<DeckObj[]> {
  let dataDeck: DeckObj[] = [];
  try {
    let responseDeck = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/deck.json",
    );
    dataDeck = await responseDeck.json();
    deckBool = true;
  } catch (err) {
    console.log(`Er is iets misgelopen met het ophalen decklist: ${err}`);
  }
  return dataDeck;
}

async function fetchSets(): Promise<SetObj[]> {
  let dataSets: SetObj[] = [];
  try {
    let responseSets = await fetch(
      "https://raw.githubusercontent.com/JonasSpeeckaert/Webontwikkeling_Milestones/main/sets.json",
    );
    dataSets = await responseSets.json();
    setBool = true;
  } catch (err) {
    console.log(`Er is iets misgelopen met het ophalen setList: ${err}`);
  }
  return dataSets;
}

function main(dataDeck: DeckObj[], dataSets: SetObj[]): void {
  let menuChoices: string[] = [
    "View all cards or sets",
    "Filter by card",
    "Exit",
  ];
  let exit: boolean = false;
  do {
    console.log("Welcome to the MTG decklist viewer!\n");
    let choice: number = readline.keyInSelect(
      menuChoices,
      "What would you like to do? ",
    );
    switch (choice) {
      case 0:
        let viewChoice: number;
        do {
          viewChoice = readline.questionInt(
            "What would you like to see?\n 1. Cards in deck\n 2. Sets used in deck\n 3. exit\n ~~ ",
          );
          if (viewChoice === 1) {
            viewDecklist(dataDeck);
          } else if (viewChoice === 2) {
            viewSetList(dataSets);
          } else if (viewChoice === 3) {
            break;
          } else {
            console.log("Geef een geldige keuze in!");
          }
        } while (viewChoice > 3);
      case 1:
        let filterChoice: number;
        do {
          filterChoice = readline.questionInt(
            "Where do you wanna filter?\n 1. Deck\n 2. Sets\n 3. exit\n ~~ ",
          );
          if (filterChoice === 1) {
            filterDeck(dataDeck);
          } else if (filterChoice === 2) {
            filterSets(dataSets);
          } else if (filterChoice === 3) {
            break;
          } else {
            console.log("Geef een geldige keuze in!");
          }
        } while (filterChoice > 3);
        break;
      case 2:
        exit = true;
        break;
      default:
        break;
    }
  } while (!exit);
}

function viewDecklist(dataDeck: DeckObj[]): void {
  let deckList: DeckObj[] = dataDeck;
  deckList.forEach((el) => {
    console.log(`-- ${el.name} --\n
 - Mana Value: ${el.manaValue}
 - Image: ${el.imagePath}
 - Description: ${el.description}\n
 - Types: ${el.types}
 - Rarity: ${el.rarity}
 - Legendary: ${el.isLegendary}\n
 - Cardset: ${el.cardSet}
 - ${el.id}
 - Released: ${el.releaseDate}\n  ~-----------------------------~`);
  });
}

function viewSetList(dataSets: SetObj[]): void {
  let setList: SetObj[] = dataSets;
  setList.forEach((el) => {
    console.log(`-- ${el.name} --\n
    - Logo: ${el.logoUrl}\n
    - Setcode: ${el.code}
    - ID: ${el.id}
    - Legal in standard: ${el.isStandardLegal}\n ~-----------------------------~`);
  });
  1;
}

function filterDeck(dataDeck: DeckObj[]) {
  let filterChoice: number = readline.questionInt(
    "What filter do you wanna use:\n1. name\n2. manaValue\n3. id\n ~~ ",
  );
  let foundCard: DeckObj | undefined;
  let foundCardArr: DeckObj[] | undefined;
  switch (filterChoice) {
    case 1:
      let filterName: string = readline.question(
        "What name do you wanna search: ",
      );
      foundCard = dataDeck.find((el) => el.name === filterName);
      if (foundCard === undefined) {
        console.log(`Did not find ${filterName}`);
      } else {
        console.log(`-- ${foundCard.name} --\n
    - Mana Value: ${foundCard.manaValue}
    - Image: ${foundCard.imagePath}
    - Description: ${foundCard.description}\n
    - Types: ${foundCard.types}
    - Rarity: ${foundCard.rarity}
    - Legendary: ${foundCard.isLegendary}\n
    - Cardset: ${foundCard.cardSet}
    - ${foundCard.id}
    - Released: ${foundCard.releaseDate}\n  ~-----------------------------~`);
      }
      break;
    case 2:
      let filterMana: number = readline.questionInt(
        "What mana value does your card have: ",
      );
      foundCardArr = dataDeck.filter(
        (search) => search.manaValue === filterMana,
      );
      if (foundCardArr[0] === undefined) {
        console.log(`Did not find cards with manavalue: ${filterMana}`);
      } else {
        foundCardArr.forEach((el) => {
          console.log(`-- ${el.name} --\n
    - Mana Value: ${el.manaValue}
    - Image: ${el.imagePath}
    - Description: ${el.description}\n
    - Types: ${el.types}
    - Rarity: ${el.rarity}
    - Legendary: ${el.isLegendary}\n
    - Cardset: ${el.cardSet}
    - ${el.id}
    - Released: ${el.releaseDate}\n  ~-----------------------------~`);
        });
      }

      break;
    case 3:
      let filterId: string = readline.question(
        "Choose an ID that you wanna search ex.CARD-001: ",
      );
      foundCard = dataDeck.find((el) => el.id === filterId);
      if (foundCard === undefined) {
        console.log(`Did not find card with ${filterId}`);
      } else {
        console.log(`-- ${foundCard.name} --\n
    - Mana Value: ${foundCard.manaValue}
    - Image: ${foundCard.imagePath}
    - Description: ${foundCard.description}\n
    - Types: ${foundCard.types}
    - Rarity: ${foundCard.rarity}
    - Legendary: ${foundCard.isLegendary}\n
    - Cardset: ${foundCard.cardSet}
    - ${foundCard.id}
    - Released: ${foundCard.releaseDate}\n  ~-----------------------------~`);
      }
      break;
    default:
      break;
  }
}

function filterSets(dataSets: SetObj[]) {
  let filterChoice: number = readline.questionInt(
    "What filter do you wanna use:\n1. name\n2. Standard Legal \n3. code\n ~~ ",
  );
  let foundCard: SetObj | undefined;
  let foundCardArr: SetObj[] | undefined;

  switch (filterChoice) {
    case 1:
      let filterName: string = readline.question(
        "What setname do you wanna search: ",
      );
      foundCard = dataSets.find((el) => el.name === filterName);
      if (foundCard === undefined) {
        console.log(`Did not find ${filterName}`);
      } else {
        console.log(`-- ${foundCard.name} --\n
    - Logo: ${foundCard.logoUrl}\n
    - Setcode: ${foundCard.code}
    - ID: ${foundCard.id}
    - Legal in standard: ${foundCard.isStandardLegal}\n ~-----------------------------~`);
      }
      break;
    case 2:
      let setLegal: string = readline.question(
        "Is the set you are searching standard legal? Y/N \n ~~ "
      );
      setLegal = setLegal.toUpperCase();
      if (setLegal === "Y") {
        foundCardArr = dataSets.filter(
          (search) => search.isStandardLegal === true,
        );
      } else {
        foundCardArr = dataSets.filter(
          (search) => search.isStandardLegal === false,
        );
      }
      foundCardArr.forEach((el) => {
        console.log(`-- ${el.name} --\n
    - Logo: ${el.logoUrl}\n
    - Setcode: ${el.code}
    - ID: ${el.id}
    - Legal in standard: ${el.isStandardLegal}\n ~-----------------------------~`);
      });
      break;
    case 3:
      let filterCode: string = readline.question(
        "Choose an code that you wanna search ex.LTR || VOW: ",
      );
      foundCard = dataSets.find((el) => el.code === filterCode);
      if (foundCard === undefined) {
        console.log(`Did not find ${filterCode}`);
      } else {
        console.log(`-- ${foundCard.name} --\n
    - Logo: ${foundCard.logoUrl}\n
    - Setcode: ${foundCard.code}
    - ID: ${foundCard.id}
    - Legal in standard: ${foundCard.isStandardLegal}\n ~-----------------------------~`);
      }
      break;

    default:
      break;
  }
}
