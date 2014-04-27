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

__$this = (() ->
  class Soldier
    constructor: (enemy = null) ->
      @pos =
        x: 0
        y: 0
      @enemy = enemy
    'move-x-y': (x, y) ->
      @pos.x = x
      @pos.y = y

  new Soldier(new Soldier())
)()


describe 'Functional tests', ->

  it 'js interop - \'this\' access', ->
    __$this['move-x-y'](0, 0)
    __$this.enemy['move-x-y'](10, 20)
    eq '(let [epos (.pos (.enemy this))]
          (.move-x-y this (.x epos) (.y epos)))

        [(.x (.pos this)) (.y (.pos this))]',
      vec 10, 20

  it 'quick sort', ->
    eq '(defn qsort [coll]
          (let [pivot (first coll)]
            (when pivot
              (concat (qsort (filter #(< % pivot) coll))
                      (filter #{pivot} coll)
                      (qsort (filter #(> % pivot) coll))))))

        (qsort [8 3 7 3 2 10 1])',
      seq [1, 2, 3, 3, 7, 8, 10]
