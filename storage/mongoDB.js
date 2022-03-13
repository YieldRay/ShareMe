const { MongoClient, ServerApiVersion } = require("mongodb");

class MongoDB {
    constructor(uri, databaseName, collectionName) {
        this.uri = uri;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
        this.client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
        });
    }
    async connect() {
        await this.client.connect();
        console.log("Connected successfully to database");
        this.db = this.client.db(this.databaseName);
        this.collection = this.db.collection(this.collectionName);
    }
    close() {
        try {
            this.client.close();
        } catch (e) {
            console.error(e);
            return;
        }
        console.log("Connection closed");
    }
    async get(namespace) {
        try {
            const result = await this.collection.findOne({ namespace });
            return result ? result.data : "";
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    async set(namespace, data) {
        namespace = String(namespace);
        try {
            const result = await this.collection.updateOne({ namespace }, { $set: { data } }, { upsert: true });
            return result.modifiedCount === 1;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

module.exports = { MongoDB };
