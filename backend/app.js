const express = require("express");
const app = express();
const port = 4000;
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const pdfPath = "./palette.pdf"; 
const colorsFilePath = path.join(__dirname, "colors.json");


app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// Endpoint to get the initial color palette
app.get("/", (req, res) => {
  return res.json(randomFive);
});

// Endpoint to toggle state or like of a color item
app.get("/item/:id?", (req, res) => {
  const id = +req.params.id;
  const myEle = randomFive.find((e) => e.id === id);
  const query = req.query;

  if (myEle) {
    // Toggle state or like based on query parameter
    if (Object.values(query)[0] === "state") {
      myEle.state = !myEle.state;
    }
    if (Object.values(query)[0] === "like") {
      myEle.like = !myEle.like;
    }
    saveColorsToFile();  

    return res.status(200).json({ message: "Toggled successfully" });
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

// Endpoint to convert color formats
app.post("/item/:id", async (req, res) => {
  const id = +req.params.id;
  const { to } = req.body;
  const myEle = randomFive.find((e) => e.id === id);

  if (myEle) {
    // Convert color between formats
    if (myEle.type === "hex" && to === "rgb") {
      myEle.color = hexToRgb(myEle.color);
      myEle.type = "rgb";
      return res.json(randomFive);
    }
    if (myEle.type === "hex" && to === "hsl") {
      myEle.color = hexToHsl(myEle.color);
      myEle.type = "hsl";
      return res.json(randomFive);
    }
    if (myEle.type === "rgb" && to === "hex") {
      myEle.color = rgbToHex(myEle.color);
      myEle.type = "hex";
      return res.json(randomFive);
    }
    if (myEle.type === "rgb" && to === "hsl") {
      const result = rgbToHex(myEle.color);
      myEle.color = hexToHsl(result);
      myEle.type = "hsl";
      return res.json(randomFive);
    }
    if (myEle.type === "hsl" && to === "hex") {
      myEle.color = hslToHex(myEle.color);
      myEle.type = "hex";
      return res.json(randomFive);
    }
    if (myEle.type === "hsl" && to === "rgb") {
      const result = extractNumbers(myEle.color);
      myEle.color = hslToRgb(result[0], result[1], result[2]);
      myEle.type = "rgb";
      return res.json(randomFive);
    }
    return; // No conversion needed
  } else {
    return res.status(404).json({ message: "Not found" });
  }
});

// Endpoint to regenerate the color palette with a specific method
app.get("/regenerate", (req, res) => {
  const { method } = req.query;  
  randomFive = regenerateColors(method);
  saveColorsToFile();
  return res.json(randomFive);
});


// function generateUniqueId() {
//   return Math.random().toString(36).substring(2, 8); 
// }

function saveColorsToFile() {
  fs.writeFileSync(colorsFilePath, JSON.stringify(randomFive, null, 2));
}


// Initialize random color palette
let randomFive = genFiveRandom();
saveColorsToFile();  


// Helper functions

function randColor() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
}

// Generate an array of 5 random colors
function genFiveRandom() {
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    color: randColor(),
    state: false,
    type: "hex",
    like: false,
  }));
}

// Regenerate colors for unlocked items
function reGenerate() {
  return randomFive.map((ele) =>
    ele.state ? ele : { ...ele, color: randColor() }
  );
}





// دالة توليد الألوان بحسب الطريقة
function regenerateColors(method) {
  switch (method) {
    case 'monochrome':
      return generateMonochrome();
    case 'additional':
      return generateAdditionalColors();
    case 'triadic':
      return generateTriadicColors();
    case 'quadratic':
      return generateQuadraticColors();
    default:
      return reGenerate();  // استخدام الطريقة العشوائية كافتراضي
  }
}

// توليد ألوان أحادية (Monochrome)
function generateMonochrome() {
  const baseColor = randColor();
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    color: baseColor,
    state: false,
    type: "hex",
    like: false,
  }));
}

// توليد ألوان إضافية (Additional Colors)
function generateAdditionalColors() {
  const baseColor = randColor();
  const shades = generateShades(baseColor);
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    color: shades[id] || baseColor,
    state: false,
    type: "hex",
    like: false,
  }));
}

// توليد ألوان ثلاثية (Triadic Colors)
function generateTriadicColors() {
  const baseColor = randColor();
  // حساب الألوان الثلاثية
  const triadicColors = getTriadicColors(baseColor);
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    color: triadicColors[id] || baseColor,
    state: false,
    type: "hex",
    like: false,
  }));
}

// توليد ألوان رباعية (Quadratic Colors)
function generateQuadraticColors() {
  const baseColor = randColor();
  // حساب الألوان الرباعية
  const quadraticColors = getQuadraticColors(baseColor);
  return Array.from({ length: 5 }, (_, id) => ({
    id,
    color: quadraticColors[id] || baseColor,
    state: false,
    type: "hex",
    like: false,
  }));
}

