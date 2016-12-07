let express = require('./public/node_modules/express');
let path = require('./public/node_modules/path');
let bodyParser = require('./public/node_modules/body-parser');
let app = express();
let fs = require('fs');
app.use(bodyParser.json());

app.use(express.static('./public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/users', function (req, res) {
    res.sendFile(path.normalize(__dirname + '/users.json'));
});

app.get('/users/:id', function (req, res) {
    let allUsers;
    let selectedUser;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);
        allUsers.forEach(function (currentUser) {
            if (currentUser._id === req.params.id)
                selectedUser = currentUser;
        });

        res.send(selectedUser);
    });
});

app.get('/users/following/:id', function (req, res) {
    let allUsers;
    let selectedUsers = [];
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);

        allUsers.forEach(function (currentUser) {
            currentUser.following.forEach(function (id) {
                if (id === req.params.id) {
                    selectedUsers.push(currentUser);
                }
            })
        });

        res.send(selectedUsers);
    });
});

app.get('/tweets', function (req, res) {
    res.sendFile(path.normalize(__dirname + '/tweets.json'));
});

app.get('/tweets/:userId', function (req, res) {
    let allTweets;
    let selectedTweets = [];
    fs.readFile('tweets.json', 'utf8', function (err, data) {
        if (err) throw err;
        allTweets = JSON.parse(data);

        allTweets.forEach(function (currentTweet) {
            if (currentTweet.user === req.params.userId)
                selectedTweets.push(currentTweet);
        });

        res.send(selectedTweets);
    });
});

app.put('/tweets', function (req, res) {
    let user = req.body.user;
    let text = req.body.text;
    let allTweets = [];

    fs.readFile('tweets.json', 'utf8', function (err, data) {
        if (err) throw err;
        allTweets = JSON.parse(data);
        allTweets.push({text: text, user: user});

        fs.writeFile('tweets.json', JSON.stringify(allTweets), function (err) {
            console.log(err);
        });
    });
});

app.put('/unfollow', function (req, res) {
    let userId = req.body.userId;
    let unfollowedId = req.body.unfollowedId;

    let allUsers;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);
        allUsers.forEach(function (currentUser) {
            if (currentUser._id === userId)
                currentUser.following.forEach(function (followId) {
                    if (followId === unfollowedId) {
                        var index = currentUser.following.indexOf(followId);
                        currentUser.following.splice(index, 1);
                    }
                });
        });

        fs.writeFile('users.json', JSON.stringify(allUsers), function (err) {
            console.log(err);
        });
    });
});

app.put('/follow', function (req, res) {
    let userId = req.body.userId;
    let followedId = req.body.followedId;

    let allUsers;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);
        allUsers.forEach(function (currentUser) {
            if (currentUser._id === userId)
                currentUser.following.push(followedId);
        });

        fs.writeFile('users.json', JSON.stringify(allUsers), function (err) {
            console.log(err);
        });
    });
});

app.put('/users', function (req, res) {
});

app.put('/login', function (req, res) {
});

app.listen(8080);