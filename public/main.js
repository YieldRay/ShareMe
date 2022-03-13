import { ShareMe, version } from "./client.js";
const app = new ShareMe(location.origin);
console.log("%cShareMe-v" + version, "color: #fff; background: #6CB7DA; font-size: 16px;");
const namespace = window.location.pathname.slice(1);
if (namespace === "" || !/^[a-zA-Z0-9]{1,16}$/.test(namespace)) {
    location.pathname = generateRandomString();
}

function generateRandomString(length = 4) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

function debounce(func, wait = 0) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), wait);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const $textarea = document.getElementById("$textarea");
    const $info = document.getElementById("$info");
    updateFromServer($textarea, $info);
    $info.addEventListener("click", () => updateFromServer($textarea, $info));
    $info.style.cursor = "pointer";
    $textarea.addEventListener(
        "input",
        debounce(() => updateToServer($textarea, $info), 1000)
    );
});