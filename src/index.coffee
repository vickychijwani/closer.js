closer = require './closer'
core = require './closer-core'
assertions = require './assertions'

module.exports =
  parse: (src, options = {}) ->
    coreIdentifier = options.coreIdentifier || null
    assertionsIdentifier = options.assertionsIdentifier || null
    delete options.coreIdentifier
    delete options.assertionsIdentifier
    core.$wireCallsToCoreFunctions closer.parse(src, options), coreIdentifier, assertionsIdentifier
  core: core
  assertions: assertions
