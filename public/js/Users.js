var users = [];
var loggedUserId;

function GetAllUsers() {
    axios.get('http://127.0.0.1:8080/users')
        .then(function (response) {
            users = response.data;
            GetLoggedUser();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function AppendUsers() {
    var docfrag = document.createDocumentFragment();

    var logoutButton = $("#log-out").elements[0];
    logoutButton.addEventListener("click", Logout, false);

    var filterButton = $("#filter-button").elements[0];
    filterButton.addEventListener("click", FilterUsers, false);

    var usersDiv = $("#users-section").elements[0];
    usersDiv.innerHTML = "";

    var offsetDiv = document.createElement("div");
    offsetDiv.setAttribute("class", "col-md-9");

    users.forEach(function (user) {

        if (user._id !== loggedUserId) {
            var wrappingDiv = document.createElement("div");
            wrappingDiv.setAttribute("class", "col-md-2");
            wrappingDiv.setAttribute("id", "user_" + user.username.replace(/\s/g, ''));

            offsetDiv.appendChild(wrappingDiv);

            var imageDiv = document.createElement("div");
            imageDiv.setAttribute("class", "thumbnail centered");

            var image = document.createElement("img");
            image.setAttribute("src", "../images/useravatar.png");
            imageDiv.appendChild(image);
            imageDiv.appendChild(document.createElement("br"));

            var followButton = document.createElement("button");
            followButton.setAttribute("id", "button_" + user.username.replace(/\s/g, ''));
            followButton.setAttribute("class", "btn btn-primary");
            followButton.setAttribute("onclick", "FollowUser(this, '" + user.username + "');");
            followButton.innerHTML = "follow";
            imageDiv.appendChild(followButton);
            imageDiv.appendChild(document.createElement("br"));
            imageDiv.appendChild(document.createElement("br"));
            imageDiv.appendChild(document.createTextNode(user.username));

            wrappingDiv.appendChild(imageDiv);
            offsetDiv.appendChild(wrappingDiv);
        }
    });

    docfrag.appendChild(offsetDiv);
    usersDiv.appendChild(docfrag);

    var followeesDiv = document.createElement("div");
    followeesDiv.setAttribute("class", "bordered centered col-md-2");
    followeesDiv.setAttribute("id", "followees-div");

    var followeesTitle = document.createElement("div");
    followeesTitle.setAttribute("class", "h2");
    followeesTitle.innerHTML = "Followees";

    followeesDiv.appendChild(followeesTitle);
    usersDiv.appendChild(followeesDiv);
}

function FollowUser(button, username) {
    var followeesDiv = $("#followees-div").elements[0];
    var buttonText = button.innerHTML;

    if (buttonText === "follow") {
        WriteFolloweeToFile(loggedUserId, GetUserId(username));
        button.innerHTML = "unfollow";
        button.setAttribute("class", "btn btn-danger");

        appendFollowee(username);
    }
    else {
        RemoveFolloweeToFile(loggedUserId, GetUserId(username));
        button.innerHTML = "follow";
        button.setAttribute("class", "btn btn-primary");

        var unfollowedUserDiv = $("#" + username.replace(/\s/g, '')).elements[0];
        followeesDiv.removeChild(unfollowedUserDiv);

        followedButton(username);
    }
}

function FilterUsers() {
    var filterText = $("#filter-text").elements[0].value;

    users.forEach(function (user) {
        $("#user_" + user.username.replace(/\s/g, '')).css("display", "block");
        if ((user.username).indexOf(filterText) === -1) {
            $("#user_" + user.username.replace(/\s/g, '')).css("display", "none");
        }
    });
}

function GetFollowees() {
    if (loggedUserId !== undefined) {
        axios.get('http://127.0.0.1:8080/users/' + loggedUserId)
            .then(function (response) {
                var currentUser = response.data;
                currentUser.following.forEach(function (followee) {
                    axios.get('http://127.0.0.1:8080/users/' + followee)
                        .then(function (response) {
                            appendFollowee(response.data.username);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function appendFollowee(username) {
    var followeesDiv = $("#followees-div").elements[0];

    unfollowedButton(username);

    var userDiv = document.createElement("div");
    userDiv.setAttribute("id", username.replace(/\s/g, ''));
    userDiv.setAttribute("class", "thumbnail centered smaller");
    var image = document.createElement("img");
    image.setAttribute("src", "../images/useravatar.png");
    userDiv.appendChild(image);
    userDiv.appendChild(document.createElement("br"));

    var unfollowButton = document.createElement("button");
    unfollowButton.setAttribute("class", "btn btn-danger");
    unfollowButton.setAttribute("onclick", "FollowUser(this, '" + username + "');");
    unfollowButton.innerHTML = "unfollow";
    userDiv.appendChild(unfollowButton);
    userDiv.appendChild(document.createElement("br"));
    userDiv.appendChild(document.createElement("br"));

    userDiv.appendChild(document.createTextNode(username));
    followeesDiv.appendChild(userDiv)
}

function unfollowedButton(username) {
    var userButton = $("#button_" + username.replace(/\s/g, '')).elements[0];
    userButton.innerHTML = "unfollow";
    userButton.setAttribute("class", "btn btn-danger");
}

function followedButton(username) {
    var userButton = $("#button_" + username.replace(/\s/g, '')).elements[0];
    userButton.innerHTML = "follow";
    userButton.setAttribute("class", "btn btn-primary");
}

function WriteFolloweeToFile(userId, followedId) {
    axios.put('/follow', {
        userId: userId,
        followedId: followedId
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function RemoveFolloweeToFile(userId, unfollowedId) {
    axios.put('/unfollow', {
        userId: userId,
        unfollowedId: unfollowedId
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function GetUserId(username) {
    var userId;
    users.forEach(function (user) {
        if (user.username === username)
            userId = user._id;
    });
    return userId;
}

function GetLoggedUser() {
    axios.get('http://127.0.0.1:8080/loggedUser')
        .then(function (response) {
            loggedUserId = response.data._id;
            if (loggedUserId !== undefined) {
                HideLogTabs();
                AppendUsers();
                GetFollowees();
            }
            else {
                window.location = "/OfekTwitter/SignIn.html";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function HideLogTabs() {
    var elements = $(".guest").elements;
    elements.forEach(function (element) {
        element.style.display = "none";
    });

    $("#log-out").css("display", "block");
}

function ShowLogTabs() {
    $("#users-section").css("display", "block");
    var elements = $(".guest").elements;
    elements.forEach(function (element) {
        element.style.display = "block";
    });

    $("#log-out").css("display", "none");
}

function Logout() {
    axios.get('http://127.0.0.1:8080/logout')
        .then(function (response) {
            loggedUserId = undefined;
            ShowLogTabs();
            $("#users-section").css("display", "none");
        })
        .catch(function (error) {
            console.log(error);
        });
}