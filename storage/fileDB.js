const fs = require("fs/promises");
class FileDB {
    constructor(filename = __dirname + "/db.json") {
        this.filename = filename;
    }
    async connect() {
        const stat = await fs.stat(this.filename);
        if (!stat.isFile()) {
            console.log("Create new file");
            await fs.writeFile(this.filename, "{}", "utf8");
        }
        const data = await fs.readFile(this.filename, "utf8");
        console.log("Connected successfully to file");
        try {
            JSON.parse(data);
        } catch (e) {
            throw new Error("Invalid JSON");
        }
    }
    close() {
        // do nothing
    }
    async get(namespace) {
        try {
            const data = await fs.readFile(this.filename, "utf8");
            const json = JSON.parse(data);
            return json[namespace] || "";
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async set(namespace, data) {
        try {
            const json = await fs.readFile(this.filename, "utf8");
            const obj = JSON.parse(json);
            obj[namespace] = data;
            await fs.writeFile(this.filename, JSON.stringify(obj), "utf8");
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

module.exports = { FileDB };
