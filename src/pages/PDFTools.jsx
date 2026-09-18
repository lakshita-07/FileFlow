import { useState } from "react"
import FileUpload from "../components/FileUpload"
import {
  mergePDFs,
  extractPDFPages,
  rotatePDF
} from "../utils/pdfExport"

export default function PDFTools() {
  const [files, setFiles] =
    useState([])

  const [mode, setMode] =
    useState("merge")

  const [pages, setPages] =
    useState("1")

  const [message, setMessage] =
    useState("")

  async function run() {
    if (!files.length) {
      setMessage(
        "Select PDF files first."
      )
      return
    }

    try {
      if (mode === "merge") {
        await mergePDFs(
          files,
          "FileFlow_Merged.pdf"
        )
      }

      if (mode === "extract") {
        await extractPDFPages(
          files[0],
          pages
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(Number),
          "FileFlow_Extracted.pdf"
        )
      }

      if (mode === "rotate") {
        await rotatePDF(
          files[0],
          90,
          "FileFlow_Rotated.pdf"
        )
      }

      setMessage(
        "PDF operation completed."
      )
    } catch (error) {
      console.error(error)

      setMessage(
        "PDF operation failed."
      )
    }
  }

  return (
    <main className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-heading">
          PDF Tools
        </h1>

        <p className="mt-2 text-on-surface-variant">
          Merge, extract and rotate PDF files.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">

        {[
          ["merge", "Merge"],
          ["extract", "Extract"],
          ["rotate", "Rotate"]
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() =>
              setMode(value)
            }
            className={
              mode === value
                ? "rounded-lg bg-primary p-3 font-bold text-white"
                : "rounded-lg border border-outline p-3 font-bold text-on-surface-variant"
            }
          >
            {label}
          </button>
        ))}

      </div>

      <FileUpload
        accept="application/pdf"
        multiple={mode === "merge"}
        onFiles={setFiles}
        title={
          mode === "merge"
            ? "Select PDFs"
            : "Select PDF"
        }
        description={
          mode === "merge"
            ? "Click or drag multiple PDFs here"
            : "Click or drag a PDF here"
        }
      />

      {files.length > 0 && (
        <div className="mt-5 rounded-xl border border-outline-variant bg-surface p-5">

          <h2 className="font-bold text-primary-heading">
            Selected Files
          </h2>

          <div className="mt-3 space-y-2">

            {files.map(
              (file, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-surface-container p-3"
                >
                  <p className="font-semibold text-on-surface">
                    {file.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )
            )}

          </div>

        </div>
      )}

      {mode === "extract" && (
        <div className="mt-5">
          <label className="block">
            <span className="text-sm font-bold text-primary-heading">
              Pages to extract (comma-separated)
            </span>
            <input
              value={pages}
              onChange={event =>
                setPages(
                  event.target.value
                )
              }
              placeholder="1,2,3"
              className="mt-2 w-full rounded-lg border border-outline bg-background px-3 py-3"
            />
          </label>
        </div>
      )}

      <button
        onClick={run}
        disabled={!files.length}
        className="mt-5 w-full rounded-lg bg-primary px-4 py-4 font-bold text-white disabled:opacity-50"
      >
        {mode === "merge"
          ? "Merge PDFs"
          : mode === "extract"
            ? "Extract Pages"
            : "Rotate PDF"}
      </button>

      {message && (
        <p className="mt-4 text-sm font-semibold text-primary">
          {message}
        </p>
      )}

    </main>
  )
}
