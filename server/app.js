const express = require("express");

module.exports = function (storage) {
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
                const success = await storage.set(namespace, req.body.data);
                if (success) res.send("ok");
                else res.status(500).send();
            }
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    app.get("/", (req, res) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.sendFile(__dirname.replace(/(server)$/, "/public/") + "index.html");
    });

    app.get("/:namespace", (req, res) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
        if (req.params.namespace.endsWith(".js") || req.params.namespace.endsWith(".css")) {
            res.sendFile(__dirname.replace(/(server)$/, "/public/") + req.params.namespace);
            return;
        }
        res.sendFile(__dirname.replace(/(server)$/, "/public") + "/index.html");
    });

    app.on("close", () => {
        storage.close();
    });
    return app;
};
