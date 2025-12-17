const darkModeSound = new Audio("Resources/sfx/darkmode.mp3");
const lightModeSound = new Audio("Resources/sfx/lightmode.mp3");

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
let currentMode = null;

/* ------------------------------
   COOKIE HELPERS
------------------------------ */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
}

function getCookie(cname) {
    const name = cname + "=";
    return document.cookie
        .split(";")
        .map(c => c.trim())
        .find(c => c.startsWith(name))
        ?.slice(name.length) || "";
}

/* ------------------------------
   DARK MODE TOGGLE
------------------------------ */
function toggleDarkMode(newState, shouldPlaySound = true, updateCookie = true) {
    if (currentMode === newState) return;

    const toggleIcon = document.querySelector(".dark-mode-toggle i");
    toggleIcon.classList.add("switching");

    setTimeout(() => {
        if (newState === "on") {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable({ brightness: 140, contrast: 100 });
            toggleIcon.className = "fa-solid fa-sun";
            if (shouldPlaySound) playSound(darkModeSound);
        } else {
            DarkReader.disable();
            toggleIcon.className = "fa-solid fa-moon";
            if (shouldPlaySound) playSound(lightModeSound);
        }

        if (updateCookie) {
            setCookie("darkmode", newState, 9999);
        }

        currentMode = newState;
        toggleIcon.classList.remove("switching");
    }, 300);
}

/* ------------------------------
   CLICK HANDLER
------------------------------ */
document.querySelector(".dark-mode-toggle").addEventListener("click", () => {
    toggleDarkMode(currentMode === "on" ? "off" : "on");
});

/* ------------------------------
   INITIAL LOAD (COOKIE FIRST)
------------------------------ */
window.addEventListener("load", () => {
    const cookieMode = getCookie("darkmode");

    if (cookieMode === "on" || cookieMode === "off") {
        // User preference ALWAYS wins
        toggleDarkMode(cookieMode, false, false);
    } else {
        // No cookie → use system preference
        toggleDarkMode(prefersDark.matches ? "on" : "off", false, true);
    }
});

/* ------------------------------
   SYSTEM CHANGE (ONLY IF NO COOKIE)
------------------------------ */
prefersDark.addEventListener("change", (e) => {
    const cookieMode = getCookie("darkmode");
    if (!cookieMode) {
        toggleDarkMode(e.matches ? "on" : "off", false, true);
    }
});
