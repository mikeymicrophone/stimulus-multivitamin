/*
 * noaa_correction.js
 *
 * Not a Stimulus controller. A correction from the tide office writes
 * the height attribute directly, the way another script or the elements
 * panel would.
 */

export function correctHeight(board, feet) {
  board.setAttribute("data-inlet-board-height-value", String(feet))
}
