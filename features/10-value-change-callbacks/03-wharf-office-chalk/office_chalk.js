/*
 * office_chalk.js
 *
 * Not a Stimulus controller. The wharf office writes the berth card
 * the way a script, or the elements panel, would: setAttribute on the
 * value attributes. The berth controller never sees this file except
 * by calling chalkBerth.
 */

export function chalkBerth(card, berthName, draftFeet) {
  card.setAttribute("data-berth-chalk-berth-name-value", berthName)
  card.setAttribute("data-berth-chalk-draft-feet-value", String(draftFeet))
}
