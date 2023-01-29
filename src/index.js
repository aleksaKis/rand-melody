import { sleep } from "./utils.js";
import { NOTE_CONFIGURATION, GRID_CONFIGURATION } from "./config.js";

const PLAY_RELEASE = 105; // ms
const grid = document.getElementById("grid");

grid.style.display = "grid";
grid.style.gridTemplateColumns = `repeat(${GRID_CONFIGURATION.columns}, ${NOTE_CONFIGURATION.width}px)`;
grid.style.gridTemplateRows = `repeat(${GRID_CONFIGURATION.rows}, ${NOTE_CONFIGURATION.width}px)`;

function play() {
  startLink().then();
}

function getItemName(index) {
  return "NOTE_" + index;
}

function buildGrid() {
  for (
    let i = 0;
    i < GRID_CONFIGURATION.rows * GRID_CONFIGURATION.columns;
    i++
  ) {
    const item = document.createElement("div");
    item.id = getItemName(i);
    item.style.border = `1px solid ${NOTE_CONFIGURATION.border}`;
    item.style.backgroundColor = NOTE_CONFIGURATION.defaultColor;
    grid.append(item);
  }
}

function generateSequence() {
  const sequence = Array(GRID_CONFIGURATION.columns);
  for (let i = 0; i < GRID_CONFIGURATION.columns; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      sequence[i] = null;
    } else {
      sequence[i] = Math.ceil(Math.random() * GRID_CONFIGURATION.rows);
    }
  }
  return sequence;
}

function getNotePosition(coords) {
  const [x, y] = coords;
  return y + (x - 1) * GRID_CONFIGURATION.columns;
}

async function playNote(coords) {
  const note = document.getElementById(getItemName(getNotePosition(coords)));
  note.style.backgroundColor = NOTE_CONFIGURATION.highlight;
  const octave = Math.ceil(coords[0] / 8) + 2; // octaves are from 3 to 5
  const tone = Math.ceil(coords[0] / 3);
  await playSound(getToneName(tone) + octave);
}

async function playSound(note) {
  const noteAudio = new Audio(`./data/notes/${note}.mp3`);
  await noteAudio.play(console.log.bind(this));
}

async function startLink() {
  const sequence = generateSequence();
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i]) playNote([sequence[i], i]);
    await sleep(PLAY_RELEASE);
  }
}

function getToneName(index) {
  switch (index) {
    case 1:
      return "a";
    case 2:
      return "b";
    case 3:
      return "c";
    case 4:
      return "d";
    case 5:
      return "e";
    case 6:
      return "f";
    case 7:
      return "g";
    case 8:
      return "a";
  }
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    play();
  }
});

document.getElementById("play").addEventListener("click", play);
buildGrid();
