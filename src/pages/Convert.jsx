import { useState } from "react"
import FileUpload from "../components/FileUpload"
import {
  fileToDataURL,
  dataURLToBlob
} from "../utils/scanProcessing"
import {
  imagesToPDF,
  downloadBlob
} from "../utils/pdfExport"

export default function Convert() {
  const [file, setFile] =
    useState(null)

  const [preview, setPreview] =
    useState(null)

  const [format, setFormat] =
    useState("png")

  const [quality, setQuality] =
    useState(0.85)

  const [message, setMessage] =
    useState("")

  async function selectFile(files) {
    const selected = files[0]

    if (!selected) return

    setFile(selected)
    setMessage("")

    if (selected.type.startsWith("image/")) {
      setPreview(
        await fileToDataURL(selected)
      )
    }
  }

  async function convert() {
    if (!file) {
      setMessage("Select a file first.")
      return
    }

    try {
      if (
        file.type.startsWith("image/")
      ) {
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

        if (format === "pdf") {
          await imagesToPDF(
            [src],
            file.name
              .replace(/\.[^/.]+$/, "") +
              ".pdf"
          )
        } else {
          const mime =
            format === "jpg"
              ? "image/jpeg"
              : format === "png"
                ? "image/png"
                : "image/webp"

          const data =
            canvas.toDataURL(
              mime,
              quality
            )

          downloadBlob(
            dataURLToBlob(data),
            file.name
              .replace(/\.[^/.]+$/, "") +
              `.${format}`
          )
        }

        setMessage(
          "Conversion completed."
        )
      }
    } catch (error) {
      console.error(error)

      setMessage(
        "Conversion failed."
      )
    }
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-heading">
          Convert
        </h1>

        <p className="mt-2 text-on-surface-variant">
          Convert images between common formats.
        </p>
      </div>

      {!file && (
        <div className="mt-8">
          <FileUpload
            accept="image/*"
            onFiles={selectFile}
            title="Select image"
            description="Click or drag an image here (JPG, PNG, WebP)"
          />
        </div>
      )}

      {file && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-xl border border-outline-variant bg-surface p-6">

            <h2 className="font-bold text-primary-heading">
              Selected File
            </h2>

            <p className="mt-3 font-semibold text-on-surface">
              {file.name}
            </p>

            {preview && (
              <img
                src={preview}
                className="mt-5 max-h-[500px] w-full object-contain rounded-lg"
              />
            )}

          </section>

          <section className="rounded-xl border border-outline-variant bg-surface p-6">

            <h2 className="font-bold text-primary-heading">
              Output Format
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">

              {["jpg", "png", "webp", "pdf"].map(
                item => (
                  <button
                    key={item}
                    onClick={() =>
                      setFormat(item)
                    }
                    className={
                      format === item
                        ? "rounded-lg bg-primary px-4 py-3 font-bold text-white"
                        : "rounded-lg border border-outline px-4 py-3 font-bold text-on-surface-variant"
                    }
                  >
                    {item.toUpperCase()}
                  </button>
                )
              )}

            </div>

            {format !== "pdf" && (
              <label className="mt-5 block">
                <span className="text-sm font-bold text-primary-heading">
                  Quality
                </span>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                  className="mt-3 w-full"
                />
                <span className="text-xs text-on-surface-variant">
                  {Math.round(quality * 100)}%
                </span>
              </label>
            )}

            <button
              onClick={convert}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-4 font-bold text-white"
            >
              Convert & Download
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
