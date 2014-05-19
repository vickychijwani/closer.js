closer = require './closer'
core = require './closer-core'

module.exports =
  parse: (src, options = {}) ->
    coreIdentifier = options.coreIdentifier || null
    delete options.coreIdentifier
    core.$wireCallsToCoreFunctions closer.parse(src, options), coreIdentifier
  core: core
