'use strict'
var Clf = require('common-log-format')
var f = require('function-tools')
var view = require('./view')
var stats = require('./stats')
var JSONStream = require('JSONStream')
var streamVia = require('stream-via')

module.exports = streamLogStats

function streamLogStats (options) {
  var throttledRender = f.throttle(view.render, { restPeriod: options.refreshRate || 500 })
  var clf = new Clf(options)
  clf.pipe(JSONStream.parse())
    .pipe(streamVia(function (logObject) {
      stats.addBytes(logObject.bytes)
      stats.requests++
      stats.addClient(logObject.remoteHost)
      stats.addResource(logObject.request.split(' ')[1], logObject.bytes)
      throttledRender(stats)
    }, { objectMode: true }))
  return clf
}
