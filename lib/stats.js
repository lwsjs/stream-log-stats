"use strict";
var o = require("object-ting"),
    s = require("string-ting"),
    byteSize = require("byte-size"),
    path = require("path");

var stats = module.exports = {
    clients: {},
    clientCount: 0,
    transferred: 0,
    requests: 0,
    resource: {},
    type: {},
    topResources: [],
    topTypes: []
}; 
stats.addClient = function(ip){
    if (this.clients[ip]){
        this.clients[ip]++;
    } else {
        this.clients[ip] = 1;
    }
    this.clientCount = Object.keys(this.clients).length;
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
    var type = path.extname(url);
    if (stats.type[type]){
        stats.type[type].requests++;
        stats.type[type].bytes += bytes;
    } else {
        stats.type[type] = {
            requests: 1,
            bytes: bytes
        };
    }
    
    stats.topResources = [];
    stats.topTypes = [];
    o.each(stats.resource, function(resource, key){
        stats.topResources.push({ resource: key, requests: resource.requests, bytes: resource.bytes });
    });
    o.each(stats.type, function(type, key){
        stats.topTypes.push({ type: key, requests: type.requests, bytes: type.bytes });
    });
    
    stats.topResources = stats.topResources.sort(function(a, b){
        return a.requests < b.requests;
    });
    stats.topTypes = stats.topTypes.sort(function(a, b){
        return a.requests < b.requests;
    });
};
