export const noteConfig = {
  width: 20,
  border: "#3a3a3a7a",
  highlight: "#E5C3D1",
  defaultColor: "#2D2E2E", // jet
  playedClass: "highlight",
  triggerDelay: 135, // ms
};

export const grid_config = {
  columns: 64,
  octaves: 3, // 1 to 3
  getRows() {
    return 8 * this.octaves;
  },
};
