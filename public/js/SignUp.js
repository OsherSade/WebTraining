function registerEvents() {
    var registerButton = $("#sign-up-button").elements[0];
    registerButton.addEventListener("click", Register, false);
}

function Register() {
    var username = $("#username").elements[0].value;
    var password = $("#password").elements[0].value;
    var confirmPassword = $("#confirm-password").elements[0].value;

    if (ValidateDetails(username, password, confirmPassword)) {
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

function ValidateDetails(username, password, confirmPassword) {
    if (username === "" || password === "" || confirmPassword === "") {
        alert("Fields can't be empty!");
        return false;
    }

    else if (password !== confirmPassword) {
        alert("The password wasn't confirmed");
        return false;
    }

    return true;
}

describe("ValidateDetails", function () {
    it("will alert about empty fields", function () {
        var result = ValidateDetails("Hello", "World", "");
        expect(result).toBe(false);
    });

    it("will alert about password confirmation", function () {
        var result = ValidateDetails("OfekTwitter", "123", "456");
        expect(result).toBe(false);
    });

    it("will pass the validation", function () {
        var result = ValidateDetails("OfekTwitter", "123", "123");
        expect(result).toBe(true);
    });
});