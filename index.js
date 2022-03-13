const handler = require("./server/app.js");
const { FileDB } = require("./storage/FileDB.js");
const { MongoDB } = require("./storage/MongoDB.js");
const fs = require("fs/promises");
const port = process.env.PORT || 3000;

(async () => {
    let storage;
    try {
        const config = await fs.readFile("./config.json", "utf8");
        const { uri, db, collection } = JSON.parse(config);
        storage = new MongoDB(uri, db, collection);
    } catch (e) {
        storage = new FileDB("./server/db.json");
    }
    const app = handler(storage);
    await storage.connect();
    app.listen(port, () => {
        console.log(`server is running at http://localhost:${port}`);
    });
})();
