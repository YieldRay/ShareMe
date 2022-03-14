const express = require("express");

module.exports = function (storage) {
    const app = express();
    app.use(express.json());

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

    app.post("/", async (req, res) => {
        try {
            console.log(new Date().toLocaleString(), req.body);
            if (!req.body.namespace || !/^[a-zA-Z0-9]{1,16}$/.test(req.body.namespace)) {
                res.json({
                    success: false,
                    message: "invalid namespace",
                });
                return;
            }
            if (req.body.data === undefined) {
                // get
                const data = await storage.get(req.body.namespace); // if not exist, return ''
                res.json({ success: data !== null, data });
            } else {
                // set
                res.json({ success: await storage.set(req.body.namespace, req.body.data) });
            }
        } catch (e) {
            console.error(e);
            res.json({ success: false, message: e.message });
        }
    });
    app.on("close", () => {
        storage.close();
    });
    return app;
};
// {success:bool,data:string}
