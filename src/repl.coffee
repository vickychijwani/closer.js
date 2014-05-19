closer = window?.closer ? self?.closer ? global?.closer ? require './closer'
closerCore = window?.closerCore ? self?.closerCore ? global?.closerCore ? require './closer-core'
escodegen = require 'escodegen'
estraverse = require 'estraverse'

wireThisAccess = (ast) ->
  estraverse.replace ast,
    leave: (node) ->
      if node.type is 'ThisExpression'
        node.type = 'Identifier'
        node.name = '__$this'
      node
  ast

repl =
  parse: (src, options) ->
    wireThisAccess closerCore.$wireCallsToCoreFunctions closer.parse(src, options), 'closerCore', 'assertions'

  generateJS: (src, options) ->
    escodegen.generate repl.parse src, options

module.exports = repl

self.repl = repl if self?
window.repl = repl if window?
