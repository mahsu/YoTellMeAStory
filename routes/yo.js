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

router.get('/location', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;

    Users.nearbyUsers(10000, lat, lon, function(err, results) {

        if (err) {console.log(err);}

        if (results.length >0) {
            for (var i=0; i<results.length; i++) {
                GLOBAL.markov.traverse(results[i].relatedword, null, function(str) {
                    results[i]._doc.sentence = str;
                });
            }
        }
        res.send(results);
    });

});

module.exports = router;
