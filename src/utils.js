export function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function getItemId(index) {
  return "NOTE_" + index;
}

/**
 * Finds a note based on it's position in scale.
 * @param {number} index
 * @returns b major scale note
 */
export function getToneName(index) {
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
