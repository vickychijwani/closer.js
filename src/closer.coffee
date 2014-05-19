parser = require('./parser').parser
nodes = require './nodes'

# Define AST nodes
builder = {}
nodes.defineNodes builder

# allow yy.NodeType calls in parser
for con of builder
  parser.yy[con] = (a, b, c, d, e, f, g, h) ->
    builder[con] a, b, c, d, e, f, g, h

# used named arguments to avoid arguments array
parser.yy.Node = (type, a, b, c, d, e, f, g, h) ->
  buildName = type[0].toLowerCase() + type.slice(1)
  if builder and buildName of builder
    builder[buildName] a, b, c, d, e, f, g, h
  else
    throw new ReferenceError "no such node type: #{type}"

parser.yy.locComb = (start, end) ->
  start.last_line = end.last_line
  start.last_column = end.last_column
  start.range = [start.range[0], end.range[1]]
  start

parser.yy.loc = (loc) ->
  return null unless @locations
  loc = @locComb(loc[0], loc[1]) if 'length' of loc
  start:
    line: @startLine + loc.first_line - 1
    column: loc.first_column
  end:
    line: @startLine + loc.last_line - 1
    column: loc.last_column
  range: loc.range

parser.lexer.options.ranges = true

oldParse = parser.parse
parser.parse = (source, options) ->
  @yy.raw = []
  @yy.options = options
  oldParse.call this, source

class Parser
  constructor: (options) ->
    @yy.locs = options.loc isnt false
    @yy.ranges = options.range is true
    @yy.locations = @yy.locs or @yy.ranges  # needed to enable locations from lexer
    @yy.source = options.source or null
    @yy.startLine = options.line or 1

    # this is for testing purposes, to prevent json-diff from complaining about deleted properties
    nodes.forceNoLoc = options.forceNoLoc

Parser:: = parser

balanceDelimiters = (source) ->
  match = { '(': ')', '[': ']', '{': '}' }
  open = /[(\[{]/g; close = /[)\]}]/g
  existingClose = source.match(/[ \r\n)\]}]+$/)
  if existingClose
    existingClose = existingClose[0]
    source = source.replace(existingClose, '')
    existingClose = existingClose.replace(/[ \r\n]+/g, '')  # get rid of the whitespace
  else existingClose = ''
  delims = []
  for c in source
    if c.match open
      delims.push c
    else if c.match close
      last = delims[delims.length-1]
      if last
        if c is match[last] then delims.pop() else throw new Error "unmatched existing delimiters, can't balance"
      else throw new Error "too many closing delimiters, can't balance"
  delims.reverse()  # reverse the order of the remaining opening delimiters
  source += match[c] for c in delims
  [source, delims.length - existingClose.length]

class Closer
  constructor: (options) ->
    # Create a parser constructor and an instance
    @parser = new Parser(options)

  parse: (source, options) ->
    if options.loose is true
      try
        [source, unbalancedCount] = balanceDelimiters(source)
      catch e
        console.log "#{e.name}: #{e.message}"
        source = ''
      ast = @parser.parse source, options
      if not e and unbalancedCount > 0
        e = new Error "Missing #{unbalancedCount} closing delimiters"
        e.startOffset = e.endOffset = source.length-1
        ast.errors = [e]
    else
      ast = @parser.parse source, options
    ast

closer =
  parse: (src, options = {}) ->
    new Closer(options).parse src, options

  node: parser.yy.Node

module.exports = closer

self.closer = closer if self?
window.closer = closer if window?
