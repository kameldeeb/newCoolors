const PDFDocument = require("pdfkit");
const fs = require("fs");

// دالة لتوليد معرف فريد
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 8);
}

// دالة لتوليد خمسة ألوان عشوائية
function genFiveRandom() {
  const colors = [];
  for (let i = 0; i < 5; i++) {
    colors.push({
      id: generateUniqueId(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      state: false,
      like: false,
    });
  }
  return colors;
}

// دالة لإعادة توليد الألوان
function regenerateColors(method) {
  if (method === "random") {
    return genFiveRandom();
  }
  // يمكنك إضافة طرق أخرى هنا إذا لزم الأمر
}

// دوال تحويل الألوان
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${(h * 360).toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%)`;
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return rgbToHex(r, g, b);
}

// دالة لاستخراج الأرقام من تنسيق اللون
function extractNumbers(color) {
  return color.match(/\d+/g).map(Number);
}

// دالة لتوليد تدرجات اللون
function generateShades(hexColor) {
  const shades = [];
  for (let i = 0; i < 5; i++) {
    const hsl = extractNumbers(hexToHsl(hexColor));
    const shadeL = Math.min(100, hsl[2] + i * 15);
    shades.push(hslToHex(hsl[0], hsl[1], shadeL));
  }
  return shades;
}

// دالة لإنشاء CSS من لوحة الألوان
function createCssString(colors) {
  let cssString = ":root {\n";
  colors.forEach((color, index) => {
    const shades = generateShades(color.color);
    shades.forEach((shade, i) => {
      cssString += `  --color-${index}-shade-${i}: ${shade};\n`;
    });
  });
  cssString += "}\n";
  return cssString;
}

// دالة لإنشاء ملف PDF للوحة الألوان
function createPdfPalette(paletteData, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));
  doc.fontSize(20).text("Color Palette", { align: "center" }).moveDown();

  paletteData.forEach((color) => {
    doc.fontSize(45).fillColor(color.color).text(`${color.id}`, { continued: true })
      .text(` - Color: ${color.color}`).moveDown();

    const shades = generateShades(color.color);
    shades.forEach((shade, index) => {
      doc.fontSize(12).fillColor("black").text(`  Shade ${index + 1}:`, { continued: true });
      doc.fillColor(shade).text(` ${shade}`).moveDown();
    });
    doc.moveDown();
  });

  doc.end();
}

module.exports = {
  generateUniqueId,
  genFiveRandom,
  regenerateColors,
  hexToRgb,
  hexToHsl,
  rgbToHex,
  hslToRgb,
  hslToHex,
  extractNumbers,
  createCssString,
  createPdfPalette,
};
