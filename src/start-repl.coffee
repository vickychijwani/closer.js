nodeRepl = require 'repl'
vm = require 'vm'
closer = require './closer'
repl = require './repl'

global.closerAssertions = require './assertions'
global.closerCore = require './closer-core'
global.__$this = {}

defaults =
  prompt: 'closer> '
  stream: process.stdin
  eval: (input, context, filename, callback) ->
    # Node's REPL sends the input ending with a newline and then wrapped in
    # parens. Unwrap all that.
    input = input.replace /^\(([\s\S]*)\n\)$/m, '$1'

    try
      opts = { loc: false }
      console.log '\nAST: ' + JSON.stringify repl.parse(input, opts), null, 4
      js = repl.generateJS input, opts
      console.log '\nGenerated JS:\n' + js + '\n'
      result = vm.runInThisContext js
    catch e
    callback (if e then (e.name + ': ' + e.message) else e), result
  useGlobal: true

nodeRepl.start(defaults)
