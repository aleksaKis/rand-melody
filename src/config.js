export const noteConfig = {
  width: 10,
  border: "#bbb",
  highlight: "#0cc",
  defaultColor: "#333333",
  playedClass: "highlight",
  triggerDelay: 135, // ms
};

export const grid_config = {
  columns: 128,
  octaves: 3, // 1 to 3
  getRows() {
    return 8 * this.octaves;
  },
};
