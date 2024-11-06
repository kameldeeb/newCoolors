// pdfGenerator.js
const PDFDocument = require("pdfkit");
const fs = require("fs");

function createPdfPalette(paletteData, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text("Color Palette", { align: "center" });
  doc.moveDown();

  paletteData.forEach((color) => {
    doc.fontSize(45).fillColor(color.color)
      .text(`${color.id}`, { continued: true })
      .text(` - Color: ${color.color}`)
      .moveDown();

    const shades = generateShades(color.color);
    shades.forEach((shade, index) => {
      doc.fontSize(12)
        .fillColor("black")
        .text(`  Shade ${index + 1}:`, { continued: true })
        .fillColor(shade)
        .text(` ${shade}`, { continued: true })
        .moveDown();
    });

    doc.moveDown();
  });

  doc.end();
}

module.exports = { createPdfPalette };
