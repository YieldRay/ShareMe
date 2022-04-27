const fs = require("fs");

class TmpDB {
    constructor(filename) {
        this.filename = filename;
    }
    async connect() {
        this.db = Object.create(null);
        console.log("Successfully created an empty object");
    }
    close() {
        // this function usually not working, as is not triggered
        if (typeof filename === "string") {
            fs.writeFileSync(filename, JSON.stringify(this.db), "utf8");
        }
        this.db = undefined;
    }
    async get(namespace) {
        // to fit the interface, use async
        try {
            return this.db[namespace] || "";
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    async set(namespace, data) {
        try {
            this.db.namespace = data;
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }
}
