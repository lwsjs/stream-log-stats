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
    stats = addLayoutData(stats);
    var rendered = compiled(stats);
    
    if (visible) {
        dope.cursorLinesUp(previouslyRenderedLines);
    } else {
        visible = true;
    }
    dope.clearToScreenEnd();
    var lines = rendered.split("\n");

    previouslyRenderedLines = 0;
    for (var i = 0; i < lines.length && i < (process.stdout.rows - 1); i++){
        console.log(lines[i]);
        previouslyRenderedLines++;
    }
}

function addLayoutData(stats){
    var cols = process.stdout.columns;
    stats.resources = {};
    stats.resources.col2 = {
        header: "Requests",
        width: 10
    };
    stats.resources.col3 = {
        header: "Transferred",
        width: 12
    };
    stats.resources.col1 = {
        header: "Resource",
        width: cols - stats.resources.col2.width - stats.resources.col3.width,
        clipLeft: cols - stats.resources.col2.width - stats.resources.col3.width - 2
    };
    return stats;
}
