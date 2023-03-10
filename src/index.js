import { noteConfig, grid_config } from "./config.js";
import { HIGHLIGHTED_CLASS, highlightColors } from "./style/constants.js";
import { getToneName, getItemId, sleep } from "./utils.js";

const PLAY_KEYWORD = "play";
const PAUSE_KEYWORD = "pause";
const PLAY_BUTTON_ID = "_play";

/**
 * Inject notes grid into the DOM, setup columns based on grid configuration.
 */
(function initiateGrid() {
  function buildGrid() {
    for (let i = 0; i < grid_config.getRows() * grid_config.columns; i++) {
      const item = document.createElement("div");
      item.id = getItemId(i);
      item.className = "note";
      grid.append(item);
    }
  }

  const grid = document.getElementById("grid");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = `repeat(${grid_config.columns}, ${noteConfig.width}px)`;
  grid.style.gridTemplateRows = `repeat(${grid_config.getRows()}, ${
    noteConfig.width
  }px)`;
  buildGrid();
})();

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    togglePlay();
  }
});
document.getElementById(PLAY_BUTTON_ID).addEventListener("click", togglePlay);

/**
 * Clears highlighted notes from grid
 * @returns void
 */
function clearGrid() {
  Array.from(document.getElementsByClassName(HIGHLIGHTED_CLASS)).forEach(
    (el) => (el.style.backgroundColor = noteConfig.defaultColor)
  );
}

/**
 * Enable/Disable music depending on the state of the play button.
 */
function togglePlay() {
  const playButton = document.getElementById(PLAY_BUTTON_ID);
  if (playButton.textContent === PLAY_KEYWORD) handlePlay();
  else handlePause();
}

function handlePlay() {
  document.getElementById(PLAY_BUTTON_ID).textContent = PAUSE_KEYWORD;
  clearGrid();
  startLink().then(handlePause);
}

function handlePause() {
  document.getElementById(PLAY_BUTTON_ID).textContent = PLAY_KEYWORD;
}

async function startLink() {
  const sequence = generateSequence();
  for (let i = 0; i < sequence.length; i++) {
    if (document.getElementById(PLAY_BUTTON_ID).textContent === PLAY_KEYWORD)
      break;
    if (!sequence[i]) continue;
    for (let note of sequence[i]) {
      playNote([note, i]);
      // Handle pause
    }
    await sleep(noteConfig.triggerDelay);
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
  if (i !== 0 && i % 6 === 0) return null;
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
  note.style.backgroundColor = highlightColors[Math.floor(Math.random() * 3)];
  note.classList.add(HIGHLIGHTED_CLASS);
  const octave = Math.ceil(coords[0] / 8) + 2; // octaves are from 3 to 5
  const tone = Math.ceil(coords[0] / grid_config.octaves);
  playSound(getToneName(tone) + octave);
}

async function playSound(note) {
  const noteAudio = new Audio(`./data/notes/${note}.mp3`);
  await noteAudio.play();
  noteAudio.remove();
}
