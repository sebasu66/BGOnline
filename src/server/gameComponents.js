/*this class will hold the definition of every fisical component on the boardgame
it represents the game box, this collection will be leaded from a file on each game definition
and it's not expected to change during the game, component types include: cards, boards, token, coins, cards, miniatures, tiles*/

/*
let defaultCardProperties = {
    "type": "card",
    group:"mainDeck",
    stroke: "rgb(0,0,10)",
    strokeWidth: 5,
    shadow: "rgba(0,0,0,0.5) 10px 10px 10px",
    selectable: true,
    backImage: "/resources/games/Root_ES/cards/back.png",
    flipeable: true,
    flipped: false,
    scale: 1,
    owner:null,
};
*/

/*
const componentList=[
    {
        "id": "card001",
        "name": "Card 001",
        "image": "/resources/games/Root_ES/cards/f0.png",
        "properties": defaultCardProperties,
        "currentCanvas": null
    },
    {
        "id": "card002",
        "name": "Card 002",
        "image": "/resources/games/Root_ES/cards/f1.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card003",
        "name": "Card 003",
        "image": "/resources/games/Root_ES/cards/f2.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card004",
        "name": "Card 004",
        "image": "/resources/games/Root_ES/cards/f3.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card005",
        "name": "Card 005",
        "image": "/resources/games/Root_ES/cards/f4.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card006",
        "name": "Card 006",
        "image": "/resources/games/Root_ES/cards/f5.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card007",
        "name": "Card 007",
        "image": "/resources/games/Root_ES/cards/f6.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card008",
        "name": "Card 008",
        "image": "/resources/games/Root_ES/cards/f7.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card009",
        "name": "Card 009",
        "image": "/resources/games/Root_ES/cards/f8.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card010",
        "name": "Card 010",
        "image": "/resources/games/Root_ES/cards/f9.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card011",
        "name": "Card 011",
        "image": "/resources/games/Root_ES/cards/f10.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card012",
        "name": "Card 012",
        "image": "/resources/games/Root_ES/cards/f11.png",
        "properties": defaultCardProperties,
    },
    {
        "id": "card013",
        "name": "Card 013",
        "image": "/resources/games/Root_ES/cards/f12.png",
        "properties": defaultCardProperties,
    }
]
*/

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';

function scanGameFolder(path) {
  const gameData = { components: {}, errors: [] };
  const componentTypes = ['TABLE', 'BOARD', 'GAMEBOX', 'TOKEN', 'MONEY', 'CARD', 'DECK', 'DICE'];

  const entries = readdirSync(path);

  for (const entry of entries) {
    const fullPath = path + '/' + entry;
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // Check if it's a valid component type folder
      if (!componentTypes.includes(entry)) {
        gameData.errors.push(`Invalid component type: ${entry}`);
        continue;
      }

      // Parse component data
      const componentData = parseComponentFolder(fullPath);
      if (componentData.errors.length) {
        gameData.errors.push(...componentData.errors);
        continue;
      }

      gameData.components[entry] = componentData;
    } else {
      gameData.errors.push(`Unexpected file in game folder: ${entry}`);
      continue;
    }
  }
  console.log("SCAN_GAME_FOLDER() gameData:", JSON.stringify(gameData, null, 2));
  return gameData;
}

function parseComponentFolder(path) {
  let componentData = { name: "", errors: [], files: [], properties: {} };
  const entries = readdirSync(path);

  for (const entry of entries) {
    const fullPath = path + '/' + entry;
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      //there should be a subfolder for each group
      componentData.name = entry
      componentData = parseFiles(fullPath, componentData)
    }
    else {
      componentData.errors.push(`Unexpected file in game folder: ${entry}`);
      continue;
    }
  }
  return componentData;
}

function parseFiles(path, componentData) {
  const definitionPath = path + '/ComponentDefinition.json';
  try {
    componentData.properties = JSON.parse(readFileSync(definitionPath, 'utf8'));
  } catch (error) {
    componentData.errors.push(`Error parsing` + definitionPath + `:  ${error}`);
  }

  const entries = readdirSync(path);

  for (const entry of entries) {
    const fullPath = path + '/' + entry;
    const stats = statSync(fullPath);

    if (!stats.isDirectory()) {
      //there should be media files
      componentData.files.push(entry)
    }
  }

  return componentData;
}




function getComponentList(gameID) {

  console.log("GET_COMPONENT_LIST() Current directory:", process.cwd());

  const gamePath = './GAMES/' + gameID;
  const gameData = scanGameFolder(gamePath);

  if (gameData.errors.length) {
    console.error(`Errors loading game ${gameID}:`, gameData.errors);
  } else {
    console.log(`Successfully loaded game ${gameID}:`, gameData.components);
  }

  return gameData

}

export { getComponentList }