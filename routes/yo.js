var express = require('express');
var router = express.Router();
var Users = require("../models/users");


router.get('/', function(req, res) {
    var user = {};
    user.username = req.query.username;
    user.location  = req.query.location.split(";");
    Users.addUser(user, function(err, result) {
        if (err) console.log(err);

        console.log(result);
        res.send(result);
        //push new story
        //broadcast
    });

});

router.get('/location', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;
    Users.nearbyUsers(1/3963, lat, lon, function(err, result) {
        if (err) console.log(err);


        console.log(result);
        res.send(result);
        //push new story
        //broadcast
    });

});

module.exports = router;
