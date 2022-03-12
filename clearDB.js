const fs = require("fs/promises");
const filename = "./server/" + "db.json";
fs.writeFile(filename, "{}", "utf8")
    .then(() => {
        console.log("clear success");
    })
    .catch((e) => {
        console.error(e);
    });
