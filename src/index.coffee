closer = require './closer'
core = require './closer-core'

module.exports =
  parse: (src, options) ->
    core.$wireCallsToCoreFunctions closer.parse src, options
  core: core
