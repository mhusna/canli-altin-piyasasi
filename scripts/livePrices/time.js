function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // ay 0-11 olduğundan +1
    const year = now.getFullYear();
    return `${day}.${month}.${year}`; // örn: "03.11.2025"
}

setInterval(() => {
    const timeElement = document.querySelector('.timeContainer');
    if (timeElement) {
        timeElement.textContent = `${getCurrentDate()} || ${getCurrentTime()}`;
    }
}, 1000);