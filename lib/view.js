"use strict";
var Transform = require("stream").Transform,
    util = require("util"),
    dope = require("console-dope"),
    o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size"),
    boil = require("boil-js"),
    fs = require("fs"),
    path = require("path");

var cursorSaved = false;
var template = fs.readFileSync(path.resolve(__dirname, "..", "template", "view.hbs"), "utf8");
var view = module.exports = {

};

view.render = function(stats){
    if (!cursorSaved) {
        dope.cursorSave();
        cursorSaved = true;
    }
    dope.cursorRestore();
    dope.log(boil.render(template, stats))
};
