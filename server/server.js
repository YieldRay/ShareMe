// 要兼容低版本node，这里全部用commonjs写法
const express = require("express");
const res = require("express/lib/response");
const stroage = require("./stroage");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname.replace(/(server)$/, "/public") + "/index.html");
});

app.get("/:namespace", (req, res) => {
    if (req.params.namespace.endsWith(".js") || req.params.namespace.endsWith(".css")) {
        res.sendFile(__dirname.replace(/(server)$/, "/public/") + req.params.namespace);
        return;
    }
    res.sendFile(__dirname.replace(/(server)$/, "/public") + "/index.html");
});

app.post("/", async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.namespace || !/^[a-zA-Z]{1,16}$/.test(req.body.namespace)) {
            res.json({
                success: false,
                message: "namespace is invalid",
            });
            return;
        }
        if (req.body.data === undefined) {
            // get
            const data = await stroage.get(req.body.namespace); // if not exist, return ''
            res.json({ success: data !== null, data });
        } else {
            // set
            res.json({ success: await stroage.set(req.body.namespace, req.body.data) });
        }
    } catch (e) {
        console.error(e);
        res.json({ success: false, message: e.message });
    }
});

module.exports = app;
// {success:bool,data:any}
