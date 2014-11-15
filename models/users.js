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
            //user exists
            console.log("user exists");
            callback(null, result.relatedword);
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
                function(user, done) {
                    console.log(user.username);
                    //save user details
                    var user = new that({
                        username: user.username,
                        relatedword: user.relatedword,
                        loc: user.location
                    });

                    user.save(function(err) {
                        done(err, user);
                    })

                }
            ], callback(null, user))
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