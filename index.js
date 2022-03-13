const handler = require("./server/app.js");
const { FileDB } = require("./storage/fileDB.js");
const { MongoDB } = require("./storage/mongoDB.js");
const fs = require("fs/promises");
const port = process.env.PORT || 3000;

(async () => {
    let storage;
    try {
        const { uri, db, collection } = JSON.parse(await fs.readFile("./config.json", "utf8"));
        storage = new MongoDB(uri, db, collection);
        console.log("Use MongoDB specified in config.json");
    } catch (e) {
        try {
            const { uri, db, collection } = JSON.parse(process.env.MongoDB_CONFIG);
            storage = new MongoDB(uri, db, collection);
            console.log("Use MongoDB specified in environment variable");
        } catch (e) {
            console.log("No Database is configured, using file storage");
        }
        storage = new FileDB("./server/db.json");
    }
    const app = handler(storage);
    await storage.connect();
    app.listen(port, () => {
        console.log(`server is running at http://localhost:${port}`);
    });
})();
