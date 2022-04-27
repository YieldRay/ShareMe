const version = "0.3.0";
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
                method: "POST",
            });
            if (!resp.ok) return null;
            return await resp.text();
        } catch (e) {
            return null;
        }
    }

    async set(namespace, data) {
        // => true/false
        if (!isNamespaceValid(namespace)) throw new Error("Invalid namespace");
        try {
            typeCheck(namespace, "string");
            typeCheck(data, "string");
            const url = new URL(this.server);
            url.pathname = `/${namespace}`;
            const resp = await fetch(url.toString(), {
                method: "POST",
                body: JSON.stringify({ data }),
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
