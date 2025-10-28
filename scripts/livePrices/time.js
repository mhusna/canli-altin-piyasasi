function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


const body = document.getElementsByClassName("main-cell")[0];
document.getElementsByClassName("ad-cell")[0].style.height = (body.clientHeight - 15) + "px";

window.addEventListener("resize", () => {
    const body = document.getElementsByClassName("main-cell")[0];
    document.getElementsByClassName("ad-cell")[0].style.height = (body.clientHeight - 15) + "px";
})

setInterval(() => {
    const timeElement = document.querySelector('.currentTime');
    if (timeElement) {
        timeElement.textContent = getCurrentTime();
    }
}, 1000);