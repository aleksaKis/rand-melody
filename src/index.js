"use-strict";

const NUMBER_OF_COLUMNS = 32;
const NUMBER_OF_ROWS = 8;
const ITEM_WIDTH = 20;
const ITEM_BORDER_COLOR = "#bbb";
const ITEM_HIGHLIGHTED = "#0cc";
const ITEM_DEFAULT_BACKGROUND = "transparent";
const PLAY_RELEASE = 2000; // ms
const grid = document.getElementById("grid");

grid.style.display = "grid";
grid.style.gridTemplateColumns = `repeat(${NUMBER_OF_COLUMNS}, ${ITEM_WIDTH}px)`;
grid.style.gridTemplateRows = `repeat(${NUMBER_OF_ROWS}, ${ITEM_WIDTH}px)`;

const getItemName = (index) => {
  return "ITEM_" + index;
};

const buildGrid = () => {
  for (let i = 0; i < NUMBER_OF_ROWS * NUMBER_OF_COLUMNS; i++) {
    const item = document.createElement("div");
    item.id = getItemName(i);
    item.style.border = `1px solid ${ITEM_BORDER_COLOR}`;
    grid.append(item);
  }
};

const generateSequence = () => {
  const sequence = Array(NUMBER_OF_COLUMNS);
  for (let i = 0; i < NUMBER_OF_COLUMNS; i++) {
    sequence[i] = Math.ceil(Math.random() * NUMBER_OF_ROWS);
  }
  return sequence;
};

function getNotePosition(coords) {
  const [x, y] = coords;
  return y + (x - 1) * NUMBER_OF_COLUMNS;
}

const playNote = async (coords) => {
  const note = document.getElementById(getItemName(getNotePosition(coords)));
  note.style.backgroundColor = ITEM_HIGHLIGHTED;
  return setTimeout(() => {
    note.style.backgroundColor = ITEM_DEFAULT_BACKGROUND;
  }, PLAY_RELEASE);
};

const startLink = async () => {
  const sequence = generateSequence();
  for (let i = 0; i < sequence.length; i++) {
    await playNote([sequence[i], i]);
  }
};

buildGrid();
startLink().then();
