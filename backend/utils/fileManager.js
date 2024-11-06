const fs = require("fs");
const path = require("path");

const colorsFilePath = path.join(__dirname, "../colors.json");

function saveColorsToFile(colors) {
  fs.writeFileSync(colorsFilePath, JSON.stringify(colors, null, 2));
}

function loadColorsFromFile() {
  return JSON.parse(fs.readFileSync(colorsFilePath, "utf-8"));
}

module.exports = { saveColorsToFile, loadColorsFromFile };
