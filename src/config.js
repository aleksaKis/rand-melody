export const noteConfig = {
  width: 20,
  border: "#bbb",
  highlight: "#0cc",
  defaultColor: "#333333",
  playedClass: "highlight",
  triggerDelay: 160, // ms
};

export const GRID_CONFIGURATION = {
  columns: 64,
  octaves: 3, // 1 to 3
  getRows() {
    return 8 * this.octaves;
  },
};
