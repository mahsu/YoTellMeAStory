var express = require('express');
var router = express.Router();
var Users = require("../models/users");


router.get('/', function(req, res) {
    var lat = req.query.lat;
    var lon  = req.query.lon;

    Users.nearbyUsers(10000, lat, lon, function(err, results) {
        var response = [];
        if (err) {console.log(err);}

        var counter = 0;
        function increment() {
            counter++;
            if (counter == results.length) {
                console.log(response);
                res.send(response);
            }
        }

        if (results.length >0) {
            for (var i=0; i<results.length; i++) {
                var word = results[i].relatedword;
                GLOBAL.markov.traverse(word, null, results[i], function(str, obj) {
                    obj._doc.sentence = str;
                    console.log(obj);
                    response.push(obj);
                    increment();
                    //results[i]._doc.sentence = str;
                });
            }
        }
        //res.send(results);
        //console.log(response);
        //res.send(response);
    });

});

module.exports = router;
