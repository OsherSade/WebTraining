var loggedUser = undefined;

function registerEvents() {
    var loginButton = $("#sign-in-button").elements[0];
    loginButton.addEventListener("click", Login, false);

    GetLoggedUser();
}

function Login() {
    var username = $("#username").elements[0].value;
    var password = $("#password").elements[0].value;

    if (username === "" || password === "") {
        alert("Fields can't be empty!");
    }
    else {
        axios.put('/login', {
            username: username,
            password: password
        })
            .then(function (response) {
                if (response.data === "") {
                    alert("Wrong details");
                }
                else {
                    var logoutButton = $("#log-out").elements[0];
                    logoutButton.addEventListener("click", Logout, false);
                    loggedUser = response.data;
                    alert("Welcome " + loggedUser.username);
                    HideLogTabs();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function HideLogTabs() {
    var elements = $(".guest").elements;
    elements.forEach(function (element) {
        element.style.display = "none";
    });
    $("#log-out").css("display", "block");
}

function ShowLogTabs() {
    $("#login-form").css("display", "block");

    var elements = $(".guest").elements;
    elements.forEach(function (element) {
        element.style.display = "block";
    });
    $("#log-out").css("display", "none");
}

function Logout() {
    axios.get('http://127.0.0.1:8080/logout')
        .then(function (response) {
            loggedUser = undefined;
            ShowLogTabs();
            $("#login-form").css("display", "block");
        })
        .catch(function (error) {
            console.log(error);
        });
}

function GetLoggedUser() {
    axios.get('http://127.0.0.1:8080/loggedUser')
        .then(function (response) {
            loggedUser = response.data;
            if (loggedUser === "") loggedUser = undefined;
            if (loggedUser === undefined) {
                ShowLogTabs();
            } else {
                HideLogTabs();
                $("#login-form").css("display", "none");
                alert("User already logged in!");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}