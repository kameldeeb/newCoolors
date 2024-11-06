const express = require("express");
const fs = require("fs");
const { createCssString } = require("../utils/cssGenerator");
const { createPdfPalette } = require("../utils/pdfGenerator");


const router = express.Router();

router.get("/download-css", (req, res) => {
  const cssContent = createCssString(randomFive); // تأكد من أن `randomFive` متاح هنا
  const filename = "palette.css";

  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "text/css");
  res.send(cssContent);
});

router.get("/downloadPDF", async (req, res) => {
  const paletteData = JSON.parse(fs.readFileSync("colors.json", "utf-8"));
  const pdfPath = "./palette.pdf";

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
  }, 500);
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


module.exports = router;
