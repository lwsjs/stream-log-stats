"use strict";
var Transform = require("stream").Transform,
    util = require("util"),
    dope = require("console-dope"),
    o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size");

var view = module.exports = {
    clients: { 
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
    }
};
view.render = function(){
    // dope.clearScreen();
    dope.log();
    dope.cursorSave();
    o.each(view, function(field){
        var head = field.head;
        if (head){
            // view.row(head.row);
            dope.cursorLinesDown(head.row);
            dope.column(head.column)
                .underline
                .write(head.text);        
        }
        dope.cursorRestore();

        var value = field.value;
        if (value){
            // view.row(value.row);
            dope.cursorLinesDown(value.row);
            dope.column(value.column)
                .write("0");        
        }
        dope.cursorRestore();
    });
    
};
view.row = function(row){
    for (var i = 0; i < row; i++ ) {
        dope.cursorLinesDown();
    }    
};
