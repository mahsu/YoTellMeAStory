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
            GLOBAL.io.emit('data', result);
            //push via socketio
            //console.log(result);
            res.send(result);
        }
    });

});

router.get('/location', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;

    Users.nearbyUsers(10000, lat, lon, function(err, result) {
        if (err) console.log(err);


        console.log(result);
        res.send(result);
    });

});

module.exports = router;
