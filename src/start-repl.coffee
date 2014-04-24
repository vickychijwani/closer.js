nodeRepl = require 'repl'
vm = require 'vm'

core = require './closer-core'
mori = require 'mori'
repl = require './repl'

sandbox = vm.createContext
  core: core
  mori: mori

defaults =
  prompt: 'closer> '
  stream: process.stdin
  eval: (input, context, filename, callback) ->
    # Node's REPL sends the input ending with a newline and then wrapped in
    # parens. Unwrap all that.
    input = input.replace /^\(([\s\S]*)\n\)$/m, '$1'

    try
      js = repl.generateJS input
      console.log '\nAST: ' + JSON.stringify repl.parse(input), null, 4
      console.log '\nGenerated JS:\n' + js + '\n'
      result = vm.runInNewContext js, sandbox
    catch e
    callback e, result
  useGlobal: true

nodeRepl.start(defaults)
