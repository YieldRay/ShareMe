const handler = require("./server/app.js");
const { FileDB } = require("./storage/fileDB.js");
const { MongoDB } = require("./storage/mongoDB.js");
const { DetaBase } = require("./storage/detaBase.js");
const getENV = require("./localENV.js");
Object.assign(process.env, getENV());
// append enviroment variables to process.env

const db_uri = process.env.MONGO_DB_URI || "";
const db_name = process.env.MONGO_DB_NAME || "";
const db_collection = process.env.MONGO_DB_COLLECTION || "";
const deta_project_key = process.env.DETA_PROJECT_KEY || "";
const data_base_name = process.env.DETA_BASE_NAME || "ShareMe";
let storage;
if (db_uri && db_name && db_collection) {
    storage = new MongoDB(db_uri, db_name, db_collection);
    console.log("Use MongoDB specified in environment variable");
} else if (process.env.DETA_RUNTIME || deta_project_key) {
    storage = new DetaBase(deta_project_key, data_base_name);
    console.log("Use Deta Base specified in environment variable");
} else {
    storage = new FileDB(__dirname + "/.database.json");
    console.log("No Database is configured, using file storage");
}
storage.connect();
const app = handler(storage);
module.exports = app;
