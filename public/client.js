const version = "0.0.3";
class ShareMe {
    constructor(server) {
        this.server = server;
    }
    async get(namespace) {
        typeCheck(namespace, "string");
        const resp = await fetch(this.server, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ namespace }),
        });
        if (!resp.ok) return null;
        const json = await resp.json();
        if (json.success) return json.data;
        return null;
    }

    async set(namespace, data) {
        typeCheck(namespace, "string");
        typeCheck(data, "string");
        const resp = await fetch(this.server, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ namespace, data }),
        });
        if (!resp.ok) return false;
        const json = await resp.json();
        return json.success;
    }
}

function typeCheck(data, type) {
    if (typeof data !== type) throw new TypeError(`data must be ${type}`);
}

export { ShareMe, version };
