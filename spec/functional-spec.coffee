_ = require 'lodash-node'
mori = require 'mori'
repl = require '../src/repl'
core = require '../src/closer-core'

beforeEach ->
  @addMatchers
  # custom matcher to compare mori collections
    toMoriEqual: (expected) ->
      @message = ->
        "Expected #{@actual} to equal #{expected}"
      mori.equals(@actual, expected)

evaluate = (src, options) ->
  eval repl.generateJS src, options

eq = (src, expected) -> expect(evaluate src).toMoriEqual expected
throws = (src) -> expect(-> evaluate src).toThrow()
truthy = (src) -> expect(evaluate src).toEqual true
falsy = (src) -> expect(evaluate src).toEqual false
nil = (src) -> expect(evaluate src).toEqual null

key = (x) -> mori.keyword x
seq = (seqable) -> mori.seq seqable
emptySeq = -> mori.empty mori.seq [1]
vec = (xs...) -> mori.vector.apply @, _.flatten xs
list = (xs...) -> mori.list.apply @, _.flatten xs
set = (xs...) -> mori.set _.flatten xs
map = (xs...) -> mori.hash_map.apply @, _.flatten xs


describe 'Functional tests', ->

  it 'quick sort', ->
    eq '(defn qsort [coll]
          (let [pivot (first coll)]
            (when pivot
              (concat (qsort (filter #(< % pivot) coll))
                      (filter #(= % pivot) coll)
                      (qsort (filter #(> % pivot) coll))))))

        (qsort [8 3 7 3 2 10 1])',
      seq [1, 2, 3, 3, 7, 8, 10]
