const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

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
        .text(`  Shade ${index + 1}:`, { continued: true });

      doc.fillColor(shade) 
        .text(` ${shade}`, { continued: true });

      doc.moveDown();
    }); 

    doc.addPage();
  });

  doc.end();
}

function generateShades(hexColor) {
  const rgb = hexToRgb(hexColor);
  let shades = [];
  for (let i = 0; i <= 9; i++) {
    const shade = lightenColor(rgb.r, rgb.g, rgb.b, i);
    shades.push(shade);
  }
  return shades;
}

function lightenColor(r, g, b, percent) {
  r = Math.min(Math.round((1 + percent / 100) * r), 255);
  g = Math.min(Math.round((1 + percent / 100) * g), 255);
  b = Math.min(Math.round((1 + percent / 100) * b), 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

module.exports = { createPdfPalette };
