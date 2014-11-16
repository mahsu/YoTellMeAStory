var express = require('express');
var router = express.Router();
var Users = require("../models/users");


router.get('/', function(req, res) {
    var user = {};
    user.username = req.query.username;
    user.location = req.query.location;
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

function distance(loc1, loc2) {
    var lat1 = loc1[0];
    var lon1 = loc1[1];
    var lat2 = loc2[0];
    var lon2 = loc2[1];
    var R = 6371; // km
    var angle1 = lat1 * Math.PI / 180;
    var angle2 = lat2 * Math.PI / 180;

    var deltaAngle = (lat2-lat1) * Math.PI / 180;
    var deltaLong = (lon2-lon1)  * Math.PI / 180;

    var a = Math.sin(deltaAngle/2) * Math.sin(deltaAngle/2) +
        Math.cos(angle1) * Math.cos(angle2) *
        Math.sin(deltaLong/2) * Math.sin(deltaLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

module.exports = router;
