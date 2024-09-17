const statsViewStream = require('./')

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('first', function () {
  const view = statsViewStream()
  /* this is not a valid log file line, looks more like output from Clf */
  view.write('{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:02.000Z","request":"GET / HTTP/1.1","status":200,"bytes":10305}{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:08.000Z","request":"GET /package.json HTTP/1.1","status":304,"bytes":null}')
})

module.exports = { test, only, skip }
