var WordPOS = require('wordpos'), wordpos = new WordPOS();
var async = require('async');

function getPos(str, finished) {
    async.parallel([
        function(callback) {
            wordpos.isVerb(str, function(res, word) {
                if (res) {
                    callback(null, 'v');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isNoun(str, function(res, word) {
                if (res) {
                    callback(null, 'n');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isAdjective(str, function(res, word) {
                if (res) {
                    callback(null, 'ad');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isAdverb(str, function(res, word) {
                if (res) {
                    callback(null, 'av');
                } else {
                    callback(null);
                }
            });
        }
    ], function(err, res) {
        finished(res);
    });
}

function Markov(text, callback) {
    //text = text.split(".");
    //text = text.match(/[^\.!\?]+[\.!\?]+/g);
    this.seed = [];
    for (var i = 0; i < text.length; i++) {
        var wordList = text[i].trim().split(" ");
        this.seed[i] = wordList.slice(0);
    }
    this.elements = [];  //words in graph
    if (this.seed.length == 0) {
        return;
    }

    this.loopAdd(0, 0, this.seed, function() {
        callback();
    });
    /*var that = this;
     async.series([
     function(callback) {
     for (var i = 0; i < that.seed.length; i++) {
     if (that.seed[i].length > 1) {
     for (var j = 0; j < that.seed[i].length - 1; j++) {
     that.add(that.seed[i][j], that.seed[i][j + 1]);
     }
     }
     }
     }
     ], function(err, res) {
     callback();
     });*/
    /*for (var i = 0; i < this.seed.length; i++) {
     if (this.seed[i].length > 1) {
     for (var j = 0; j < this.seed[i].length - 1; j++) {
     this.add(this.seed[i][j], this.seed[i][j + 1]);
     }
     }
     }*/
}

Markov.prototype.loopAdd = function(i, j, sentences, callback) {
    var that = this;
    if (i < sentences.length) {
        if (j < sentences[i].length -1) {
            this.add(sentences[i][j], sentences[i][j+1], function() {
                j++;
                return that.loopAdd(i, j, sentences, callback);
            });
        } else {
            j = 0;
            i++;
            return that.loopAdd(i, j, sentences, callback);
        }
    } else {
        return callback();
    }
};

/* add str2 to end of str1*/
Markov.prototype.add = function (str1, str2, callback) {
    var n1 = this.find(str1);
    var n2 = this.find(str2);
    var markov = this;

    if (n1 == false) {
        getPos(str1, function(pos) {
            n1 = new Node(str1, pos);
            markov.elements.push(n1);
            if (n2 == false) {
                getPos(str2, function(pos) {
                    n2 = new Node(str2, pos);
                    markov.elements.push(n2);
                    n1.addChild(n2);
                    return callback();
                });
            } else {
                n1.addChild(n2);
                return callback();
            }
        });
    } else {
        if (n2 == false) {
            getPos(str2, function(pos) {
                n2 = new Node(str2, pos);
                markov.elements.push(n2);
                n1.addChild(n2);
                return callback();
            });
        } else {
            n1.addChild(n2);
            return callback();
        }
    }
};

Markov.prototype.find = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].val == str) {
            return this.elements[i];
        }
    }
    return false;
};

Markov.prototype.traverse = function (start, maxDepth, callback) {
    if (maxDepth == null) {maxDepth = 20;}
    start = this.find(start);
    var chain = [];
    if (start != false) {
        var currentDepth = 0;
        var currentNode = start;
        while (currentDepth < maxDepth) {
            chain.push(currentNode.val);
            currentNode = currentNode.next();
            if (currentNode == false) {
                break;
            }
            currentDepth++;
        }
    }
    callback(chain.join(" "));
}

function Node(string, pos) {
    this.pos = pos;
    this.val = string;
    this.children = [];
}

Node.prototype.findChild = function (n) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i][0] == n) {
            return i;
        }
    }
    return false;
};

Node.prototype.addChild = function (n) {
    var child_idx = this.findChild(n);
    if (child_idx !== false) {
        this.children[child_idx][1]++;
    } else {
        this.children.push([n, 1]);
    }
};

//returns most common child
Node.prototype.next = function () {
    if (this.children.length != 0) {
        var maxNum = 0;
        var maxChildren = [];
        for (var i = 0; i < this.children.length; i++) {
            if (maxChildren.length == 0) {
                maxChildren.push(this.children[i]);
                maxNum = this.children[i][1];
            }
            else if (this.children[i][1] > maxChildren[0][1]) {
                maxChildren = [];
                maxChildren.push(this.children[i]);
                maxNum = this.children[i][1];
            } else if (this.children[i][1] = maxChildren[0][1]) {
                maxChildren.push(this.children[i]);
            }
        }
        var idx = parseInt(Math.random()*(maxChildren.length));
        return maxChildren[idx][0];
    }
    else return false;
};

module.exports = Markov;