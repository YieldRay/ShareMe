const express = require("express");
const path = require("path");

module.exports = function (storage, staticPath) {
    const app = express();
    app.use(express.json());

    app.post("/:namespace", async (req, res) => {
        try {
            console.log(new Date().toLocaleString(), req.body);

            // handle POST request
            const namespace = req.params.namespace;
            if (!namespace || !/^[a-zA-Z0-9]{1,16}$/.test(namespace)) {
                res.status(403).send(); // client-side use Response.ok
            }
            if (req.body.data === undefined) {
                // get
                const data = await storage.get(namespace); // if not exist, return ''
                if (typeof data === "string") res.status(200).send(data);
                else res.send("");
            } else {
                // set
                if (!["string", "number", "boolean"].includes(typeof namespace))
                    res.status(403).send("data must be string");
                const success = await storage.set(namespace, String(req.body.data));
                if (success) res.send("ok");
                else res.status(500).send("failed to save data");
            }
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    app.use(express.static(staticPath));
    app.use("/**", function (req, res) {
        // SPA
        res.sendFile(path.join(staticPath, "index.html"));
    });

    app.on("close", () => {
        storage.close();
    });
    return app;
};
