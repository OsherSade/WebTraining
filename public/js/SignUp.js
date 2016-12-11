function registerEvents() {
    let registerButton = $("#sign-up-button").elements[0];
    registerButton.addEventListener("click", Register, false);
}

function Register() {
    let username = $("#username").elements[0].value;
    let password = $("#password").elements[0].value;
    let confirmPassword = $("#confirm-password").elements[0].value;

    if (username === "" || password === "" || confirmPassword === "") {
        alert("Fields can't be empty!");
    }

    else if (password !== confirmPassword) {
        alert("The password wasn't confirmed");
    }
    else {
        axios.put('/users', {
            username: username,
            password: password
        })
            .then(function (response) {
                alert("User " + response.data + " created successfully");
                window.location = "/OfekTwitter/Tweets.html";
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}