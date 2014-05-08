core =

  # arithmetic
  '_$PLUS_': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    _.reduce nums, ((sum, num) -> sum + num), 0

  '_$_': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(0) if nums.length is 1
    _.reduce nums.slice(1), ((diff, num) -> diff - num), nums[0]

  '_$STAR_': (nums...) ->
    assert.arity 0, Infinity, arguments
    assert.numbers nums
    _.reduce nums, ((prod, num) -> prod * num), 1

  '_$SLASH_': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    nums.unshift(1) if nums.length is 1
    _.reduce nums.slice(1), ((quo, num) -> quo / num), nums[0]

  'inc': (num) ->
    assert.arity 1, arguments
    assert.numbers num
    ++num

  'dec': (num) ->
    assert.arity 1, arguments
    assert.numbers num
    --num

  'max': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.max nums

  'min': (nums...) ->
    assert.arity 1, Infinity, arguments
    assert.numbers nums
    _.min nums

  'quot': (num, div) ->
    assert.arity 2, arguments
    assert.numbers arguments
    sign = if num > 0 and div > 0 or num < 0 and div < 0 then 1 else -1
    sign * Math.floor Math.abs num / div

  'rem': (num, div) ->
    assert.arity 2, arguments
    assert.numbers arguments
    num % div

  'mod': (num, div) ->
    assert.arity 2, arguments
    assert.numbers arguments
    rem = num % div
    if rem is 0 or (num > 0 and div > 0 or num < 0 and div < 0)
    then rem else rem + div

  'rand': () ->
    # arguments: [n]
    assert.arity 0, 1, arguments
    n = 1
    if arguments.length is 1
      assert.numbers arguments[0]
      n = arguments[0]
    Math.random() * n

  'rand_$_int': (n) ->
    assert.arity 1, arguments
    r = core.rand n
    if r >= 0 then Math.floor(r) else Math.ceil(r)


  # comparison / test
  '_$EQ_': (args...) ->
    assert.arity 1, Infinity, arguments
    args = _.uniq args   # remove duplicates
    return true if args.length is 1
    m.equals.apply null, args

  'not_$EQ_': (args...) ->
    assert.arity 1, Infinity, arguments
    core.not core['_$EQ_'].apply null, args

  '_$EQ__$EQ_': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    core['_$EQ_'].apply null, args

  '_$LT_': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val < args[idx+1])
    ), true

  '_$GT_': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val > args[idx+1])
    ), true

  '_$LT__$EQ_': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val <= args[idx+1])
    ), true

  '_$GT__$EQ_': (args...) ->
    assert.arity 1, Infinity, arguments
    return true if args.length is 1
    assert.numbers args
    _.reduce args, ((result, val, idx) ->
      result and (idx+1 is args.length or val >= args[idx+1])
    ), true

  'identical_$QMARK_': (x, y) ->
    assert.arity 2, arguments
    x is y

  'true_$QMARK_': (arg) ->
    assert.arity 1, arguments
    arg is true

  'false_$QMARK_': (arg) ->
    assert.arity 1, arguments
    arg is false

  'nil_$QMARK_': (arg) ->
    assert.arity 1, arguments
    arg is null

  'some_$QMARK_': (arg) ->
    assert.arity 1, arguments
    arg isnt null

  'number_$QMARK_': (x) ->
    assert.arity 1, arguments
    typeof x is 'number'

  'integer_$QMARK_': (x) ->
    assert.arity 1, arguments
    typeof x is 'number' and x % 1 is 0

  'float_$QMARK_': (x) ->
    assert.arity 1, arguments
    typeof x is 'number' and x % 1 isnt 0

  'zero_$QMARK_': (x) ->
    assert.arity 1, arguments
    core['_$EQ__$EQ_'](x, 0)

  'pos_$QMARK_': (x) ->
    assert.arity 1, arguments
    core['_$GT_'] x, 0

  'neg_$QMARK_': (x) ->
    assert.arity 1, arguments
    core['_$LT_'] x, 0

  'even_$QMARK_': (x) ->
    assert.arity 1, arguments
    assert.integers x
    core['zero_$QMARK_'] core['mod'] x, 2

  'odd_$QMARK_': (x) ->
    core['not'] core['even_$QMARK_'] x

  'contains_$QMARK_': (coll, key) ->
    assert.arity 2, arguments
    assert.associativeOrSet coll
    m.has_key coll, key

  'empty_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_empty coll

  'keyword_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_keyword x

  'list_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_list x

  'seq_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_seq x

  'vector_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_vector x

  'map_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_map x

  'set_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_set x

  'coll_$QMARK_': (x) ->
    assert.arity 1, arguments
    m.is_collection x

  'sequential_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_sequential coll

  'associative_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_associative coll

  'counted_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_counted coll

  'seqable_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_seqable coll

  'reversible_$QMARK_': (coll) ->
    assert.arity 1, arguments
    m.is_reversible coll


  # logic
  'boolean': (arg) ->
    assert.arity 1, arguments
    arg isnt false and arg isnt null

  'not': (arg) ->
    assert.arity 1, arguments
    not core.boolean(arg)


  # string
  'str': (args...) ->
    assert.arity 0, Infinity, arguments
    _.reduce args, ((str, arg) ->
      str += if core['nil_$QMARK_'](arg) then '' else arg.toString()
    ), ''


  # collections
  'keyword': (name) ->
    assert.arity 1, arguments
    m.keyword name

  'list': (items...) ->
    assert.arity 0, Infinity, arguments
    m.list.apply null, items

  'vector': (items...) ->
    assert.arity 0, Infinity, arguments
    m.vector.apply null, items

  'hash_$_map': (items...) ->
    assert.arity_custom arguments, (args) ->
      if args.length % 2 isnt 0
        "Expected even number of args, got #{args.length}"
    m.hash_map.apply null, items

  'hash_$_set': (items...) ->
    assert.arity 0, Infinity, arguments
    m.set items

  'count': (coll) ->
    assert.arity 1, arguments
    assert.seqable coll
    m.count coll

  'empty': (coll) ->
    assert.arity 1, arguments
    try m.empty coll
    catch error
      null

  'not_$_empty': (coll) ->
    assert.arity 1, arguments
    if core.count(coll) is 0 then null else coll

  'get': (coll, key, notFound = null) ->
    assert.arity 2, 3, arguments
    m.get coll, key, notFound

  'seq': (coll) ->
    assert.arity 1, arguments
    assert.seqable coll
    m.seq coll

  'first': (coll) ->
    assert.arity 1, arguments
    m.first coll

  'rest': (coll) ->
    assert.arity 1, arguments
    m.rest coll

  'next': (coll) ->
    assert.arity 1, arguments
    rest = core.rest coll
    if core['empty_$QMARK_'](rest) then null else rest

  'last': (coll) ->
    assert.arity 1, arguments
    m.last coll

  'nth': (coll, index, notFound) ->
    assert.arity 2, 3, arguments
    assert.sequential coll
    assert.numbers index     # float is cast to int
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

  'peek': (coll) ->
    assert.arity 1, arguments
    assert.stack coll
    m.peek coll

  'pop': (coll) ->
    assert.arity 1, arguments
    assert.stack coll
    m.pop coll

  'cons': (x, seq) ->
    assert.arity 2, arguments
    m.cons x, seq

  'conj': (coll, xs...) ->
    assert.arity 2, Infinity, arguments
    if core['map_$QMARK_'](coll) and _.any(xs, (x) -> core['vector_$QMARK_'](x) and core.count(x) isnt 2)
      throw new TypeError 'vector args to conjoin to a map must be pairs'
    m.conj.apply null, _.flatten [coll, xs]

  'into': (to, from) ->
    assert.arity 2, arguments
    return null if to is null and from is null
    m.reduce core.conj, to, from

  'concat': (seqs...) ->
    assert.arity 0, Infinity, arguments
    assert.seqable.apply null, seqs
    m.concat.apply null, seqs

  'flatten': (coll) ->
    assert.arity 1, arguments
    m.flatten coll

  'reverse': (coll) ->
    assert.arity 1, arguments
    assert.seqable coll
    m.reverse coll

  'assoc': (map, kvs...) ->
    assert.arity_custom arguments, (args) ->
      if args.length < 3 or args.length % 2 is 0
        "Expected odd number of args (at least 3), got #{args.length}"
    m.assoc.apply null, _.flatten [map, kvs]

  'dissoc': (map, keys...) ->
    assert.arity 1, Infinity, arguments
    return map if keys.length is 0
    m.dissoc.apply null, _.flatten [map, keys]

  'keys': (map) ->
    assert.arity 1, arguments
    assert.map map
    m.keys map

  'vals': (map) ->
    assert.arity 1, arguments
    assert.map map
    m.vals map

  'find': (map, key) ->
    assert.arity 2, arguments
    assert.associative map
    m.find map, key

  'range': (args...) ->
    # args: [] or [end] or [start end] or [start end step]
    assert.arity 0, 3, arguments
    assert.numbers args
    m.range.apply null, args

  'identity': (x) ->
    assert.arity 1, arguments
    x

  'apply': (f, args...) ->
    assert.arity 2, Infinity, arguments
    last = args[args.length-1]
    rest = args.slice 0, args.length-1
    assert.function f
    assert.seqable last
    lastSeq = core.seq(last)
    rest.push(core.nth(lastSeq, i)) for i in [0...core.count(lastSeq)]
    f.apply null, rest

  'map': (f, colls...) ->
    assert.arity 2, Infinity, arguments
    assert.function f
    m.map.apply null, arguments

  'mapcat': (f, colls...) ->
    assert.arity 2, Infinity, arguments
    assert.function f
    m.mapcat.apply null, arguments

  'filter': (pred, coll) ->
    assert.arity 2, arguments
    assert.function pred
    m.filter pred, coll

  'remove': (pred, coll) ->
    assert.arity 2, arguments
    assert.function pred
    m.remove pred, coll

  'reduce': (args...) ->
    # args: f, [initial], coll
    assert.arity 2, 3, arguments
    assert.function args[0]
    m.reduce.apply null, args

  'reduce_$_kv': (f, init, coll) ->
    assert.arity 3, arguments
    assert.function f
    m.reduce_kv f, init, coll

  'take': (n, coll) ->
    assert.arity 2, arguments
    assert.numbers n
    assert.seqable coll
    m.take n, coll

  'drop': (n, coll) ->
    assert.arity 2, arguments
    assert.numbers n
    assert.seqable coll
    m.drop n, coll

  'some': (pred, coll) ->
    assert.arity 2, arguments
    assert.function pred
    assert.seqable coll
    m.some pred, coll

  'every_$QMARK_': (pred, coll) ->
    assert.arity 2, arguments
    assert.function pred
    assert.seqable coll
    m.every pred, coll

  'sort': () ->
    # arguments: [cmp], coll
    assert.arity 1, 2, arguments
    if arguments.length is 1
      assert.seqable arguments[0]
    else
      assert.function arguments[0]
      assert.seqable arguments[1]
    m.sort.apply null, arguments

  'sort_$_by': () ->
    # arguments: keyfn, [cmp], coll
    assert.arity 2, 3, arguments
    if arguments.length is 2
      assert.function arguments[0]
      assert.seqable arguments[1]
    else
      assert.function arguments[0], arguments[1]
      assert.seqable arguments[2]
    m.sort_by.apply null, arguments

  'partition': () ->
    # arguments: n, [step], [pad], coll
    assert.arity 2, 4, arguments
    switch arguments.length
      when 2 then [n, coll] = arguments
      when 3
        [n, step, coll] = arguments
        assert.numbers step
      when 4
        [n, step, pad, coll] = arguments
        assert.numbers step
        assert.seqable pad
    assert.numbers n
    assert.seqable coll
    m.partition.apply null, arguments

  'partition_$_by': (f, coll) ->
    assert.arity 2, arguments
    assert.function f
    assert.seqable coll
    m.partition_by f, coll

  'group_$_by': (f, coll) ->
    assert.arity 2, arguments
    assert.function f
    assert.seqable coll
    m.group_by f, coll

  'zipmap': (keys, vals) ->
    assert.arity 2, arguments
    assert.seqable keys, vals
    m.zipmap keys, vals

  'iterate': (f, x) ->
    assert.arity 2, arguments
    assert.function f
    m.iterate f, x

  'constantly': (x) ->
    assert.arity 1, arguments
    m.constantly x

  'repeat': () ->
    # arguments: [n], x
    assert.arity 1, 2, arguments
    assert.numbers arguments[0] if arguments.length is 2
    m.repeat.apply null, arguments

  'repeatedly': () ->
    # arguments: [n], f
    assert.arity 1, 2, arguments
    if arguments.length is 1 then [f] = arguments else [n, f] = arguments
    assert.numbers n if typeof n isnt 'undefined'
    assert.function f
    m.repeatedly.apply null, arguments

  'comp': (fs...) ->
    assert.arity 0, Infinity, arguments
    assert.function.apply null, fs
    m.comp.apply null, fs

  'partial': (f, args...) ->
    assert.arity 1, Infinity, arguments
    assert.function f
    m.partial.apply null, arguments


module.exports = core

# requires go here, because of circular dependency
# see https://coderwall.com/p/myzvmg for more
_ = require './lodash'
m = require 'mori'
assert = require './assert'
