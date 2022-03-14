const fs = require("fs");
console.log("Convert ./config.js into base64\n");
const json = fs.readFileSync("./config.json", "utf8");
console.log(btoa(json.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "")));
