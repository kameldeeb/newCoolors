const fs = require("fs");
const path = require("path");

const colorsFilePath = path.join(__dirname, "..", "colors.json");

function loadColorsFromFile() {
  try {
    return JSON.parse(fs.readFileSync(colorsFilePath, "utf8"));
  } catch (error) {
    console.error("Error loading colors:", error);
    return [];
  }
}

function saveColorsToFile(colors) {
  fs.writeFileSync(colorsFilePath, JSON.stringify(colors, null, 2));
}

module.exports = { loadColorsFromFile, saveColorsToFile };
