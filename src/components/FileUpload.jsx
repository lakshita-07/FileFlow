import { useRef, useState } from "react"

export default function FileUpload({
  onFiles,
  accept = "*/*",
  multiple = false,
  title = "Select files",
  description = "Click or drag files here"
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleChange(event) {
    const files =
      Array.from(event.target.files || [])

    if (files.length) {
      onFiles(files)
    }

    event.target.value = ""
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    setDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)

    const files =
      Array.from(event.dataTransfer.files || [])

    if (files.length) {
      onFiles(files)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
        dragging
          ? "border-primary bg-primary/5"
          : "border-outline-variant bg-surface hover:bg-surface-container"
      }`}
      role="button"
      tabIndex={0}
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-xl text-primary">
        {dragging ? "📥" : "↑"}
      </div>

      <h3 className="font-bold text-primary-heading">
        {title}
      </h3>

      <p className="mt-2 text-sm text-on-surface-variant">
        {dragging
          ? "Drop files here"
          : description}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={handleChange}
      />
    </div>
  )
}
