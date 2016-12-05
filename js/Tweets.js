var tweets = [
    {username: "James Bond", text: "Blablabla..."},
    {username: "James Bond", text: "I'm hungry"},
    {username: "Albert Einstein", text: "E = mc^2"},
    {username: "Bill Gates", text: "I think 64 bytes should be enough for everyone"},
    {username: "Frodo", text: "My precious"}
];

function PublishTweet() {
    var input = $("#tweet-text").elements[0].value
    if (input != "") {
        var newTweet = {username: 'Developer', text: input};
        tweets.push(newTweet);
        $("#tweet-text").elements[0].value = "";
    }
    else {
        alert("Can't publish an empty tweet!");
    }

    AppendTweetDiv(newTweet.username, newTweet.text);
}

function GetAllTweets() {
    var publishButton = $("#publish-button").elements[0];
    publishButton.addEventListener("click", PublishTweet, false);

    $("#tweets-section").elements[0].innerHTML = "";

    tweets.forEach(function (tweet) {
        AppendTweetDiv(tweet.username, tweet.text);
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
    tweetDiv.setAttribute("class", "col-md-6");

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

// Tests

function RunTests() {
    test_group('Publish tweet tests', function () {
        assert(PublishEmptyTweet, "Tried to publish an empty tweet");
        assert(CheckLastTweet({username: "Developer", text: "Hello World"}), "Check if the tweet was published");
        assert(CheckTweetTextbox(), "Check if the text box is erased of it's content");
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