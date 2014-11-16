var WordPOS = require('wordpos'), wordpos = new WordPOS();
var async = require('async');

var prepositions = ["aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "anti", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "concerning", "considering", "despite", "down", "during", "except", "excepting", "excluding", "following", "for", "from", "in", "inside", "into", "like", "minus", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "per", "plus", "regarding", "round", "save", "since", "than", "through", "to", "toward", "towards", "under", "underneath", "unlike", "until", "up", "upon", "versus", "via", "with", "within", "without"];

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

function getPos(str, finished) {
    str = str.replace(/[^a-zA-Z]/,'');
    async.parallel([
        function(callback) {
            wordpos.isVerb(str, function(res, word) {
                if (res) {
                    callback(null, 'V');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isNoun(str, function(res, word) {
                if (res) {
                    callback(null, 'N');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isAdjective(str, function(res, word) {
                if (res) {
                    callback(null, 'A');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            wordpos.isAdverb(str, function(res, word) {
                if (res) {
                    callback(null, 'AV');
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            if (prepositions.contains(str)) {
                callback(null, 'P');
            } else {
                callback(null);
            }
        }
    ], function(err, res) {
        var new_res = [];
        for (var i =0; i < res.length; i++) {
            if (typeof(res[i])!=="undefined") {
                new_res.push(res[i]);
            }
        }
        if (new_res.length == 0) {
            new_res.push('Det');
        }
        finished(new_res);
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

    /*this.loopAdd(0, 0, this.seed, function() {
        callback();
    });*/

    this.loopAdd2(0, 0, this.seed, function(obj) {
        callback(obj);
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

Markov.prototype.loopAdd2 = function(i, j, sentences, callback) {
    var that = this;
    if (i < sentences.length) {
        if (j < sentences[i].length -2) {
            console.log("calling: " + sentences[i][j] + " " + sentences[i][j+1] + " " + sentences[i][j+2]);
            that.add2(sentences[i][j], sentences[i][j+1], sentences[i][j+2], function() {
                j++;
                return that.loopAdd2(i, j, sentences, callback);
            });
        } else {
            j = 0;
            i++;
            return that.loopAdd2(i, j, sentences, callback);
        }
    } else {
        return callback(that);
    }
};

/* add str2 to end of str1*/
Markov.prototype.add = function (str1, str2, callback) {
    var n1 = this.find(str1.trim());
    var n2 = this.find(str2.trim());
    var markov = this;

    if (n1 == false) {
        getPos(str1, function(pos) {
            n1 = new Node(str1.trim(), pos);
            markov.elements.push(n1);
            if (n2 == false) {
                getPos(str2, function(pos) {
                    n2 = new Node(str2.trim(), pos);
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
                n2 = new Node(str2.trim(), pos);
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

Markov.prototype.add2 = function (str1, str2, str3, callback) {
    var n1 = this.find(str1.trim());
    var n2 = this.find(str2.trim());
    var n3 = this.find(str3.trim());
    var markov = this;

    //console.log(n1, n2, n3);

    if (n1 == false) {
        n1 = new Node(str1, []);
        markov.elements.push(n1);
    }
    if (n2 == false) {
        n2 = new Node(str2, []);
        markov.elements.push(n2);
    }
    if (n3 == false) {
        n3 = new Node(str3, []);
        markov.elements.push(n3);
    }
    n1.addChild2(n2, n3);
    n1.addChild(n2);
    n2.addChild(n3);
    return callback();
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
};

Markov.prototype.traverse2 = function (start, maxDepth, callback) {
    if (maxDepth == null) {maxDepth = 20;}
    var chain = [];
    start = this.find(start);
    if (start != false) {
        chain.push(start.val);
        var second = start.next();
        if (second != false) {
            var currentDepth = 1;
            var prevNode = start;
            var currentNode = second;
            while (currentDepth < maxDepth) {
                chain.push(currentNode.val);
                var nextNode = currentNode.next2(prevNode);
                if (nextNode == false) {
                    break;
                }
                currentDepth++;
                prevNode = currentNode;
                currentNode = nextNode;
            }
        }
    }
    callback(chain.join(" "));
};

Markov.prototype.generateSentence = function(prevWord, pos, callback) {
    var node = this.find(prevWord);
    console.log("Called as: ",node.val, node.pos);
    var nextWord;

    var string = '';
    if(pos == null) {
        var idx = parseInt(Math.random()*(node.pos.length));
        pos = node.pos[idx];
        if (pos == 'N') {
            console.log("Calling with: the",prevWord,'VP');
            string = 'The ' + prevWord + this.generateSentence(prevWord, 'VP', callback); //random det
        }
        else if (pos == 'Det') {
            console.log("Calling with: ",prevWord,'NP');
            string = prevWord + this.generateSentence(prevWord, 'NP',
                callback);
        }
        else if (pos == 'V') {
            if (Math.random()>0.5)
                string = prevWord + this.generateSentence(prevWord,'PP', callback);//preposition
            else
                string = prevWord + this.generateSentence(prevWord,'NP', callback);
        }
        else if (pos == 'P') {
            nextWord = prevWord;
            string = 'Verb ' + prevWord + this.generateSentence(prevWord,
                'NP', callback);
        }
        else if (pos == 'A') {
            string = prevWord + this.generateSentence(prevWord,
                'NP',callback);
        }
        return callback(string);
    }

    string = '';
    var nextPhrase = " ";
    if (pos == 'NP') {
        nextPhrase +=this.find(prevWord).next('Det').val;
        nextWord = nextPhrase.trim();
        console.log("NP",nextWord, pos);
        string = nextPhrase + this.generateSentence(nextWord,'N', callback);
    }
    else if (pos == 'VP') {
        if (Math.random()>0.5)
            nextPhrase += this.find(prevWord).next('AV').val+" ";
        nextWord = this.find(prevWord).next('V').val;
        nextPhrase += nextWord;
        console.log(nextPhrase, pos);
        string = nextPhrase + this.generateSentence(nextWord,'NP', callback);
    }
    else if (pos == 'PP') {
        nextPhrase = " "+this.find(prevWord).next('P').val;
        nextWord = nextPhrase.trim();
        console.log(nextWord, pos);
        string = nextPhrase + this.generateSentence(nextWord, 'NP', callback);
    }
    else {
        if (pos == 'N' && Math.random()>0.5) {
            nextPhrase += this.find(prevWord).next('A').val+" ";
        }
        nextWord = this.find(prevWord).next(pos).val;
        nextPhrase += nextWord;
        string = nextPhrase;
        console.log(string, pos);
        if (Math.random()>0.5)
            string += this.generateSentence(nextWord,'PP', callback);
    }
    return string;
};

function Node(string, pos) {
    this.pos = pos;
    this.val = string;
    this.children = [];
    this.doublechildren = [];
}

Node.prototype.findChild = function (n) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i][0] == n) {
            return i;
        }
    }
    return false;
};

Node.prototype.findChild2 = function (name) {
    for (var i = 0; i < this.children.length; i++) {
        if (typeof(this.doublechildren[i])==="undefined") {
            return false;
        }
        if (this.doublechildren[i][0] == name) {
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

Node.prototype.addChild2 = function (n1, n2) {
    var id = n1.val + "thisisasalt" + n2.val;
    var idx = this.findChild2(id);
    if (idx !== false) {
        this.doublechildren[idx][3]++;
    } else {
        this.doublechildren.push([id, n1, n2, 1]);
    }
};

//returns most common child
Node.prototype.next = function (pos) {
    if (this.children.length != 0) {
        var maxNum = 0;
        var maxChildren = [];
        for (var i = 0; i < this.children.length; i++) {
            if (typeof(pos)!=="undefined") {
                if (!this.children[i][0].pos.contains(pos))continue;
            }
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
    else {
        /*switch(pos) {
            case 'N':
                wordpos.randNoun(function(str) {
                    while(!this.find(str)) {

                    }
                });
                break;
            case 'V':
                break;
            case 'A':
                break;
            case 'AV':
                break;
            case 'P':
                break;
            case 'Det':
                break;
        }*/
        return false;
    }
};

Node.prototype.next2 = function (prevN, pos) {
    if (prevN.doublechildren.length != 0) {
        var maxNum = 0;
        var maxPaths = [];
        for (var i = 0; i< prevN.doublechildren.length; i++) {
            if (prevN.doublechildren[i][1] == this) {
                if(prevN.doublechildren[i][3] == maxNum) {
                    maxPaths.push(prevN.doublechildren[i]);
                }
                if(prevN.doublechildren[i][3] > maxNum) {
                    maxPaths = [];
                    maxPaths.push(prevN.doublechildren[i]);
                    maxNum = prevN.doublechildren[i][3];
                }
            }
        }
        if (maxNum != 0) {
            var idx = parseInt(Math.random()*(maxPaths.length));
            return maxPaths[idx][2];
        } else return false;
    } else return false;
    /*
    if (this.children.length != 0) {
        var maxNum = 0;
        var maxChildren = [];
        for (var i = 0; i < this.children.length; i++) {
            if (typeof(pos)!=="undefined") {
                if (!this.children[i][0].pos.contains(pos))continue;
            }
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
    */
};

module.exports = Markov;