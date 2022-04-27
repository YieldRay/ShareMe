const express = require("express");
const path = require("path");

module.exports = function (storage) {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.post("/:namespace", async (req, res) => {
        try {
            // handle POST request
            const namespace = req.params.namespace;
            console.log(new Date().toLocaleString() + " " + namespace, req.body);
            if (!namespace || !/^[a-zA-Z0-9]{1,16}$/.test(namespace)) {
                res.status(400).send("namespace should fit /^[a-zA-Z0-9]{1,16}$/"); // client-side use Response.ok
                return;
            }
            if (req.body.data === undefined) {
                // get
                const data = await storage.get(namespace); // if not exist, return ''
                if (typeof data === "string") res.status(200).send(data);
                else res.send("");
            } else {
                // set
                if (!["string", "number", "boolean"].includes(typeof namespace))
                    res.status(405).send("data must be string");
                const success = await storage.set(namespace, String(req.body.data));
                if (success) res.send("ok");
                else res.status(500).send("failed to save data");
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    });

    app.use(
        express.static(path.resolve(__dirname + "/../public"), {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
    );
    app.use("/**", function (req, res) {
        // SPA
        res.sendFile(path.resolve(__dirname + "/../public/index.html"), {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
    });

    app.on("close", () => {
        storage.close();
    });
    return app;
};
