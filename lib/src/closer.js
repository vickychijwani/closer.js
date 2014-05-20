(function() {
  var Closer, Parser, balanceDelimiters, builder, closer, con, nodes, oldParse, parser;

  parser = require('./parser').parser;

  nodes = require('./nodes');

  builder = {};

  nodes.defineNodes(builder);

  for (con in builder) {
    parser.yy[con] = function(a, b, c, d, e, f, g, h) {
      return builder[con](a, b, c, d, e, f, g, h);
    };
  }

  parser.yy.Node = function(type, a, b, c, d, e, f, g, h) {
    var buildName;
    buildName = type[0].toLowerCase() + type.slice(1);
    if (builder && buildName in builder) {
      return builder[buildName](a, b, c, d, e, f, g, h);
    } else {
      throw new ReferenceError("no such node type: " + type);
    }
  };

  parser.yy.locComb = function(start, end) {
    start.last_line = end.last_line;
    start.last_column = end.last_column;
    start.range = [start.range[0], end.range[1]];
    return start;
  };

  parser.yy.loc = function(loc) {
    if (!this.locations) {
      return null;
    }
    return {
      start: {
        line: this.startLine + loc.first_line - 1,
        column: loc.first_column
      },
      end: {
        line: this.startLine + loc.last_line - 1,
        column: loc.last_column
      },
      range: loc.range
    };
  };

  parser.lexer.options.ranges = true;

  oldParse = parser.parse;

  parser.parse = function(source, options) {
    this.yy.raw = [];
    this.yy.options = options;
    return oldParse.call(this, source);
  };

  Parser = (function() {
    function Parser(options) {
      this.yy.locs = options.loc !== false;
      this.yy.ranges = options.range === true;
      this.yy.locations = this.yy.locs || this.yy.ranges;
      this.yy.source = options.source || null;
      this.yy.startLine = options.line || 1;
      nodes.forceNoLoc = options.forceNoLoc;
    }

    return Parser;

  })();

  Parser.prototype = parser;

  balanceDelimiters = function(source) {
    var c, close, delims, existingClose, last, match, open, _i, _j, _len, _len1;
    match = {
      '(': ')',
      '[': ']',
      '{': '}'
    };
    open = /[(\[{]/g;
    close = /[)\]}]/g;
    existingClose = source.match(/[ \r\n)\]}]+$/);
    if (existingClose) {
      existingClose = existingClose[0];
      source = source.replace(existingClose, '');
      existingClose = existingClose.replace(/[ \r\n]+/g, '');
    } else {
      existingClose = '';
    }
    delims = [];
    for (_i = 0, _len = source.length; _i < _len; _i++) {
      c = source[_i];
      if (c.match(open)) {
        delims.push(c);
      } else if (c.match(close)) {
        last = delims[delims.length - 1];
        if (last) {
          if (c === match[last]) {
            delims.pop();
          } else {
            throw new Error("unmatched existing delimiters, can't balance");
          }
        } else {
          throw new Error("too many closing delimiters, can't balance");
        }
      }
    }
    delims.reverse();
    for (_j = 0, _len1 = delims.length; _j < _len1; _j++) {
      c = delims[_j];
      source += match[c];
    }
    return [source, delims.length - existingClose.length];
  };

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options);
    }

    Closer.prototype.parse = function(source, options) {
      var ast, e, unbalancedCount, _ref;
      if (options.loose === true) {
        try {
          _ref = balanceDelimiters(source), source = _ref[0], unbalancedCount = _ref[1];
          ast = this.parser.parse(source, options);
        } catch (_error) {
          e = _error;
          source = '';
          unbalancedCount = 0;
          ast = this.parser.parse(source, options);
        }
        if (!e && unbalancedCount > 0) {
          e = new Error("Missing " + unbalancedCount + " closing delimiters");
          e.startOffset = e.endOffset = source.length - 1;
          ast.errors = [e];
        }
      } else {
        ast = this.parser.parse(source, options);
      }
      return ast;
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
      if (options == null) {
        options = {};
      }
      return new Closer(options).parse(src, options);
    },
    node: parser.yy.Node
  };

  module.exports = closer;

  if (typeof self !== "undefined" && self !== null) {
    self.closer = closer;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closer = closer;
  }

}).call(this);
