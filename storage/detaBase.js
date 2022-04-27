const { Deta } = require("deta");
class DetaBase {
    db;
    constructor(project_key, base_name = "ShareMe") {
        const deta = Deta(project_key);
        this.db = deta.Base(base_name);
    }
    async connect() {
        console.log("Will connect to Deta Base");
    }
    close() {
        // do nothing
    }
    async get(namespace) {
        return await this.db.get(namespace);
    }
    async set(namespace, data) {
        return await this.db.put(data, namespace);
    }
}

module.exports = { DetaBase };
