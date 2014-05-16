closer = window?.closer ? self?.closer ? global?.closer ? require './closer'
closerCore = window?.closerCore ? self?.closerCore ? global?.closerCore ? require './closer-core'
escodegen = require 'escodegen'
estraverse = require 'estraverse'

wireCallsToCore = (ast) ->
  estraverse.replace ast,
    leave: (node) ->
      if node.type is 'Identifier' and node.name of closerCore
        # FIXME embedding a variable name here to be eval'ed later is practically
        # FIXME a crime, but I couldn't think of a better solution
        obj = closer.node 'Identifier', 'closerCore', node.loc
        prop = closer.node 'Identifier', node.name, node.loc
        node = closer.node 'MemberExpression', obj, prop, false, node.loc
      else if (node.type is 'MemberExpression' and
      node.object.type is 'Identifier' and node.object.name is 'closerCore' and
      node.property.type is 'MemberExpression' and
      node.property.object.type is 'Identifier' and node.property.object.name is 'closerCore')
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

exports.parse = (src, options) ->
  wireThisAccess wireCallsToCore closer.parse src, options

exports.generateJS = (src, options) ->
  escodegen.generate exports.parse src, options
