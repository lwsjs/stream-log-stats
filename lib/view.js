"use strict";
var dope = require("console-dope"),
    byteSize = require("byte-size"),
    boil = require("boil-js"),
    fs = require("fs"),
    path = require("path");

exports.render = render;

var visible = false;
var template = fs.readFileSync(path.resolve(__dirname, "..", "template", "view.hbs"), "utf8");
var compiled = boil.compile(template);
var previouslyRenderedLines = 0;

function render(stats){
    var rendered = compiled(stats);
    
    if (visible) {
        dope.cursorLinesUp(previouslyRenderedLines - 1);
    } else {
        visible = true;
    }
    dope.clearToScreenEnd();
    process.stdout.write(rendered);
    previouslyRenderedLines = rendered.split("\n").length;
}
