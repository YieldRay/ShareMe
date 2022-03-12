const fs = require("fs/promises");
const filename = __dirname + "/db.json";
module.exports = {
    async get(namespace) {
        try {
            const data = await fs.readFile(filename, "utf8");
            const json = JSON.parse(data);
            return json[namespace] || "";
        } catch (e) {
            console.error(e);
            return null;
        }
    },
    async set(namespace, data) {
        try {
            const json = await fs.readFile(filename, "utf8");
            const obj = JSON.parse(json);
            obj[namespace] = data;
            await fs.writeFile(filename, JSON.stringify(obj), "utf8");
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },
};
