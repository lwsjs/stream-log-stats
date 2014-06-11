"use strict";
var Transform = require("stream").Transform,
    util = require("util"),
    dope = require("console-dope"),
    o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size");

module.exports = StatsView;

var view = {
    clients: { 
        head: { row: 1, column: 13, text: "Clients" },
        value: { row: 2, column: 13 }
    },
    transferred: {
        head: { row: 1, column: 30, text: "Transferred" },
        value: { row: 2, column: 30, formatter: function(val){
            return s.padRight(byteSize(val, 2), 12);
        }}
    },
    requests: {
        head: { row: 1, column: 21, text: "Requests" },
        value: { row: 2, column: 21 }
    }
};
view.render = function(){
    dope.clearScreen();
    o.each(view, function(field){
        var head = field.head;
        if (head){
            dope.cursorPosition(head.row, head.column)
                .underline
                .write(head.text);        
        }
    });
    
};


var stats = {
    clients: {},
    transferred: 0,
    requests: 0,
    resource: {}
}; 
stats.addClient = function(ip){
    if (this.clients[ip]){
        this.clients[ip]++;
    } else {
        this.clients[ip] = 1;
    }
};
stats.addResource = function(url, bytes){
    if (stats.resource[url]){
        stats.resource[url].requests++;
        stats.resource[url].bytes += bytes;
    } else {
        stats.resource[url] = {
            requests: 1,
            bytes: bytes
        };
    }
};

function StatsView(options){
    if (!(this instanceof StatsView)) return new StatsView(options);
    Transform.call(this, options);
    view.render();
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
            console.dir(stats);
        });
        buf = input.replace(matches.join(""), "");
    } else {
        buf = input;
    }
    done();
};
