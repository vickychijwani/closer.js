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

  it 'loop + recur', ->
    eq '(loop [x 5 coll []]
          (if (zero? x)
              coll
              (recur (dec x) (conj coll x))))',
      vec [5..1]

  it 'defn / fn + recur', ->
    eq '(defn factorial [n]
          ((fn [n acc]
              (if (zero? n)
                  acc
                  (recur (dec n) (* acc n)))) n 1))

        (map factorial (range 1 6))',
      seq [1, 2, 6, 24, 120]

  it 'averaging numbers', ->
    eq '(defn avg [& xs]
          (/ (apply + xs) (count xs)))

        (avg 1 2 3 4)',
      2.5
    eq '(#(/ (apply + %&) (count %&)) 1 2 3 4)', 2.5

  it 'quick sort', ->
    eq '(defn qsort [coll]
          (let [pivot (first coll)]
            (when pivot
              (concat (qsort (filter #(< % pivot) coll))
                      (filter #{pivot} coll)
                      (qsort (filter #(> % pivot) coll))))))

        (qsort [8 3 7 3 2 10 1])',
      seq [1, 2, 3, 3, 7, 8, 10]

  it 'fibonacci sequence', ->
    eq '(defn fibs []
          (map first (iterate #(do [(% 1) (+ (% 0) (% 1))]) [0 1])))

        (take 10 (fibs))',
      seq [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
