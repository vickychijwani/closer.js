parser = require('./parser').parser
nodes = require './nodes'

# Define AST nodes
defaultBuilder = {}
nodes.defineNodes defaultBuilder

# allow yy.NodeType calls in parser
for con of defaultBuilder
  if defaultBuilder.hasOwnProperty(con)
    parser.yy[con] = ((name) ->
      context = this
      (a, b, c, d, e, f, g, h) ->
        context.builder[name] a, b, c, d, e, f, g, h
    )(con)

# used named arguments to avoid arguments array
parser.yy.Node = (type, a, b, c, d, e, f, g, h) ->
  buildName = type[0].toLowerCase() + type.slice(1)
  if @builder and @builder[buildName]
    @builder[buildName] a, b, c, d, e, f, g, h
  else
    throw new ReferenceError "no such node type: " + type

parser.yy.locComb = (start, end) ->
  start.last_line = end.last_line
  start.last_column = end.last_column
  # start.range = [start.range[0], end.range[1]];
  start

parser.yy.loc = (loc) ->
  return null unless @locations
  loc = @locComb(loc[0], loc[1]) if "length" of loc
  newLoc =
    start:
      line: @startLine + loc.first_line - 1
      column: loc.first_column
    end:
      line: @startLine + loc.last_line - 1
      column: loc.last_column
    # range: loc.range

  newLoc.source = @source  if @source or @builder isnt defaultBuilder
  newLoc

parser.yy.escapeString = (s) ->
  s.replace(/\\\n/, '').replace /\\([^xubfnvrt0\\])/g, '$1'

oldParse = parser.parse
parser.parse = (source, options) ->
  @yy.inRegex = false
  @yy.raw = []
  @yy.comments = []
  @yy.options = options or {}
  oldParse.call this, source

class Parser
  constructor: (options) ->
    @yy.source = options.source or null
    @yy.startLine = options.line or 1
    @yy.locations = options.locations
    @yy.builder = options.builder or defaultBuilder

Parser:: = parser

class Closer
  constructor: (options) ->
    # Create a parser constructor and an instance
    @parser = new Parser(options or {})

  parse: (source, options) ->
    @parser.parse source, options

closer =
  parse: (src, options) ->
    new Closer(options).parse src, options

module.exports = closer