Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

var words = GLOBAL.dictionary;
exports.convert = function(uname, callback) {
    var max_len = 10;
    var word = "";
    uname = uname.substring(0, 19);
    for (var i = 0; i < uname.length; i++) {
        var chunk = uname.substring(i, i+max_len+1);
        for (var j = 1; j < chunk.length + 1; j++) {
            var w = chunk.substring(0, j);
            w = w.toLowerCase();
            var w2 = w
                .replace(/3/g, 'e')
                .replace(/5/g, 's')
                .replace(/0/g, 'o')
                .replace(/1/g, 'l')
                .replace(/6/g, 'g')
                .replace(/9/g, 'g')
                .replace(/7/g, 't')
                .replace(/[^a-z]/g, '');
            w = w.replace(/[^a-z]/g, '');
            if (words.contains(w) && w.length > word.length) {
                word = w;
            }
            if (words.contains(w2) && w2.length > word.length) {
                word = w2;
            }
        }
    }
    return callback(null, word);
};