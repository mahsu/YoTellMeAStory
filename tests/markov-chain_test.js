Markov = require("../markov-chain.js");

m = new Markov("I like to poop.");
mm = new Markov("I like to poop and eat chicken. Meow I am a cat. I am a dog. I am a chicken. I like yo. Yo, I like hacking. Poop, poop poop I am xDDD.");
cycle = new Markov("I poop I");
this.suite1 = {
    'test traversal': function (test) {
        test.equal(m.traverse("I", 3), "I like to");
        test.equal(mm.traverse("I",3), "I am a");
        test.equal(cycle.traverse("poop",9), "poop I poop I poop I poop I poop");
        test.equal(cycle.traverse("poop"), "poop I poop I poop I poop I poop I poop I poop I poop I poop I poop I");
        setTimeout(function () {
            test.done();
        }, 10);
    }
};