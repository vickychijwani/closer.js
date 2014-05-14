(function() {
  var Closer, Parser, builder, closer, con, nodes, oldParse, parser;

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
    if ('length' in loc) {
      loc = this.locComb(loc[0], loc[1]);
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
    this.yy.options = options || {};
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

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options || {});
    }

    Closer.prototype.parse = function(source, options) {
      return this.parser.parse(source, options);
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
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
