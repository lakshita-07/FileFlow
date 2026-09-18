import { PDFDocument, degrees } from "pdf-lib"

export async function imagesToPDF(images) {
  const pdfDoc = await PDFDocument.create()

  for (const image of images) {
    let imageBytes

    if (typeof image === "string") {
      const response = await fetch(image)
      imageBytes = await response.arrayBuffer()
    } else if (image instanceof Blob) {
      imageBytes = await image.arrayBuffer()
    } else {
      imageBytes = image
    }

    let pdfImage

    const bytes = new Uint8Array(imageBytes)

    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      pdfImage = await pdfDoc.embedPng(bytes)
    } else {
      pdfImage = await pdfDoc.embedJpg(bytes)
    }

    const width = pdfImage.width
    const height = pdfImage.height

    const page = pdfDoc.addPage([width, height])

    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width,
      height,
    })
  }

  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], {
    type: "application/pdf",
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export async function mergePDFs(files, filename = "FileFlow_Merged.pdf") {
  const merged = await PDFDocument.create()

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const copiedPages = await merged.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => merged.addPage(page))
  }

  const pdfBytes = await merged.save()

  downloadBlob(
    new Blob([pdfBytes], { type: "application/pdf" }),
    filename
  )
}

export async function extractPDFPages(file, pageNumbers, filename = "FileFlow_Extracted.pdf") {
  const bytes = await file.arrayBuffer()
  const pdf = await PDFDocument.load(bytes)
  const newPDF = await PDFDocument.create()

  const validIndices = pageNumbers
    .filter((n) => n >= 1 && n <= pdf.getPageCount())
    .map((n) => n - 1)

  if (validIndices.length === 0) {
    throw new Error("No valid page numbers provided.")
  }

  const copiedPages = await newPDF.copyPages(pdf, validIndices)
  copiedPages.forEach((page) => newPDF.addPage(page))

  const pdfBytes = await newPDF.save()

  downloadBlob(
    new Blob([pdfBytes], { type: "application/pdf" }),
    filename
  )
}

export async function rotatePDF(file, angle = 90, filename = "FileFlow_Rotated.pdf") {
  const bytes = await file.arrayBuffer()
  const pdf = await PDFDocument.load(bytes)

  const pages = pdf.getPages()
  for (const page of pages) {
    const currentRotation = page.getRotation().angle
    page.setRotation(degrees(currentRotation + angle))
  }

  const pdfBytes = await pdf.save()

  downloadBlob(
    new Blob([pdfBytes], { type: "application/pdf" }),
    filename
  )
}
