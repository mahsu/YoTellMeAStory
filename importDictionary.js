var fs = require('fs');

exports.setup = function(callback) {
    fs.readFile( __dirname + '/american-english.txt', function (err, data) {
        var words;
        if (err) {
            throw err;
        }
        words = data.toString().split("\n");
        words = words.map(function(str) { return str.toLowerCase() });
        callback(null, words);
    });
};