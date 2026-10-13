/*
 * tape.js
 *
 * Appends one line to the elevator tape. The placeholder
 * stays until the first real line.
 */
export function writeTape(line) {
  const tape = document.getElementById("elevator-tape")
  const prior = tape.dataset.started === "yes" ? tape.textContent : ""
  tape.dataset.started = "yes"
  tape.textContent = prior ? `${prior} ${line}` : line
}
