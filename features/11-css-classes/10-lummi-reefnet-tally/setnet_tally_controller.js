/*
 * setnet_tally_controller.js — registered as "setnet-tally"
 *
 * Teaches: a subclass that does not declare static classes still
 * inherits overLimit. The attribute is data-setnet-tally-over-limit-class.
 * soakedClass is not defined on this class.
 */
import GillnetTallyController from "./gillnet_tally_controller.js"

export default class extends GillnetTallyController {}
