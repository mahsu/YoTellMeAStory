var sets = require('simplesets');

function Markov(text) {
    text = text.split(".");
    this.seed = [];
    for (i = 0; i < text.length; i++) {
        var wordList = text[i].split(" ");
        this.seed[i] = wordList.slice(0);
    }
    this.elements = [];  //words in graph
    if (this.seed.length == 0) {
        return false;
    }
    for (var i = 0; i < this.seed.length; i++) {
        if (this.seed[i].length > 1) {
            for (var j = 0; j < this.seed[i].length - 1; j++) {
                this.add(this.seed[i][j], this.seed[i][j + 1]);
            }
        }
    }
}

/* add str2 to end of str1*/
Markov.prototype.add = function (str1, str2) {
    var n1 = this.find(str1);
    var n2 = this.find(str2);

    if (n1 == false) {
        n1 = new Node(str1);
        this.elements.push(n1);
    }
    if (n2 == false) {
        n2 = new Node(str2);
        this.elements.push(n2);
    }

    n1.addChild(n2);

};

Markov.prototype.find = function (str) {
    for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].val == str) {
            return this.elements[i];
        }
    }
    return false;
};

Markov.prototype.traverse = function (start, maxDepth) {
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
    return chain.join(" ");
}

function Node(string) {
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
        var maxChild = null;
        for (var i = 0; i < this.children.length; i++) {
            if (maxChild == null) {
                maxChild = this.children[i];
            }
            else if (this.children[i][1] > maxChild[1]) {
                maxChild = this.children[i];
            }
        }
        return maxChild[0];
    }
    else return false;
};

module.exports = Markov;