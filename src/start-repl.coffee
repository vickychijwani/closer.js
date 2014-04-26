nodeRepl = require 'repl'
vm = require 'vm'
closer = require './closer'

core = require './closer-core'
mori = require 'mori'
repl = require './repl'

global.mori = mori
global.core = core

defaults =
  prompt: 'closer> '
  stream: process.stdin
  eval: (input, context, filename, callback) ->
    # Node's REPL sends the input ending with a newline and then wrapped in
    # parens. Unwrap all that.
    input = input.replace /^\(([\s\S]*)\n\)$/m, '$1'

    try
      console.log '\nAST: ' + JSON.stringify repl.parse(input), null, 4
      js = repl.generateJS input
      console.log '\nGenerated JS:\n' + js + '\n'
      result = vm.runInThisContext js
    catch e
    callback e, result
  useGlobal: true

nodeRepl.start(defaults)