// دالة لحساب الألوان الثلاثية
function getTriadicColors(hex) {
  // حساب الألوان الثلاثية بناءً على تدرجات HSL
  const hsl = hexToHsl(hex);
  const triadic = [
    hslToHex(hslToRgb(hsl[0] + 120, hsl[1], hsl[2])),
    hslToHex(hslToRgb(hsl[0] - 120, hsl[1], hsl[2]))
  ];
  return triadic;
}

// دالة لحساب الألوان الرباعية
function getQuadraticColors(hex) {
  const hsl = hexToHsl(hex);
  const quadratic = [
    hslToHex(hslToRgb(hsl[0] + 90, hsl[1], hsl[2])),
    hslToHex(hslToRgb(hsl[0] - 90, hsl[1], hsl[2]))
  ];
  return quadratic;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////


// Convert HEX to HSL
function hexToHsl(hex) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Convert HEX to RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgb(${r},${g},${b})`;
}

// Convert RGB to HEX
function rgbToHex(str) {
  const arr = extractNumbers(str);
  const toHex = (value) => {
    let hex = value?.toString(16);
    return hex?.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(arr[0])}${toHex(arr[1])}${toHex(arr[2])}`;
}

// Convert HSL to HEX
function hslToHex(input) {
  const arr = extractNumbers(input);
  const rgb = hslToRgb(arr[0], arr[1], arr[2]);
  return rgbToHex(rgb);
}

// Extract numeric values from a string
function extractNumbers(input) {
  const str = typeof input === "string" ? input : String(input);
  const match = str.replace(/%/g, "").match(/\d+/g);
  return match ? match.map(Number) : [];
}








///////////////////////////////////////////////////////////////////////////////////
// Function to generate 8 shades for a given color
function generateShades(color) {
  const baseColor = hexToHsl(color);
  
  // Ensure we have valid HSL values
  if (!Array.isArray(baseColor) || baseColor.length !== 3) {
    console.error("Invalid HSL format for color:", color);
    return [];
  }

  const shades = [];
  for (let i = 0; i < 8; i++) {
    const lightness = Math.min(100, Math.max(0, baseColor[2] + (i - 3) * 10));
    const hslColor = `hsl(${baseColor[0]}, ${baseColor[1]}%, ${lightness}%)`;
    shades.push(hslToHex(hslColor));
  }
  return shades;
}

// Helper function to convert HEX to HSL
function hexToHsl(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length !== 6) return [0, 0, 50]; // Default HSL values if invalid

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}




// Function to create CSS from colors
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

//3. Set Up the Download Endpoint

app.get("/download-css", (req, res) => {
  const cssContent = createCssString(randomFive); // Assume randomFive is your palette
  const filename = "palette.css";

  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "text/css");
  res.send(cssContent);
});













function createPdfPalette(paletteData, outputPath) {
  const doc = new PDFDocument();
  
  // إنشاء PDF وحفظه في ملف
  doc.pipe(fs.createWriteStream(outputPath));

  // إضافة العنوان
  doc.fontSize(20).text("Color Palette", { align: "center" });
  doc.moveDown();

  paletteData.forEach((color) => {
    // إضافة اللون الأساسي مع معلوماته
    doc.fontSize(45).fillColor(color.color)
      .text(`${color.id}`, { continued: true })
      .text(` - Color: ${color.color}`)
      .moveDown();

    // توليد وعرض التدرجات الثمانية للون مع ظهور اللون الحقيقي
    const shades = generateShades(color.color);
    shades.forEach((shade, index) => {
      doc.fontSize(12)
        .fillColor("black") // النص الأساسي باللون الأسود
        .text(`  Shade ${index + 1}:`, { continued: true });

      doc.fillColor(shade) // النص بجانب اللون الفعلي
        .text(` ${shade}`, { continued: true });

      // إضافة مستطيل بجانب النص يعرض اللون الفعلي
      // doc.rect(doc.x + 10, doc.y - 12, 20, 10)
      //   .fill(shade)
      //   .stroke();

      doc.moveDown();
    });
    
    doc.moveDown();
  });

  // إنهاء الملف
  doc.end();
}








// Endpoint to download the palette as a PDF
app.get("/downloadPDF", async (req, res) => {
  const paletteData = JSON.parse(fs.readFileSync("colors.json", "utf-8"));
  const pdfPath = "./palette.pdf"; // حفظ في المجلد الرئيسي

  createPdfPalette(paletteData, pdfPath);

  setTimeout(() => {
    res.download(pdfPath, "palette.pdf", (err) => {
      if (err) {
        console.error("Error sending the PDF:", err);
        res.status(500).send("Error generating PDF");
      } else {
        console.log("PDF downloaded successfully.");
      }
    });
  }, 500); // تعديل التأخير إذا لزم الأمر
});




