import { sleep } from "./utils.js";
import { noteConfig, grid_config } from "./config.js";

const PLAY_KEYWORD = "play";
const PAUSE_KEYWORD = "pause";

const grid = document.getElementById("grid");
grid.style.display = "grid";
grid.style.gridTemplateColumns = `repeat(${grid_config.columns}, ${noteConfig.width}px)`;
grid.style.gridTemplateRows = `repeat(${grid_config.getRows()}, ${
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

function getItemId(index) {
  return "NOTE_" + index;
}

function buildGrid() {
  for (let i = 0; i < grid_config.getRows() * grid_config.columns; i++) {
    const item = document.createElement("div");
    item.id = getItemId(i);
    item.style.border = `1px solid ${noteConfig.border}`;
    item.style.backgroundColor = noteConfig.defaultColor;
    grid.append(item);
  }
}

function generateSequence() {
  const sequence = Array(grid_config.columns);
  for (let i = 0; i < grid_config.columns; i++)
    sequence[i] = getSequenceValue(i);

  return sequence;
}

function getSequenceValue(i) {
  // add swing
  if (i !== 0 && i % 7 === 0 && i % 3 === 0) return null;
  if (i % 8 === 0) return [getRandomNotePosition(), getRandomNotePosition()];

  return [getRandomNotePosition()];
}

function getRandomNotePosition() {
  return Math.ceil(Math.random() * grid_config.getRows());
}

function getNoteIndex(coords) {
  const [x, y] = coords;
  return y + (x - 1) * grid_config.columns;
}

function playNote(coords) {
  const note = document.getElementById(getItemId(getNoteIndex(coords)));

  note.classList = noteConfig.highlight;
  note.style.backgroundColor = noteConfig.highlight;

  const octave = Math.ceil(coords[0] / 8) + 2; // octaves are from 3 to 5
  const tone = Math.ceil(coords[0] / grid_config.octaves);
  playSound(getToneName(tone) + octave);
}

async function playSound(note) {
  const noteAudio = new Audio(`./data/notes/${note}.mp3`);
  await noteAudio.play();
  noteAudio.remove();
}

async function startLink() {
  const sequence = generateSequence();
  for (let i = 0; i < sequence.length; i++) {
    if (document.getElementById("play").textContent === PLAY_KEYWORD) break;
    if (!sequence[i]) continue;
    for (let note of sequence[i]) {
      playNote([note, i]);
      // Handle pause
    }
    await sleep(noteConfig.triggerDelay);
  }
}

/**
 * Finds a note based on it's position in scale.
 * @param {number} index
 * @returns b major scale note
 */
function getToneName(index) {
  switch (index) {
    case 1:
      return "b";
    case 2:
      return "c-";
    case 3:
      return "d-";
    case 4:
      return "e";
    case 5:
      return "f-";
    case 6:
      return "g-";
    case 7:
      return "a-";
    case 8:
      return "b";
    default:
      return "b";
  }
}
