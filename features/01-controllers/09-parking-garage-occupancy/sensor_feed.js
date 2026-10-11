/*
 * sensor_feed.js — plain JavaScript, not a controller
 *
 * Teaches: code outside Stimulus can drive controllers through the
 * application object. The sensor gateway addresses each level by its
 * element id, the way the garage hardware does, and uses
 * application.getControllerForElementAndIdentifier() to reach that
 * level's "parking-level" instance. It never touches the level's markup.
 * The lookup returns null until the level has connected, or after it has
 * been removed, so every reading checks before calling in.
 */
const SENSOR_INTERVAL_MILLISECONDS = 1500
const LEVEL_ELEMENT_IDS = ["level-p1", "level-p2", "level-p3", "level-roof"]

export function startSensorFeed(application, feedToggleButton) {
  let feedTimer = null

  function deliverReading() {
    const levelElement = document.getElementById(pickAtRandom(LEVEL_ELEMENT_IDS))
    const parkingLevel = levelElement
      ? application.getControllerForElementAndIdentifier(levelElement, "parking-level")
      : null
    if (!parkingLevel || parkingLevel.isClosed) return

    const spaceNumber = pickAtRandom(parkingLevel.sensorSpaceNumbers)
    parkingLevel.recordSensorReading(spaceNumber, Math.random() < 0.6)
  }

  function startFeed() {
    feedTimer = window.setInterval(deliverReading, SENSOR_INTERVAL_MILLISECONDS)
    feedToggleButton.textContent = "Pause sensor feed"
  }

  function pauseFeed() {
    window.clearInterval(feedTimer)
    feedTimer = null
    feedToggleButton.textContent = "Resume sensor feed"
  }

  feedToggleButton.addEventListener("click", () => (feedTimer === null ? startFeed() : pauseFeed()))
  startFeed()
}

function pickAtRandom(choices) {
  return choices[Math.floor(Math.random() * choices.length)]
}
