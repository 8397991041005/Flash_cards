signup.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!email.value || !password.value) {
        alert("Please enter email and password");
        return;
    }

    console.log("Email:", email.value, "Password:", password.value); // Debugging

    const data = { email: email.value, password: password.value };
    const response = await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();
    if (res.status === "ok") {
        window.location.href = "/home";
    } else {
        alert(res.error);
    }
});
