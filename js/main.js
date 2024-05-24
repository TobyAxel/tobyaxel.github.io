function changeAmount() {
    const currentAmout = document.getElementById('message').value;
    document.getElementById('currentamount').innerHTML = currentAmout.length;
}

function sendMessage() {
    const message = document.getElementById('message').value;

    if (message === "chess") {
        window.location.href = "../secret/html/chess";
    }
}