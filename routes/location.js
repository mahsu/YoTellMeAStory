var express = require('express');
var router = express.Router();
var Users = require("../models/users");


router.get('/', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;

    Users.nearbyUsers(10000, lat, lon, function(err, results) {

        if (err) {console.log(err);}
        if (results.length >0) {
            for (var i=0; i<results.length; i++) {
                console.log(results[i]);
                var word = results[i].relatedword;
                GLOBAL.markov.traverse(word, null, function(str) {
                    console.log(results[i]);
                    results[i]._doc.sentence = str;
                });
            }
        }
        res.send(results);
    });

});

module.exports = router;
