const fs = require("fs");
const json = fs.readFileSync("./config.json", "utf8");
console.log(btoa(json.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "")));
