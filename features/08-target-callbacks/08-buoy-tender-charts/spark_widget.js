/*
 * spark_widget.js
 *
 * A small chart object the buoy tender treats as a third-party widget.
 * The controller creates one per buoy and calls destroy() when that
 * buoy stops being a target. Nothing here knows about Stimulus.
 */
export class SparkWidget {
  constructor(buoy) {
    this.buoy = buoy
    this.canvas = buoy.querySelector("canvas")
    this.generation = Number(buoy.dataset.widgetGeneration || "0") + 1
    buoy.dataset.widgetGeneration = String(this.generation)
    delete buoy.dataset.widgetDestroyed
    this.draw()
  }

  draw() {
    const canvas = this.canvas
    const context = canvas.getContext("2d")
    const readings = this.buoy.dataset.readings.split(",").map((reading) => Number(reading))
    const width = canvas.width
    const height = canvas.height
    context.clearRect(0, 0, width, height)
    context.strokeStyle = "#1f3d2b"
    context.lineWidth = 2
    context.beginPath()
    readings.forEach((reading, index) => {
      const plotX = (index / (readings.length - 1)) * (width - 8) + 4
      const plotY = height - 4 - (reading / 5) * (height - 8)
      if (index === 0) context.moveTo(plotX, plotY)
      else context.lineTo(plotX, plotY)
    })
    context.stroke()
    const caption = this.buoy.querySelector("[data-widget-caption]")
    caption.textContent = `Spark ${this.generation} for ${this.buoy.dataset.buoyName}`
  }

  destroy() {
    const context = this.canvas.getContext("2d")
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.buoy.dataset.widgetDestroyed = "yes"
    this.buoy.querySelector("[data-widget-caption]").textContent = `${this.buoy.dataset.buoyName} spark cleared`
  }
}
