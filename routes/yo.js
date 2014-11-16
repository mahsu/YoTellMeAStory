var express = require('express');
var router = express.Router();
var Users = require("../models/users");


router.get('/', function(req, res) {
    var user = {};
    user.username = req.query.username;
    user.location = req.query.location;
    //check that location is provided
    if (typeof user.location != "undefined")
        user.location = user.location.split(";");
    else {
        user.location[0] = 0;
        user.location[1] = 0;
    }
    Users.addUser(user, function(err, result) {
        if (err) console.log(err);
        else {
                GLOBAL.markov.traverse(result.relatedword, null, function(str) {
                    result._doc.sentence = str;
                    GLOBAL.io.emit('data', result);
                    res.send(result);
                });

        }
    });

});

module.exports = router;
