import { sleep } from "./utils.js";
import { noteConfig, GRID_CONFIGURATION } from "./config.js";

const PLAY_KEYWORD = "play";
const PAUSE_KEYWORD = "pause";

const grid = document.getElementById("grid");
grid.style.display = "grid";
grid.style.gridTemplateColumns = `repeat(${GRID_CONFIGURATION.columns}, ${noteConfig.width}px)`;
grid.style.gridTemplateRows = `repeat(${GRID_CONFIGURATION.getRows()}, ${
  noteConfig.width
}px)`;

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    togglePlay();
  }
});

document.getElementById("play").addEventListener("click", togglePlay);
buildGrid();

function togglePlay() {
  const playButton = document.getElementById("play");
  if (playButton.textContent === PLAY_KEYWORD) handlePlay();
  else handlePause();
}

function handlePlay() {
  document.getElementById("play").textContent = PAUSE_KEYWORD;
  clearGrid();
  startLink().then(handlePause);
}

function handlePause() {
  document.getElementById("play").textContent = PLAY_KEYWORD;
}

function clearGrid() {
  Array.from(document.getElementsByClassName(noteConfig.highlight)).forEach(
    (el) => (el.style.backgroundColor = noteConfig.defaultColor)
  );
}

function getItemName(index) {
  return "NOTE_" + index;
}

function buildGrid() {
  for (
    let i = 0;
    i < GRID_CONFIGURATION.getRows() * GRID_CONFIGURATION.columns;
    i++
  ) {
    const item = document.createElement("div");
    item.id = getItemName(i);
    item.style.border = `1px solid ${noteConfig.border}`;
    item.style.backgroundColor = noteConfig.defaultColor;
    grid.append(item);
  }
}

function generateSequence() {
  const sequence = Array(GRID_CONFIGURATION.columns);
  for (let i = 0; i < GRID_CONFIGURATION.columns; i++)
    sequence[i] = getSequenceValue(i);
  return sequence;
}

function getSequenceValue(i) {
  console.log(i);
  // add swing
  if (i !== 0 && i % 7 === 0 && i % 3 === 0) return null;

  return Math.ceil(Math.random() * GRID_CONFIGURATION.getRows());
}

function getNotePosition(coords) {
  const [x, y] = coords;
  return y + (x - 1) * GRID_CONFIGURATION.columns;
}

async function playNote(coords) {
  const note = document.getElementById(getItemName(getNotePosition(coords)));

  note.classList = noteConfig.highlight;
  note.style.backgroundColor = noteConfig.highlight;

  const octave = Math.ceil(coords[0] / 8) + 2; // octaves are from 3 to 5
  const tone = Math.ceil(coords[0] / GRID_CONFIGURATION.octaves);
  await playSound(getToneName(tone) + octave);
}

async function playSound(note) {
  const noteAudio = new Audio(`./data/notes/${note}.mp3`);
  await noteAudio.play();
  noteAudio.remove();
}

async function startLink() {
  const sequence = generateSequence();
  for (let i = 0; i < sequence.length; i++) {
    // Handle pause
    if (document.getElementById("play").textContent === PLAY_KEYWORD) break;

    if (sequence[i]) playNote([sequence[i], i]);
    await sleep(noteConfig.triggerDelay);
  }
}

/**
 * Finds a note based on it's position in scale.
 * @param {number} index
 * @returns a minor scale note
 */
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
    default:
      return "c";
  }
}
