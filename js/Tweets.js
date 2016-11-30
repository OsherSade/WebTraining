var tweets = [
    {username: "James Bond", text: "Blablabla..."},
    {username: "James Bond", text: "I'm hungry"},
    {username: "Albert Einstein", text: "E = mc^2"},
    {username: "Bill Gates", text: "I think 64 bytes should be enough for everyone"},
    {username: "Frodo", text: "My precious"}
];

function PublishTweet() {
    var input = document.getElementById("tweet-text").value;
    if (input != "") {
        var newTweet = {username: 'OshWeb', text: input};
        tweets.push(newTweet);
        document.getElementById("tweet-text").value = "";
    }
    else {
        alert("Can't publish an empty tweet!");
    }

    GetAllTweets();
}

function GetAllTweets() {
    document.getElementById("tweets-section").innerHTML = "";

    for (currentTweet in tweets) {

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
        boldText.appendChild(document.createTextNode(tweets[currentTweet].username + " says: "));

        tweetDiv.appendChild(boldText);
        tweetDiv.appendChild(document.createElement("br"));
        tweetDiv.appendChild(document.createTextNode(tweets[currentTweet].text));

        document.getElementById("tweets-section").appendChild(offsetDiv);
        document.getElementById("tweets-section").appendChild(document.createElement("br"));
    }
}