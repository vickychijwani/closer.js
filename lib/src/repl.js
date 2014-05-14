(function() {
  var closer, closerCore, escodegen, estraverse, wireCallsToCore, wireThisAccess, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('./closer');

  closerCore = (_ref3 = (_ref4 = (_ref5 = typeof window !== "undefined" && window !== null ? window.closerCore : void 0) != null ? _ref5 : typeof self !== "undefined" && self !== null ? self.closerCore : void 0) != null ? _ref4 : typeof global !== "undefined" && global !== null ? global.closerCore : void 0) != null ? _ref3 : require('./closer-core');

  escodegen = require('escodegen');

  estraverse = require('estraverse');

  wireCallsToCore = function(ast) {
    estraverse.replace(ast, {
      leave: function(node) {
        var obj, prop;
        if (node.type === 'Identifier' && node.name in closerCore) {
          obj = closer.node('Identifier', 'closerCore', node.loc);
          prop = closer.node('Identifier', node.name, node.loc);
          node = closer.node('MemberExpression', obj, prop, false, node.loc);
        }
        return node;
      }
    });
    return ast;
  };

  wireThisAccess = function(ast) {
    estraverse.replace(ast, {
      leave: function(node) {
        if (node.type === 'ThisExpression') {
          node.type = 'Identifier';
          node.name = '__$this';
        }
        return node;
      }
    });
    return ast;
  };

  exports.parse = function(src, options) {
    return wireThisAccess(wireCallsToCore(closer.parse(src, options)));
  };

  exports.generateJS = function(src, options) {
    return escodegen.generate(exports.parse(src, options));
  };

}).call(this);
