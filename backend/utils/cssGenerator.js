// cssGenerator.js
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
  
  module.exports = { createCssString };
  