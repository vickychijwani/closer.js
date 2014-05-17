closer = window?.closer ? self?.closer ? global?.closer ? require './closer'
closerCore = window?.closerCore ? self?.closerCore ? global?.closerCore ? require './closer-core'
escodegen = require 'escodegen'
estraverse = require 'estraverse'

wireCallsToCore = (ast) ->
  # gather all user-defined identifiers to allow them to shadow core functions
  userIdentifiers = []
  estraverse.traverse ast,
    leave: (node) ->
      if node.type is 'VariableDeclarator' and node.id.type is 'Identifier' and node.id.name not in userIdentifiers
        userIdentifiers.push node.id.name

  estraverse.replace ast,
    leave: (node) ->
      if node.type is 'Identifier' and node.name of closerCore and node.name not in userIdentifiers
        # FIXME embedding a variable name here to be eval'ed later is practically
        # FIXME a crime, but I couldn't think of a better solution
        obj = closer.node 'Identifier', 'closerCore', node.loc
        prop = closer.node 'Identifier', node.name, node.loc
        node = closer.node 'MemberExpression', obj, prop, false, node.loc
      else if (node.type is 'MemberExpression' and node.object.type is 'Identifier' and node.object.name is 'closerCore' and
      node.property.type is 'MemberExpression' and node.property.object.type is 'Identifier' and node.property.object.name is 'closerCore')
        # some nodes are the same object instance in memory, so they will be processed multiple times
        # so map.call(...) will become closerCore.closerCore.closerCore.map.call(...)
        # this is to reverse that effect
        return node.property
      node
  ast

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
    wireThisAccess wireCallsToCore closer.parse src, options

  generateJS: (src, options) ->
    escodegen.generate repl.parse src, options

module.exports = repl

self.repl = repl if self?
window.repl = repl if window?
