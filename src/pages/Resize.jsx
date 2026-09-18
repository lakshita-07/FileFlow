import { useState } from "react"
import FileUpload from "../components/FileUpload"
import {
  fileToDataURL,
  dataURLToBlob,
  resizeImage
} from "../utils/scanProcessing"
import {
  downloadBlob
} from "../utils/pdfExport"

export default function Resize() {
  const [file, setFile] =
    useState(null)

  const [preview, setPreview] =
    useState(null)

  const [width, setWidth] =
    useState(1200)

  const [height, setHeight] =
    useState(1600)

  const [originalWidth, setOriginalWidth] =
    useState(0)

  const [originalHeight, setOriginalHeight] =
    useState(0)

  const [percentage, setPercentage] =
    useState(100)

  const [keepRatio, setKeepRatio] =
    useState(true)

  const [mode, setMode] =
    useState("dimensions")

  const [format, setFormat] =
    useState("jpg")

  async function selectFile(files) {
    const selected = files[0]

    if (!selected) return

    setFile(selected)

    const src =
      await fileToDataURL(selected)

    setPreview(src)

    const img = new Image()
    await new Promise((resolve) => {
      img.onload = resolve
      img.src = src
    })

    setOriginalWidth(img.naturalWidth)
    setOriginalHeight(img.naturalHeight)
    setWidth(img.naturalWidth)
    setHeight(img.naturalHeight)
  }

  function handleWidthChange(value) {
    const newWidth = Number(value)
    setWidth(newWidth)

    if (keepRatio && originalWidth > 0) {
      setHeight(
        Math.round(
          (originalHeight / originalWidth) *
          newWidth
        )
      )
    }
  }

  function handleHeightChange(value) {
    const newHeight = Number(value)
    setHeight(newHeight)

    if (keepRatio && originalHeight > 0) {
      setWidth(
        Math.round(
          (originalWidth / originalHeight) *
          newHeight
        )
      )
    }
  }

  async function resize() {
    if (!file) return

    const src =
      await fileToDataURL(file)

    const img =
      new Image()

    await new Promise(resolve => {
      img.onload = resolve
      img.src = src
    })

    let newWidth = Number(width)
    let newHeight = Number(height)

    if (mode === "percentage") {
      newWidth =
        Math.round(
          img.naturalWidth *
          percentage /
          100
        )

      newHeight =
        Math.round(
          img.naturalHeight *
          percentage /
          100
        )
    }

    if (newWidth <= 0 || newHeight <= 0) return

    const mime =
      format === "png"
        ? "image/png"
        : format === "webp"
          ? "image/webp"
          : "image/jpeg"

    const result =
      await resizeImage(
        src,
        newWidth,
        newHeight,
        mime,
        0.9
      )

    setPreview(result)

    downloadBlob(
      dataURLToBlob(result),
      file.name
        .replace(/\.[^/.]+$/, "") +
        `-resized.${format}`
    )
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-heading">
          Resize
        </h1>

        <p className="mt-2 text-on-surface-variant">
          Resize images by dimensions or percentage.
        </p>
      </div>

      {!file && (
        <div className="mt-8">
          <FileUpload
            accept="image/*"
            onFiles={selectFile}
            title="Select image"
            description="Click or drag an image here"
          />
        </div>
      )}

      {file && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-xl border border-outline-variant bg-surface p-6">
            <h2 className="font-bold text-primary-heading mb-4">
              Preview
            </h2>

            {preview && (
              <img
                src={preview}
                className="max-h-[550px] w-full object-contain rounded-lg"
              />
            )}

            {originalWidth > 0 && (
              <p className="mt-3 text-sm text-on-surface-variant">
                Original: {originalWidth} × {originalHeight} px
              </p>
            )}
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface p-6">

            <h2 className="font-bold text-primary-heading mb-4">
              Resize Settings
            </h2>

            <div className="grid grid-cols-2 gap-2">

              <button
                onClick={() =>
                  setMode("dimensions")
                }
                className={`rounded-lg p-3 font-bold ${
                  mode === "dimensions"
                    ? "bg-primary text-white"
                    : "border border-outline text-on-surface-variant"
                }`}
              >
                Dimensions
              </button>

              <button
                onClick={() =>
                  setMode("percentage")
                }
                className={`rounded-lg p-3 font-bold ${
                  mode === "percentage"
                    ? "bg-primary text-white"
                    : "border border-outline text-on-surface-variant"
                }`}
              >
                Percentage
              </button>

            </div>

            {mode === "dimensions" && (
              <div className="mt-5 grid gap-4">

                <label className="block">
                  <span className="text-sm font-bold text-primary-heading">
                    Width
                  </span>
                  <input
                    type="number"
                    value={width}
                    onChange={(event) =>
                      handleWidthChange(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-outline bg-background px-3 py-3"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-primary-heading">
                    Height
                  </span>
                  <input
                    type="number"
                    value={height}
                    onChange={(event) =>
                      handleHeightChange(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-outline bg-background px-3 py-3"
                  />
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={keepRatio}
                    onChange={(e) =>
                      setKeepRatio(e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                  <span className="font-semibold text-sm text-primary-heading">
                    Maintain aspect ratio
                  </span>
                </label>

              </div>
            )}

            {mode === "percentage" && (
              <label className="mt-5 block">
                <span className="text-sm font-bold text-primary-heading">
                  Percentage
                </span>
                <input
                  type="number"
                  value={percentage}
                  onChange={(event) =>
                    setPercentage(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-outline bg-background px-3 py-3"
                />
              </label>
            )}

            <label className="mt-5 block">
              <span className="text-sm font-bold text-primary-heading">
                Format
              </span>

              <select
                value={format}
                onChange={(event) =>
                  setFormat(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-lg border border-outline bg-background px-3 py-3"
              >
                <option value="jpg">
                  JPG
                </option>
                <option value="png">
                  PNG
                </option>
                <option value="webp">
                  WebP
                </option>
              </select>
            </label>

            <button
              onClick={resize}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-4 font-bold text-white"
            >
              Resize & Download
            </button>

          </section>

        </div>
      )}

    </main>
  )
}
