const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const colorsRouter = require("./routes/colors");
const { saveColorsToFile, loadColorsFromFile } = require("./utils/fileManager");

const port = 4000;


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