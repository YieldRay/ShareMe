const express = require("express");
const path = require("path");

module.exports = function (storage) {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    const formField = "t"; // name of the form field, note.ms use "t", so we keep it same
    const responseForPOST = "ShareMe: ";

    app.post("/:namespace", async (req, res) => {
        try {
            // handle POST request
            const namespace = req.params.namespace;
            console.log(new Date().toLocaleString() + " " + namespace, req.body);
            if (!namespace || !/^[a-zA-Z0-9]{1,16}$/.test(namespace)) {
                res.status(400).send(responseForPOST + "namespace should fit /^[a-zA-Z0-9]{1,16}$/"); // client-side use Response.ok
            }
            const dataField = req.body[formField];
            if (dataField === undefined) {
                // get
                const data = await storage.get(namespace); // if not exist, return ''
                res.send(typeof data === "string" ? data : ""); // only send data string from database
            } else {
                // set
                if (!["string", "number", "boolean"].includes(typeof dataField))
                    res.status(405).send(responseForPOST + "data must be string");
                // data is valid, set it as string
                const success = await storage.set(namespace, String(dataField));
                if (success) res.send(responseForPOST + "ok");
                else res.status(500).send(responseForPOST + "failed to save data");
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    });

    app.get("/:namespace", async (req, res, next) => {
        // special handler for curl
        if (!req.headers["user-agent"].startsWith("curl")) {
            next();
            return;
        }
        const namespace = req.params.namespace;
        if (!namespace || !/^[a-zA-Z0-9]{1,16}$/.test(namespace))
            res.status(400).send("namespace should fit /^[a-zA-Z0-9]{1,16}$/");
        const data = await storage.get(namespace);
        res.send(typeof data === "string" ? data : "");
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


