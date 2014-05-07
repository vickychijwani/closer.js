closer = require './closer'
core = require './closer-core'
escodegen = require 'escodegen'
estraverse = require 'estraverse'

wireCallsToCore = (ast) ->
  estraverse.replace ast,
    leave: (node) ->
      if node.type is 'Identifier' and node.name of core
        # FIXME embedding a variable name here to be eval'ed later is practically
        # FIXME a crime, but I couldn't think of a better solution
        obj = closer.node 'Identifier', 'core', node.loc
        prop = closer.node 'Identifier', node.name, node.loc
        node = closer.node 'MemberExpression', obj, prop, false, node.loc
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

exports.parse = (src, options) ->
  wireThisAccess wireCallsToCore closer.parse src, options

exports.generateJS = (src, options) ->
  escodegen.generate exports.parse src, options
