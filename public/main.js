import { ShareMe, version } from "./client.js";
const app = new ShareMe(location.origin);
console.log("%cShareMe-v" + version, "color: #fff; background: #6CB7DA; font-size: 16px;");
const namespace = window.location.pathname.slice(1);
if (namespace === "" || !/^[a-zA-Z]+$/.test(namespace) || namespace.length > 16) {
    location.pathname = generateRandomString();
}

function generateRandomString(length = 6) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let text = "";
    for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

async function updateFromServer($textarea, $info) {
    const data = await app.get(namespace);
    if (data === null) {
        $info.className = "red";
    } else {
        $info.className = "green";
        $textarea.value = data;
    }
    $info.innerText = "Last Update: " + new Date().toLocaleString();
}
async function updateToServer($textarea, $info) {
    const data = $textarea.value;
    const success = await app.set(namespace, data);
    if (success) {
        $info.className = "green";
    } else {
        $info.className = "red";
    }
    $info.innerText = "Last Update: " + new Date().toLocaleString();
}

document.addEventListener("DOMContentLoaded", () => {
    const $textarea = document.getElementById("$textarea");
    const $info = document.getElementById("$info");
    updateFromServer($textarea, $info);
    $info.addEventListener("click", () => updateFromServer($textarea, $info));
    $info.style.cursor = "pointer";
    $textarea.addEventListener(
        "input",
        _.debounce(() => updateToServer($textarea, $info), 1000)
    );
});
