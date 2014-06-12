"use strict";
var Transform = require("stream").Transform,
    util = require("util"),
    dope = require("console-dope"),
    o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size");

var cursorSaved = false;

var view = module.exports = {
    clientCount: {
        head: { row: 1, column: 1, text: "Clients" },
        value: { row: 2, column: 1 }
    },
    transferred: {
        head: { row: 1, column: 18, text: "Transferred" },
        value: { row: 2, column: 18, formatter: function(val){
            return s.padRight(byteSize(val, 2), 12);
        }}
    },
    requests: {
        head: { row: 1, column: 9, text: "Requests" },
        value: { row: 2, column: 9 }
    },
    topResources: {
        head: { row: 4, column: 1, text: "Resource" },
        value: { row: 5, column: 1, formatter: function(array){
            return array.reduce(function(prev, curr){
                return prev + util.format("%s   %s   %s%s\n", curr.resource, curr.requests, curr.bytes, s.repeat(" ", 20));
            }, "");
        }}
    },
    topResourcesRequests: {
        head: { row: 4, column: 30, text: "Requests" }
    },
    topResourcesTransferred: {
        head: { row: 4, column: 39, text: "Transferred" }
    }
};

view.render = function(stats){
    if (!cursorSaved) {
        dope.cursorSave();
        cursorSaved = true;
    }
    
    o.each(view, function(field, key){
        var head = field.head;
        if (head){
            dope.cursorRestore();
            dope.cursorLinesDown(head.row);
            dope.column(head.column)
                .underline
                .write(head.text);
        }

        if (field.value){
            var val = "-";
            if (stats[key]){
                val = field.value.formatter ? field.value.formatter(stats[key]) : stats[key];
            }
            dope.cursorRestore();
            dope.cursorLinesDown(field.value.row);
            dope.column(field.value.column)
                .write(val);
        }
    });
    dope.log();

};
