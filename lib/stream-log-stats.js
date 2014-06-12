"use strict";
var Transform = require("stream").Transform,
    util = require("util"),
    dope = require("console-dope"),
    o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size"),
    view = require("./view"),
    stats = require("./stats");

module.exports = StatsView;

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
            stats.addClient(logObject.remoteHost);
            stats.addResource(logObject.request.split(" ")[1], logObject.bytes);
        });
        buf = input.replace(matches.join(""), "");
        // console.dir(stats);
        view.render(stats);
    } else {
        buf = input;
    }
    done();
};
