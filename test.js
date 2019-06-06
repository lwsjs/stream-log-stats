const statsView = require('./')
const Tom = require('test-runner').Tom

const tom = module.exports = new Tom('stats')

tom.test('first', function (t) {
  const view = statsView()
  view.write('{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:02.000Z","request":"GET / HTTP/1.1","status":200,"bytes":10305}{"remoteHost":"127.0.0.1","remoteLogName":"-","authUser":"-","date":"2014-06-11T16:24:08.000Z","request":"GET /package.json HTTP/1.1","status":304,"bytes":null}')
})
