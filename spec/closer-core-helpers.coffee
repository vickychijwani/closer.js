repl = require '../repl'
core = require '../closer-core'
mori = require 'mori'

exports.evaluate = (src, options) ->
  eval repl.generateJS src, options
