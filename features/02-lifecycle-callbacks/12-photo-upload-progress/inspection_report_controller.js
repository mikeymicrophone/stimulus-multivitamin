/*
 * inspection_report_controller.js — registered as "inspection-report"
 *
 * Teaches: re-rendering a list of controllers. The report rebuilds its whole
 * photo list from the upload queue whenever photos are added, removed, or
 * regrouped, the way a server-rendered partial or a morph would. Every
 * rebuild disconnects every photo-upload row and connects new ones, and
 * nothing is lost because the uploads, their progress, and their rooms live
 * in the queue, keyed by id. The report watches the queue while connected
 * and stops when it disconnects.
 */
import { Controller } from "@hotwired/stimulus"
import { forgetUpload, listUploads, startUpload, watchQueue } from "./upload_queue.js"

export default class extends Controller {
  static targets = ["fileInput", "photoList", "photoTemplate", "groupByRoom", "summary", "sendButton", "reportBody"]
  static values = { samplePhotos: Array }

  connect() {
    this.queueListeners = new AbortController()
    watchQueue(() => this.renderSummary(), { signal: this.queueListeners.signal })
    this.renderPhotoList()
  }

  disconnect() {
    this.queueListeners.abort()
  }

  addPhotos() {
    for (const file of this.fileInputTarget.files) startUpload(file)
    this.fileInputTarget.value = ""
    this.renderPhotoList()
  }

  async addSamplePhotos() {
    for (const { fileName, caption, room, tone } of this.samplePhotosValue) {
      startUpload(await drawSamplePhoto(fileName, caption, tone), { room })
    }
    this.renderPhotoList()
  }

  removePhoto(event) {
    const row = event.target.closest('[data-controller~="photo-upload"]')
    forgetUpload(row.dataset.photoUploadUploadIdValue)
    this.renderPhotoList()
  }

  regroup() {
    this.renderPhotoList()
  }

  async sendReport() {
    const response = await fetch("report-sent.html")
    if (!response.ok) {
      this.summaryTarget.textContent = `The office server answered ${response.status}. Try again.`
      return
    }
    this.reportBodyTarget.innerHTML = await response.text()
  }

  renderPhotoList() {
    const uploads = listUploads()
    if (!this.groupByRoomTarget.checked) {
      this.photoListTarget.replaceChildren(...uploads.map((upload) => this.buildRow(upload)))
    } else {
      const rooms = [...new Set(uploads.map((upload) => upload.room))].sort()
      this.photoListTarget.replaceChildren(...rooms.flatMap((room) => {
        const heading = document.createElement("li")
        heading.className = "room-heading"
        heading.textContent = room
        return [heading, ...uploads.filter((upload) => upload.room === room).map((upload) => this.buildRow(upload))]
      }))
    }
    this.renderSummary()
  }

  buildRow(upload) {
    const row = this.photoTemplateTarget.content.firstElementChild.cloneNode(true)
    row.dataset.photoUploadUploadIdValue = upload.uploadId
    return row
  }

  renderSummary() {
    if (!this.hasSummaryTarget) return
    const uploads = listUploads()
    const countWith = (status) => uploads.filter((upload) => upload.status === status).length
    const parts = [`${uploads.length} ${uploads.length === 1 ? "photo" : "photos"}`]
    if (countWith("uploading")) parts.push(`${countWith("uploading")} uploading`)
    if (countWith("uploaded")) parts.push(`${countWith("uploaded")} uploaded`)
    if (countWith("cancelled")) parts.push(`${countWith("cancelled")} cancelled`)
    this.summaryTarget.textContent = parts.join(" · ")
    this.sendButtonTarget.disabled = countWith("uploaded") === 0 || countWith("uploading") > 0
  }
}

function drawSamplePhoto(fileName, caption, tone) {
  const canvas = document.createElement("canvas")
  canvas.width = 480
  canvas.height = 360
  const context = canvas.getContext("2d")
  context.fillStyle = tone
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "#ffffff"
  context.font = "bold 28px system-ui, sans-serif"
  context.fillText(caption, 24, canvas.height - 32)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(new File([blob], fileName, { type: "image/png" })), "image/png")
  })
}
