var express = require('../public/node_modules/express/index');
var path = require('../public/node_modules/path/path');
var bodyParser = require('../public/node_modules/body-parser/index');
var app = express();
var fs = require('fs');
app.use(bodyParser.json());
var session = require('../public/node_modules/express-session/index');

app.use(session({
    secret: 'OfekTwitter'
}));

var PORT = 8080;
app.use(express.static('../public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/users', function (req, res) {
    res.sendFile(path.normalize(__dirname + '/users.json'));
});

app.get('/users/:id', function (req, res) {
    var allUsers;
    var selectedUser;
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
    var allUsers;
    var selectedUsers = [];
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
    var allTweets;
    var selectedTweets = [];
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
    var user = req.body.user;
    var text = req.body.text;
    var allTweets = [];

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
    var userId = req.body.userId;
    var unfollowedId = req.body.unfollowedId;

    var allUsers;
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
    var userId = req.body.userId;
    var followedId = req.body.followedId;

    var allUsers;
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
    var username = req.body.username;
    var userId = Math.floor((Math.random() * 1000) + 1).toString();
    var password = req.body.password;

    var allUsers;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);
        var currentUser = {"_id": userId, "username": username, "password": password, "following": []};
        req.session.loggedUser = currentUser;

        allUsers.push(currentUser);

        fs.writeFile('users.json', JSON.stringify(allUsers), function (err) {
            console.log(err);
        });

        res.send(username);
    });
});

app.put('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user;
    var allUsers;
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) throw err;
        allUsers = JSON.parse(data);
        allUsers.forEach(function (currentUser) {
            if (currentUser.username === username && currentUser.password === password) {
                user = currentUser;
                req.session.loggedUser = currentUser;
            }
        });

        res.send(user);
    });
});

app.get('/loggedUser', function (req, res) {
    res.send(req.session.loggedUser);
});

app.get('/logout', function (req, res) {
    req.session.loggedUser = undefined;
    res.send(req.session.loggedUser);
});

app.listen(PORT, function () {
    console.log('Server listening on port: ' + PORT);
});