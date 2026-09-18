import { useState } from "react"
import FileUpload from "../components/FileUpload"
import {
  fileToDataURL,
} from "../utils/scanProcessing"
import {
  downloadBlob
} from "../utils/pdfExport"

export default function SmartCompress() {
  const [file, setFile] =
    useState(null)

  const [preview, setPreview] =
    useState(null)

  const [quality, setQuality] =
    useState("balanced")

  const [originalSize, setOriginalSize] =
    useState(0)

  const [resultSize, setResultSize] =
    useState(null)

  const [estimates, setEstimates] =
    useState({})

  const [estimating, setEstimating] =
    useState(false)

  const [message, setMessage] =
    useState("")

  async function selectFile(files) {
    const selected = files[0]

    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      setMessage("Please select an image file.")
      return
    }

    setFile(selected)
    setResultSize(null)
    setEstimates({})
    setMessage("")

    const src = await fileToDataURL(selected)

    setPreview(src)
    setOriginalSize(selected.size)

    setEstimating(true)

    const qualityOptions = [
      { name: "high", quality: 0.92 },
      { name: "balanced", quality: 0.7 },
      { name: "smallest", quality: 0.45 },
    ]

    const img = new Image()

    await new Promise((resolve) => {
      img.onload = resolve
      img.src = src
    })

    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)

    const results = {}

    for (const option of qualityOptions) {
      const data = canvas.toDataURL("image/jpeg", option.quality)
      const response = await fetch(data)
      const blob = await response.blob()
      results[option.name] = blob.size
    }

    setEstimates(results)
    setEstimating(false)
  }

  async function compress() {
    if (!file) {
      setMessage("Select a file first.")
      return
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Image compression only.")
      return
    }

    const src =
      await fileToDataURL(file)

    const img =
      new Image()

    await new Promise(resolve => {
      img.onload = resolve
      img.src = src
    })

    const canvas =
      document.createElement("canvas")

    canvas.width =
      img.naturalWidth

    canvas.height =
      img.naturalHeight

    const ctx =
      canvas.getContext("2d")

    ctx.drawImage(
      img,
      0,
      0
    )

    let jpegQuality = 0.7

    if (quality === "smallest") {
      jpegQuality = 0.45
    }

    if (quality === "high") {
      jpegQuality = 0.92
    }

    const data =
      canvas.toDataURL(
        "image/jpeg",
        jpegQuality
      )

    const blob =
      await fetch(data).then(
        response =>
          response.blob()
      )

    setResultSize(blob.size)

    downloadBlob(
      blob,
      file.name
        .replace(/\.[^/.]+$/, "") +
        "-compressed.jpg"
    )

    setMessage(
      "Compression complete."
    )
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B"
    const units = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-heading">
          Smart Compress
        </h1>

        <p className="mt-2 text-on-surface-variant">
          Reduce file size while keeping the result useful.
        </p>
      </div>

      {!file && (
        <div className="mt-8">
          <FileUpload
            accept="image/*"
            onFiles={selectFile}
            title="Select image to compress"
            description="Click or drag an image here"
          />
        </div>
      )}

      {file && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-xl border border-outline-variant bg-surface p-6">

            <h2 className="font-bold text-primary-heading">
              Preview
            </h2>

            {preview && (
              <img
                src={preview}
                className="mt-5 max-h-[500px] w-full object-contain rounded-lg"
              />
            )}

            <div className="mt-4 rounded-lg bg-surface-container p-4">
              <p className="font-semibold text-primary-heading">
                {file.name}
              </p>
              <p className="text-sm text-on-surface-variant">
                Original: {formatBytes(originalSize)}
              </p>
              {resultSize && (
                <p className="mt-1 text-sm font-bold text-primary">
                  Result: {formatBytes(resultSize)}
                  {originalSize > 0 && (
                    <span className="ml-2 text-xs font-normal text-on-surface-variant">
                      ({Math.round((1 - resultSize / originalSize) * 100)}% reduction)
                    </span>
                  )}
                </p>
              )}
            </div>

          </section>

          <section className="rounded-xl border border-outline-variant bg-surface p-6">

            <h2 className="font-bold text-primary-heading">
              Compression
            </h2>

            <div className="mt-4 grid gap-2">

              {[
                { id: "smallest", label: "Maximum Reduction" },
                { id: "balanced", label: "Balanced" },
                { id: "high", label: "High Quality" },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() =>
                    setQuality(option.id)
                  }
                  className={`rounded-lg border p-3 text-left font-bold ${
                    quality === option.id
                      ? "border-primary bg-secondary-container text-primary-heading"
                      : "border-outline text-on-surface-variant"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <span className="text-sm font-normal text-on-surface-variant">
                      {estimating
                        ? "Calculating..."
                        : estimates[option.id]
                          ? `~${formatBytes(estimates[option.id])}`
                          : ""}
                    </span>
                  </span>
                </button>
              ))}

            </div>

            <button
              onClick={compress}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-4 font-bold text-white"
            >
              Compress & Download
            </button>

            {message && (
              <p className="mt-4 text-sm font-semibold text-primary">
                {message}
              </p>
            )}

          </section>

        </div>
      )}

    </main>
  )
}
