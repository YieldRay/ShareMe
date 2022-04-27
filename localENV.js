const fs = require("fs");
function getENV(ENV_PATH = "./.env") {
    const env = {};
    if (!fs.existsSync(ENV_PATH)) return env;
    const lines = fs
        .readFileSync(ENV_PATH, "utf8")
        .split(/\r\n|\r|\n/)
        .filter((e) => e.length > 2);
    for (const line of lines) {
        const [key, ...values] = line.split("=");
        if (key && values.length) {
            env[key] = values.join("=");
        }
    }
    return env;
}
module.exports = getENV;

/**
 * The ENV file should look like this:
 *
 * KEY1=VALUE1
 * KEY2=VALUE2
 *
 * Usage:
 * import getENV from "./localENV.js";
 * const ENV = getENV();
 * console.log(ENV.KEY1);
 */
