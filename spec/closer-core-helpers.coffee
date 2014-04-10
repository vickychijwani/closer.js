closer = require '../closer'
core = require '../closer-core'
escodegen = require 'escodegen'
estraverse = require 'estraverse'

wireCallsToCore = (ast) ->
  estraverse.replace ast,
    enter: (node) ->
      if node.type is 'CallExpression' and node.callee.type is 'Identifier' and node.callee.name of core
        # FIXME embedding a variable name here to be eval'ed later is practically
        # FIXME a crime, but I couldn't think of a better solution
        calleeObj = closer.node 'Identifier', 'core', node.loc
        calleeProp =
          type: 'Literal'
          value: node.callee.name
        node.callee = closer.node 'MemberExpression',
          calleeObj, calleeProp, true, node.loc
      node
  ast

parse = (src, options) ->
  wireCallsToCore closer.parse src, options

exports.evaluate = (src, options) ->
  eval escodegen.generate parse src, options