"use strict";
var Transform = require("stream").Transform,
    util = require("util");

module.exports = StatsView;

var stats = {
    transferred: 0,
    requests: 0
};

function StatsView(options){
    if (!(this instanceof StatsView)) return new StatsView(options);
    Transform.call(this, options);
}
util.inherits(StatsView, Transform);

var buf = "";
StatsView.prototype._transform = function(chunk, enc, done){
    var self = this;
    var input = chunk.toString();
    input = buf + input;
    var matches = input.match(/\{.*?\}/g);
    if (matches){
        matches.forEach(function(json){
            var logObject = JSON.parse(json);
            stats.transferred += logObject.bytes;
            stats.requests++;
            console.log("t: %s, r: %s", stats.transferred, stats.requests);
        });
        buf = input.replace(matches.join(""), "");
    } else {
        buf = input;
    }
    // console.dir(input)
    done();
};
