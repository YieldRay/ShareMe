const version = "0.4.0";
class ShareMe {
    constructor(server) {
        this.server = server;
    }
    async get(namespace) {
        // => string/null
        if (!isNamespaceValid(namespace)) throw new Error("Invalid namespace");
        try {
            typeCheck(namespace, "string");
            const url = new URL(this.server);
            url.pathname = `/${namespace}`;
            const resp = await fetch(url.toString(), {
                method: "POST", // use POST with no body to get data
            });
            if (!resp.ok) return null;
            return await resp.text();
        } catch (e) {
            return null;
        }
    }

    async set(namespace, t) {
        // => true/false
        if (!isNamespaceValid(namespace)) throw new Error("Invalid namespace");
        try {
            typeCheck(namespace, "string");
            typeCheck(t, "string");
            const url = new URL(this.server);
            url.pathname = `/${namespace}`;
            const resp = await fetch(url.toString(), {
                method: "POST",
                body: JSON.stringify({ t }),
                headers: {
                    "content-type": "application/json",
                },
            });
            if (!resp.ok) return false;
            return true;
        } catch (e) {
            return false;
        }
    }
}

function isNamespaceValid(namespace) {
    return /^[a-zA-Z0-9]{1,16}$/.test(namespace);
}

function typeCheck(data, type) {
    if (typeof data !== type) throw new TypeError(`data must be ${type}`);
}

export { ShareMe, version };
