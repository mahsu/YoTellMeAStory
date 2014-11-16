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
    Users.addUser(user, function(err, results) {
        if (err) console.log(err);
        else {
                console.log(results[0]);
                results.sentence = "d";//gen
                console.log(result);
                    GLOBAL.io.emit('data', result);
                    res.send(results);


        }
    });

});

router.get('/location', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;

    Users.nearbyUsers(10000, lat, lon, function(err, results) {

        if (err) {console.log(err);}

        results[0]._doc.sentence = "";
        res.send(results);
    });

});

module.exports = router;
