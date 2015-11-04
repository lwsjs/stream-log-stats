'use strict'
var fs = require('fs')
var path = require('path')
var ansi = require('ansi-escape-sequences')
var columnLayout = require('column-layout')

exports.render = render

function render (stats) {
  // console.log(stats);
  var clientsTable = columnLayout.table([
    {
      one: ansi.format('Clients', ['underline']),
      two: ansi.format('Requests', ['underline']),
      three: ansi.format('Transferred', ['underline'])
    },
    {
      one: stats.clientCount,
      two: stats.requests,
      three: stats.transferred
    }
  ])

  var extensionTable = columnLayout.table([
    {
      type: ansi.format('Extension', ['underline']),
      requests: ansi.format('Requests', ['underline']),
      bytes: ansi.format('Transferred', ['underline'])
    }
  ].concat(stats.topTypes))

  var resourceTable = columnLayout.table(
    [
      {
        resource: ansi.format('Resource', ['underline']),
        requests: ansi.format('Requests', ['underline']),
        bytes: ansi.format('Transferred', ['underline'])
      }
    ].concat(stats.topResources),
    {
      columns: [ { name: 'resource', break: true }]
    }
  )

  return clientsTable.render() + extensionTable.render() + resourceTable.render()
}

// var visible = false
// var template = fs.readFileSync(path.resolve(__dirname, '..', 'template', 'view.hbs'), 'utf8')
// var compiled = boil.compile(template)
// var previouslyRenderedLines = 0

function render1 (stats) {
  stats = addLayoutData(stats)
  var rendered = compiled(stats)

  if (visible) {
    dope.cursorLinesUp(previouslyRenderedLines + (process.platform === 'win32' ? 1 : 0))
  } else {
    visible = true
  }
  dope.clearToScreenEnd()
  var lines = rendered.split('\n')

  previouslyRenderedLines = 0
  for (var i = 0; i < lines.length && i < (process.stdout.rows - 1); i++) {
    console.log(lines[i])
    previouslyRenderedLines++
  }
}

function addLayoutData (stats) {
  var cols = process.stdout.columns
  stats.table3 = { col1: {}, col2: {}, col3: {} }

  stats.table3.col2.header = ansi.sgr.format('Requests', 'underline')
  stats.table3.col2.headerWidth = stats.table3.col2.header.length + 1
  stats.table3.col2.width = 'Requests'.length + 1

  stats.table3.col3.header = ansi.sgr.format('Transferred', 'underline')
  stats.table3.col3.headerWidth = stats.table3.col3.header.length + 1
  stats.table3.col3.width = 'Transferred'.length + 1

  stats.table3.col1.header = ansi.sgr.format('Resource', 'underline')
  stats.table3.col1.width = cols - stats.table3.col2.width - stats.table3.col3.width
  stats.table3.col1.headerWidth = stats.table3.col1.width + ansi.sgr.format('', 'underline').length
  stats.table3.col1.clipLeft = stats.table3.col1.width - 2
  return stats
}
