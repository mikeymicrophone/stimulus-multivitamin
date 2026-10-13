/*
 * retort_office.js
 *
 * Not a Stimulus controller. The cannery office writes the retort
 * temperature onto the attribute, the way another script or the
 * elements panel would.
 */

export function setRetortTemperature(retort, temperature) {
  retort.setAttribute("data-retort-chart-temperature-value", String(temperature))
}
