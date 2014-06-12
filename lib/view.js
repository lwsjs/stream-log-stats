"use strict";
var dope = require("console-dope"),
    byteSize = require("byte-size"),
    boil = require("boil-js"),
    fs = require("fs"),
    path = require("path");

var visible = false;
var template = fs.readFileSync(path.resolve(__dirname, "..", "template", "view.hbs"), "utf8");

exports.render = render;

function render(stats){
    if (visible) {
        dope.cursorLinesUp(12);
    } else {
        visible = true;
    }
    dope.clearToScreenEnd();
    dope.log(boil.render(template, stats));
}
