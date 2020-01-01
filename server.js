/** 
 * @main_library 
 *    https://github.com/suufi/noblox.js/tree/master
 * 
 * @author H_mzah
 *    https://devforum.roblox.com/u/h_mzah/summary
 *    https://github.com/Hamzah-z
 * 
 * Special thanks to sentanos/Froast for making roblox-js-server. This is heavily inspired from it.
 *    https://github.com/sentanos
 *    https://github.com/sentanos/roblox-js
 * 
*/

// Libraries

let roblox = require("noblox.js");
let express = require("express");
let BodyParser = require("body-parser");

// Configs

let config = require("./config.json"); // Stores configurations, such as login cookie

// Modules

let Utility = require("./utility/functions.js"); // Module containing utility functions

// Express Initialization

let app = express();
let port = process.env.PORT || 8080;

app.set("env", "production");
app.use(BodyParser.json()); // Helpful for parsing the body into JSON
app.use(Utility.Authenticate); // Authenticate all requests for the correct auth_key

// Main

// Validate all Promotions/Demotions
const { Promotions, SetRank, JoinRequests, GroupShouts, Validate } = require('./utility/validator.js')

app.get("/", (req, res) => res.status(200).send("Server is online!")); // Basic homepage

app.post("/Promote", Promotions(), Validate, Utility.ChangeRank(1)); // Validate the body contents, then ChangeRank to +1
app.post("/Demote", Promotions(), Validate, Utility.ChangeRank(-1)); // Validate the body contents, then ChangeRank to -1
app.post("/SetRank", SetRank(), Validate, function (req, res, next) {
    // At this point the request has been authenticated and body contents are validated.

    let Group = req.body.Group
    let Target = req.body.Target
    let Rank = req.body.Rank

    Utility.SetRank(res, Group, Target, Rank) // Use the Utility.SetRank function to set the rank
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: err.message })
        });
});

app.post("/HandleJoinRequest", JoinRequests(), Validate, function (req, res, next) {
    // At this point the request has been authenticated and body contents are validated.

    let Group = req.body.Group
    let Username = req.body.Username
    let Accept = req.body.Accept

    roblox.handleJoinRequest({ group: Group, username: Username, accept: Accept })
        .then(() => {
            console.log(`Handled join request of user ${Username} successfully.`)
            res.status(200).send({
                error: null,
                message: `Handled join request of user ${Username} successfully.`
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: err.message })
        });
});

app.post("/GroupShout", GroupShouts(), Validate, function (req, res, next) {
    // At this point the request has been authenticated and body contents are validated.

    let Group = req.body.Group
    let Message = req.body.Message

    roblox.shout({ group: Group, message: Message })
        .then(() => {
            console.log(`Shouted to group ${Group} successfully.`)
            res.status(200).send({
                error: null,
                message: `Shouted to group ${Group} successfully.`
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: err.message })
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Internal server error: ${err}`);
});

async function login() {
    await roblox.cookieLogin(config.user_cookie); // thanks for ruining logins roblox
    return await roblox.getCurrentUser();
}

login()
    .then(current_user => {
        console.log(current_user); // Log information about the current user
        app.listen(port, function () {
            console.log(`Listening at http://localhost:${port}`);
        });
    })
    .catch(err => {
        let errorApp = express();
        errorApp.get("/*", function (req, res, next) {
            res.json({ error: "Server configuration error: " + err });
        });
        errorApp.listen(port, function () {
            console.log("Error running server: " + err);
        });
    });