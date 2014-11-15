var mongoose = require("mongoose");
var async = require("async");
var usernameProcessor = require("../usernameProcessor");

var userSchema = new mongoose.Schema({
    username: String,
    relatedword: String,
    loc: {
        index: '2dsphere',
        type: [Number]
    }
});

userSchema.statics.addUser = function(user, callback) {
    var that = this;

    that.findOne({'username': user.username}, function(err, result) {
        if (!err && result) {
            //todo: find and update
            //user exists
            //update location if different
            if (user.location != result.loc) {
                console.log(user.location);
                console.log(result.loc);
                that.update({'username': user.username}, {'loc': user.location}, function (err, res) {
                    if (!err){
                        result.location = user.location;
                        console.log(result);
                        callback(null, result);
                    }
                    else console.log(err);
                });
            }
        }
        else {
            async.waterfall([
                function(done) {
                    //generate words related to user
                     usernameProcessor.convert(user.username, function(err, word) {
                        if (err) console.log(err);
                         user.relatedword = word;
                         done(null, user);
                    });
                },
                function(usr, done) {
                    console.log(usr.relatedword);
                    //save user details
                    var user = new that({
                        'username': usr.username,
                        'relatedword': usr.relatedword,
                        loc: usr.location
                    });
                    console.log(user.relatedword);
                    user.save(function(err) {
                        done(err, user);
                    })

                }
            ], function(err, res) {
                callback(err, res);
            })
        }
    })
};

userSchema.statics.nearbyUsers = function(maxdist, lat, lon, callback) {
    var that = this;
    var findParams = {
        loc: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lat, lon]
                },
                $maxDistance: maxdist
            }
        }
    };

    that.find(findParams, function(err, results) {
        callback(err, results);
    });
};

module.exports = mongoose.model('users', userSchema);