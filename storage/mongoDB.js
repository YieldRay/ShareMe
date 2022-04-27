const { MongoClient, ServerApiVersion } = require("mongodb");

class MongoDB {
    databaseName;
    collectionName;
    client;
    db;
    collection;
    constructor(uri, databaseName, collectionName) {
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
        console.log("Connected successfully to MongoDB");
        this.db = this.client.db(this.databaseName);
        this.collection = this.db.collection(this.collectionName);
    }
    close() {
        this.client.close();
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
        try {
            const result = await this.collection.updateOne({ namespace }, { $set: { data } }, { upsert: true });
            return result.acknowledged;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

module.exports = { MongoDB };
