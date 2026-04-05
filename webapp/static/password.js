function generatePassword() {

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"

    let password = "";

    for (let i=0; i < 14; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars [randomIndex]
    }

    document.getElementById("passwordOutput").value = password;

}

function copyPassword(btn) {
    const text = document.getElementById("passwordOutput").value;
    navigator.clipboard.writeText(text);

    btn.innerText = "Copied!";
    setTimeout(() => {
        btn.innerText = "Copy";
    }, 1000);
}