var tweets = [];
var users = [];
var loggedUserId;

function PublishTweet() {
    var input = $("#tweet-text").elements[0].value;
    if (loggedUserId === undefined) {
        alert("You must login in order to publish a tweet");
        return;
    }
    if (input != "") {
        var newTweet = {user: loggedUserId, text: input};
        addToJsonFile(newTweet);
        tweets.push(newTweet);
        $("#tweet-text").elements[0].value = "";

        users.forEach(function (user) {
            if (user._id === newTweet.user)
                newTweet.username = user.username;
        });

        AppendTweetDiv(newTweet.username, newTweet.text);
    }
    else {
        alert("Can't publish an empty tweet!");
    }
}

function addToJsonFile(newTweet) {
    axios.put('/tweets', {
        text: newTweet.text,
        user: newTweet.user
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function GetAllTweets() {

    $("#tweets-section").elements[0].innerHTML = "";

    axios.get('http://127.0.0.1:8080/users')
        .then(function (response) {
            users = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

    axios.get('http://127.0.0.1:8080/tweets')
        .then(function (response) {
            tweets = response.data;

            tweets.forEach(function (tweet) {
                users.forEach(function (user) {
                    if (user._id === tweet.user)
                        tweet.user = user.username;
                });
                AppendTweetDiv(tweet.user, tweet.text);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function AppendTweetDiv(username, text) {
    var docfrag = document.createDocumentFragment();

    var offsetDiv = document.createElement("div");
    offsetDiv.setAttribute("class", "col-md-offset-1 move-down");

    var wrappingDiv = document.createElement("div");
    wrappingDiv.setAttribute("class", "col-md-10");

    offsetDiv.appendChild(wrappingDiv);

    var imageDiv = document.createElement("div");
    imageDiv.setAttribute("class", "col-md-1");

    var image = document.createElement("img");
    image.setAttribute("src", "../images/useravatar.png");

    imageDiv.appendChild(image);

    var tweetDiv = document.createElement("div");
    tweetDiv.setAttribute("class", "col-md-11");

    wrappingDiv.appendChild(imageDiv);
    wrappingDiv.appendChild(tweetDiv);

    var boldText = document.createElement("b");
    boldText.appendChild(document.createTextNode(username + " says: "));

    tweetDiv.appendChild(boldText);
    tweetDiv.appendChild(document.createElement("br"));
    tweetDiv.appendChild(document.createTextNode(text));

    docfrag.appendChild(offsetDiv);
    $("#tweets-section").elements[0].appendChild(docfrag);
    $("#tweets-section").elements[0].appendChild(document.createElement("br"));
}

function GetLoggedUser() {
    var publishButton = $("#publish-button").elements[0];
    publishButton.addEventListener("click", PublishTweet, false);

    var logoutButton = $("#log-out").elements[0];
    logoutButton.addEventListener("click", Logout, false);

    axios.get('http://127.0.0.1:8080/loggedUser')
        .then(function (response) {
            loggedUserId = response.data._id;
            if (loggedUserId !== undefined) {
                HideLogTabs();
                GetAllTweets();
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
    $("#tweets-section").css("display", "block");

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
            $("#tweets-section").css("display", "none");
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Tests

function RunTests() {
    test_group('Publish tweet tests', function () {
        //assert(PublishEmptyTweet(), "Tried to publish an empty tweet");
        assert(CheckLastTweet({user: "Developer", text: "Hello World"}), "Check if the tweet was published");
        assert(CheckTweetTextbox(), "Check if the text box is erased of it's content");
        //assert((() => 1 === '1')(), "check equality");
    });
}

function PublishEmptyTweet() {
    $("#tweet-text").elements[0].value = "";
    PublishTweet();

    return tweets.length === 5;
}

function CheckLastTweet(tweet) {
    $("#tweet-text").elements[0].value = "Hello World"
    PublishTweet();

    return (tweet.username === tweets[tweets.length - 1].username &&
    tweet.text === tweets[tweets.length - 1].text);
}

function CheckTweetTextbox() {
    $("#tweet-text").elements[0].value = "Welcome to OfekTwitter!";
    PublishTweet();

    return document.getElementById("tweet-text").value === "";
}