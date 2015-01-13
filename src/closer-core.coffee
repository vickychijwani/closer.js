_ = window?._ ? self?._ ? global?._ ? require 'lodash-node'
m = window?.mori ? self?.mori ? global?.mori ? require 'mori'
estraverse = require 'estraverse'
assertions = require './assertions'

core =

  # arithmetic
  '_$PLUS_': (nums...) ->
    assertions.arity 0, Infinity, arguments.length
    assertions.numbers nums
    _.reduce nums, ((sum, num) -> sum + num), 0

  '_$_': (nums...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.numbers nums
    nums.unshift(0) if nums.length is 1
    _.reduce nums.slice(1), ((diff, num) -> diff - num), nums[0]

  '_$STAR_': (nums...) ->
    assertions.arity 0, Infinity, arguments.length
    assertions.numbers nums
    _.reduce nums, ((prod, num) -> prod * num), 1

  '_$SLASH_': (nums...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.numbers nums
    nums.unshift(1) if nums.length is 1
    _.reduce nums.slice(1), ((quo, num) -> quo / num), nums[0]

  'inc': (num) ->
    assertions.arity 1, arguments.length
    assertions.numbers num
    ++num

  'dec': (num) ->
    assertions.arity 1, arguments.length
    assertions.numbers num
    --num

  'max': (nums...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.numbers nums
    _.max nums

  'min': (nums...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.numbers nums
    _.min nums

  'quot': (num, div) ->
    assertions.arity 2, arguments.length
    assertions.numbers arguments
    sign = if num > 0 and div > 0 or num < 0 and div < 0 then 1 else -1
    sign * Math.floor Math.abs num / div

  'rem': (num, div) ->
    assertions.arity 2, arguments.length
    assertions.numbers arguments
    num % div

  'mod': (num, div) ->
    assertions.arity 2, arguments.length
    assertions.numbers arguments
    rem = num % div
    if rem is 0 or (num > 0 and div > 0 or num < 0 and div < 0)
    then rem else rem + div

  'rand': () ->
    # arguments: [n]
    assertions.arity 0, 1, arguments.length
    n = 1
    if arguments.length is 1
      assertions.numbers arguments[0]
      n = arguments[0]
    Math.random() * n

  'rand_$_int': (n) ->
    assertions.arity 1, arguments.length
    r = core.rand n
    if r >= 0 then Math.floor(r) else Math.ceil(r)


  # comparison / test
  '_$EQ_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    args = _.uniq args   # remove duplicates
    return true if args.length is 1
    m.equals.apply null, _.map(args, (arg) -> m.js_to_clj(arg))

  'not_$EQ_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    core.not core['_$EQ_'].apply null, args

  '_$EQ__$EQ_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    return true if args.length is 1
    assertions.numbers args
    core['_$EQ_'].apply null, args

  '_$LT_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    return true if args.length is 1
    assertions.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val < args[idx+1])
    ), true

  '_$GT_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    return true if args.length is 1
    assertions.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val > args[idx+1])
    ), true

  '_$LT__$EQ_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    return true if args.length is 1
    assertions.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val <= args[idx+1])
    ), true

  '_$GT__$EQ_': (args...) ->
    assertions.arity 1, Infinity, arguments.length
    return true if args.length is 1
    assertions.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val >= args[idx+1])
    ), true

  'identical_$QMARK_': (x, y) ->
    assertions.arity 2, arguments.length
    x is y

  'true_$QMARK_': (arg) ->
    assertions.arity 1, arguments.length
    arg is true

  'false_$QMARK_': (arg) ->
    assertions.arity 1, arguments.length
    arg is false

  'nil_$QMARK_': (arg) ->
    assertions.arity 1, arguments.length
    arg is null

  'some_$QMARK_': (arg) ->
    assertions.arity 1, arguments.length
    arg isnt null

  'number_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    typeof x is 'number'

  'integer_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    typeof x is 'number' and x % 1 is 0

  'float_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    typeof x is 'number' and x % 1 isnt 0

  'zero_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    core['_$EQ__$EQ_'](x, 0)

  'pos_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    core['_$GT_'] x, 0

  'neg_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    core['_$LT_'] x, 0

  'even_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    assertions.integers x
    core['zero_$QMARK_'] core['mod'] x, 2

  'odd_$QMARK_': (x) ->
    core['not'] core['even_$QMARK_'] x

  'contains_$QMARK_': (coll, key) ->
    assertions.arity 2, arguments.length
    assertions.associativeOrSet coll
    m.has_key coll, key

  'empty_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_empty coll

  'keyword_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_keyword x

  'list_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_list x

  'seq_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_seq x

  'vector_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_vector x

  'map_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_map x

  'set_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_set x

  'coll_$QMARK_': (x) ->
    assertions.arity 1, arguments.length
    m.is_collection x

  'sequential_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_sequential coll

  'associative_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_associative coll

  'counted_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_counted coll

  'seqable_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_seqable coll

  'reversible_$QMARK_': (coll) ->
    assertions.arity 1, arguments.length
    m.is_reversible coll


  # logic
  'boolean': (arg) ->
    assertions.arity 1, arguments.length
    arg isnt false and arg isnt null

  'not': (arg) ->
    assertions.arity 1, arguments.length
    not core.boolean(arg)


  # string
  'str': (args...) ->
    assertions.arity 0, Infinity, arguments.length
    _.reduce args, ((str, arg) ->
      str += if core['nil_$QMARK_'](arg) then '' else arg.toString()
    ), ''

  'println': (args...) ->
    assertions.arity 0, Infinity, arguments.length
    console.log.apply null, args


  # collections
  'keyword': (name) ->
    assertions.arity 1, arguments.length
    m.keyword name

  'list': (items...) ->
    assertions.arity 0, Infinity, arguments.length
    m.list.apply null, items

  'vector': (items...) ->
    assertions.arity 0, Infinity, arguments.length
    m.vector.apply null, items

  'hash_$_map': (items...) ->
    assertions.arity_custom arguments, (args) ->
      if args.length % 2 isnt 0
        "Expected even number of args, got #{args.length}"
    m.hash_map.apply null, items

  'hash_$_set': (items...) ->
    assertions.arity 0, Infinity, arguments.length
    m.set items

  'count': (coll) ->
    assertions.arity 1, arguments.length
    assertions.seqable coll
    m.count coll

  'empty': (coll) ->
    assertions.arity 1, arguments.length
    try m.empty coll
    catch error
      null

  'not_$_empty': (coll) ->
    assertions.arity 1, arguments.length
    if core.count(coll) is 0 then null else coll

  'get': (coll, key, notFound = null) ->
    assertions.arity 2, 3, arguments.length
    m.get coll, key, notFound

  'aget': (obj, keys...) ->
    assertions.arity 2, Infinity, arguments.length
    key = keys[0]
    rest = keys.slice(1)
    return obj[key] if keys.length is 1
    args = [obj[key]].concat(rest)
    core.aget.apply null, args

  'seq': (coll) ->
    assertions.arity 1, arguments.length
    assertions.seqable coll
    m.seq coll

  'first': (coll) ->
    assertions.arity 1, arguments.length
    m.first coll

  'rest': (coll) ->
    assertions.arity 1, arguments.length
    m.rest coll

  'next': (coll) ->
    assertions.arity 1, arguments.length
    rest = core.rest coll
    if core['empty_$QMARK_'](rest) then null else rest

  'last': (coll) ->
    assertions.arity 1, arguments.length
    m.last coll

  'nth': (coll, index, notFound) ->
    assertions.arity 2, 3, arguments.length
    assertions.sequential coll
    assertions.numbers index     # float is cast to int
    return (if notFound isnt undefined then notFound else null) if coll is null
    if _.isString(coll) and index >= coll.length and notFound is undefined
      error = new Error "Index out of bounds"
      error.name = 'IndexOutOfBoundsError'
      throw error
    try
      if notFound isnt undefined then m.nth(coll, index, notFound) else m.nth(coll, index)
    catch e
      if /^No item/.test(e.message) or /^Index out of bounds/.test(e.message)
        error = new Error "Index out of bounds"
        error.name = 'IndexOutOfBoundsError'
        throw error
      else throw e

  'second': (coll) ->
    assertions.arity 1, arguments.length
    core.first core.next coll

  'ffirst': (coll) ->
    assertions.arity 1, arguments.length
    core.first core.first coll

  'nfirst': (coll) ->
    assertions.arity 1, arguments.length
    core.next core.first coll

  'fnext': (coll) ->
    assertions.arity 1, arguments.length
    core.first core.next coll

  'nnext': (coll) ->
    assertions.arity 1, arguments.length
    core.next core.next coll

  'nthnext': (coll, n) ->
    assertions.arity 2, arguments.length
    core.nth core.iterate(core.next, coll), n

  'max_$_key': (k, x, y, more...) ->
    assertions.arity 2, Infinity, arguments.length
    assertions.function k
    if arguments.length is 2 then return x
    if arguments.length is 3 then return (if k(x) > k(y) then x else y)
    core.reduce ((x, y) -> core.max_$_key(k, x, y)), core.max_$_key(k, x, y), more

  'min_$_key': (k, x, y, more...) ->
    assertions.arity 2, Infinity, arguments.length
    assertions.function k
    if arguments.length is 2 then return x
    if arguments.length is 3 then return (if k(x) < k(y) then x else y)
    core.reduce ((x, y) -> core.min_$_key(k, x, y)), core.min_$_key(k, x, y), more

  'peek': (coll) ->
    assertions.arity 1, arguments.length
    assertions.stack coll
    m.peek coll

  'pop': (coll) ->
    assertions.arity 1, arguments.length
    assertions.stack coll
    m.pop coll

  'cons': (x, seq) ->
    assertions.arity 2, arguments.length
    m.cons x, seq

  'conj': (coll, xs...) ->
    assertions.arity 2, Infinity, arguments.length
    if core['map_$QMARK_'](coll) and _.any(xs, (x) -> core['vector_$QMARK_'](x) and core.count(x) isnt 2)
      throw new TypeError 'vector args to conjoin to a map must be pairs'
    m.conj.apply null, _.flatten [coll, xs]

  'disj': (set, ks...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.type_custom ->
      unless core.set_$QMARK_(set)
        "#{set} is not a set"
    ks = [] if ks is undefined
    core.apply m.disj, set, ks

  'into': (to, from) ->
    assertions.arity 2, arguments.length
    return null if to is null and from is null
    m.reduce core.conj, to, from

  'concat': (seqs...) ->
    assertions.arity 0, Infinity, arguments.length
    assertions.seqable.apply null, seqs
    m.concat.apply null, seqs

  'flatten': (coll) ->
    assertions.arity 1, arguments.length
    m.flatten coll

  'reverse': (coll) ->
    assertions.arity 1, arguments.length
    assertions.seqable coll
    m.reverse coll

  'assoc': (map, kvs...) ->
    assertions.arity_custom arguments, (args) ->
      if args.length < 3 or args.length % 2 is 0
        "Expected odd number of args (at least 3), got #{args.length}"
    m.assoc.apply null, _.flatten [map, kvs]

  'dissoc': (map, keys...) ->
    assertions.arity 1, Infinity, arguments.length
    return map if keys.length is 0
    m.dissoc.apply null, _.flatten [map, keys]

  'keys': (map) ->
    assertions.arity 1, arguments.length
    assertions.map map
    m.keys map

  'vals': (map) ->
    assertions.arity 1, arguments.length
    assertions.map map
    m.vals map

  'key': (e) ->
    assertions.arity 1, arguments.length
    assertions.type_custom ->
      unless core.vector_$QMARK_(e) and core.count(e) is 2
        "#{e} is not a valid map entry"
    core.first e

  'val': (e) ->
    assertions.arity 1, arguments.length
    assertions.type_custom ->
      unless core.vector_$QMARK_(e) and core.count(e) is 2
        "#{e} is not a valid map entry"
    core.last e

  'find': (map, key) ->
    assertions.arity 2, arguments.length
    assertions.associative map
    m.find map, key

  'range': (args...) ->
    # args: [] or [end] or [start end] or [start end step]
    assertions.arity 0, 3, arguments.length
    assertions.numbers args
    m.range.apply null, args

  'to_$_array': (coll) ->
    assertions.arity 1, arguments.length
    assertions.seqable coll
    core.reduce ((arr, x) -> arr.push(x); arr), [], coll

  'identity': (x) ->
    assertions.arity 1, arguments.length
    x

  'apply': (f, args...) ->
    assertions.arity 2, Infinity, arguments.length
    last = args[args.length-1]
    rest = args.slice 0, args.length-1
    assertions.function f
    assertions.seqable last
    lastSeq = core.seq(last)
    rest.push(core.nth(lastSeq, i)) for i in [0...core.count(lastSeq)]
    f.apply @, rest

  'map': (f, colls...) ->
    assertions.arity 2, Infinity, arguments.length
    assertions.function f
    bind @, arguments
    m.map.apply null, arguments

  'mapcat': (f, colls...) ->
    assertions.arity 2, Infinity, arguments.length
    assertions.function f
    bind @, arguments
    m.mapcat.apply null, arguments

  'filter': (pred, coll) ->
    assertions.arity 2, arguments.length
    assertions.function pred
    bind @, arguments
    m.filter pred, coll

  'remove': (pred, coll) ->
    assertions.arity 2, arguments.length
    assertions.function pred
    bind @, arguments
    m.remove pred, coll

  'reduce': () ->
    # args: f, [initial], coll
    assertions.arity 2, 3, arguments.length
    assertions.function arguments[0]
    bind @, arguments
    m.reduce.apply null, arguments

  'reduce_$_kv': (f, init, coll) ->
    assertions.arity 3, arguments.length
    assertions.function f
    bind @, arguments
    m.reduce_kv f, init, coll

  'take': (n, coll) ->
    assertions.arity 2, arguments.length
    assertions.numbers n
    assertions.seqable coll
    m.take n, coll

  'drop': (n, coll) ->
    assertions.arity 2, arguments.length
    assertions.numbers n
    assertions.seqable coll
    m.drop n, coll

  'some': (pred, coll) ->
    assertions.arity 2, arguments.length
    assertions.function pred
    assertions.seqable coll
    m.some pred, coll

  'every_$QMARK_': (pred, coll) ->
    assertions.arity 2, arguments.length
    assertions.function pred
    assertions.seqable coll
    m.every pred, coll

  'sort': () ->
    # arguments: [cmp], coll
    assertions.arity 1, 2, arguments.length
    if arguments.length is 1
      assertions.seqable arguments[0]
    else
      assertions.function arguments[0]
      assertions.seqable arguments[1]
      bind @, arguments
    m.sort.apply null, arguments

  'sort_$_by': () ->
    # arguments: keyfn, [cmp], coll
    assertions.arity 2, 3, arguments.length
    if arguments.length is 2
      assertions.function arguments[0]
      assertions.seqable arguments[1]
    else
      assertions.function arguments[0], arguments[1]
      assertions.seqable arguments[2]
    bind @, arguments
    m.sort_by.apply null, arguments

  'partition': () ->
    # arguments: n, [step], [pad], coll
    assertions.arity 2, 4, arguments.length
    switch arguments.length
      when 2 then [n, coll] = arguments
      when 3
        [n, step, coll] = arguments
        assertions.numbers step
      when 4
        [n, step, pad, coll] = arguments
        assertions.numbers step
        assertions.seqable pad
    assertions.numbers n
    assertions.seqable coll
    m.partition.apply null, arguments

  'partition_$_by': (f, coll) ->
    assertions.arity 2, arguments.length
    assertions.function f
    assertions.seqable coll
    bind @, arguments
    m.partition_by f, coll

  'group_$_by': (f, coll) ->
    assertions.arity 2, arguments.length
    assertions.function f
    assertions.seqable coll
    bind @, arguments
    m.group_by f, coll

  'zipmap': (keys, vals) ->
    assertions.arity 2, arguments.length
    assertions.seqable keys, vals
    m.zipmap keys, vals

  'iterate': (f, x) ->
    assertions.arity 2, arguments.length
    assertions.function f
    bind @, arguments
    m.iterate f, x

  'constantly': (x) ->
    assertions.arity 1, arguments.length
    m.constantly x

  'repeat': () ->
    # arguments: [n], x
    assertions.arity 1, 2, arguments.length
    assertions.numbers arguments[0] if arguments.length is 2
    m.repeat.apply null, arguments

  'repeatedly': () ->
    # arguments: [n], f
    assertions.arity 1, 2, arguments.length
    if arguments.length is 1 then [f] = arguments else [n, f] = arguments
    assertions.numbers n if typeof n isnt 'undefined'
    assertions.function f
    bind @, arguments
    m.repeatedly.apply null, arguments

  'comp': () ->
    # arguments: fs...
    assertions.arity 0, Infinity, arguments.length
    assertions.function.apply null, arguments
    bind @, arguments
    m.comp.apply null, arguments

  'partial': (f, args...) ->
    assertions.arity 1, Infinity, arguments.length
    assertions.function f
    bind @, arguments
    m.partial.apply null, arguments


  # interop functions
  'clj_$__$GT_js': (x) ->
    assertions.arity 1, arguments.length
    m.clj_to_js x

  'js_$__$GT_clj': (x) ->
    assertions.arity 1, arguments.length
    m.js_to_clj x
    
  # newly added functions
  'distinct': (coll) ->
    assertions.arity 1, arguments.length
    assertions.sequential coll
    m.distinct coll
    
  'rand_$_nth': (coll) ->
    assertions.arity 1, arguments.length
    assertions.sequential coll
    m.nth coll, _.random m.count(coll) - 1
  
  'get_$_in': (coll,keys,not_found) ->
    assertions.arity 2, 3, arguments.length
    assertions.seqable keys
    m.get_in(coll,keys,not_found)
    
  'assoc_$_in' : (coll,keys,val) ->
    assertions.arity 3, arguments.length
    assertions.associative coll
    assertions.seqable keys
    m.assoc_in(coll,keys,val)
    
  'frequencies' : (coll) ->
    assertions.arity 1, arguments.length
    assertions.seqable coll
    core.into(core.hash_$_map(),
      core.map(
        ((kv) -> core.vector(core.key(kv), core.count(core.val(kv)))),
        core.group_$_by(core.identity, coll))
     )

bind = (that, args) ->
  for i in [0...args.length]
    args[i] = _.bind(args[i], that) if _.isFunction(args[i])


# as yet unimplemented functions


# Call this function to hook-up core function calls in the AST obtained from the parser.
# The second parameter is the name by which the core library will be available at the
# time of execution. In a browser this parameter will usually not need to be passed.
core.$wireCallsToCoreFunctions = (ast, coreIdentifier = 'closerCore', assertionsIdentifier = 'closerAssertions') ->
  globalScope = []  # list of identifiers in current scope (this one is the global scope)
  currentScope = globalScope
  scopeChain = [globalScope]   # the nth item represents the nth function scope starting from the global scope
  estraverse.replace ast,
    enter: (node) ->
      if node.type is 'FunctionExpression'
        fnScope = _.map node.params, (p) -> p.name
        currentScope = fnScope
        scopeChain.push fnScope
      else if node.type is 'VariableDeclarator' and node.id.type is 'Identifier' and node.id.name not in currentScope
        # NOTE that var declarations enter the current scope only at their point of declaration, so "var hoisting" does not come into the picture
        currentScope.push node.id.name
      node
    leave: (node) ->
      if node.type is 'Identifier' and node.name of core and _.every(scopeChain, (scope) -> node.name not in scope)
        obj = { type: 'Identifier', name: coreIdentifier, loc: node.loc }
        prop = { type: 'Identifier', name: node.name, loc: node.loc }
        node = { type: 'MemberExpression', object: obj, property: prop, computed: false, loc: node.loc }
      else if (node.type is 'MemberExpression' and node.object.type is 'Identifier' and node.object.name is coreIdentifier and
      node.property.type is 'MemberExpression' and node.property.object.type is 'Identifier' and node.property.object.name is coreIdentifier)
        # some nodes are the same object instance in memory, so they will be processed multiple times
        # so map.call(...) will become closerCore.closerCore.closerCore.map.call(...)
        # this is to reverse that effect
        return node.property
      else if node.type is 'MemberExpression' and node.object.type is 'Identifier' and node.object.name is 'assertions' and
      node.property.type is 'Identifier' and node.property.name of assertions
        node.object.name = assertionsIdentifier
      else if node.type is 'FunctionExpression'
        scopeChain.pop()
        currentScope = scopeChain[scopeChain.length-1]
      node
  ast


module.exports = core

self.closerCore = core if self?
window.closerCore = core if window?
