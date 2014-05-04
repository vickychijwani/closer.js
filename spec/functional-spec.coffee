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

  it 'destructuring forms', ->
    eq '(defn blah
          [[a b & c :as coll1] d e & [f g & h :as coll2]]
          {:args [a b c d e f g h] :coll1 coll1 :coll2 coll2})

        (blah [1 2 3 4] 5 6 7 8 9)',
      map key('args'), vec(1, 2, seq([3, 4]), 5, 6, 7, 8, seq([9])),
        key('coll1'), vec([1..4]), key('coll2'), seq([7..9])

    throws '(fn [[a :as coll1] :as coll2])'
    throws '(fn [[:as coll1 a]])'

    eq '(defn blah
          [{{[a {:as m, :keys [b], e :d, :strs [c]}] [3 4]} :a}]
          [a b c e])

        (blah {:a {\'(3 4) [1 {:b true, :d :e, "c" :c}]}})',
      vec 1, true, key('c'), key('e')

    eq '(defn blah
          [{a 0 {b 0 c 1} 1}]
          [a b c])

        (blah ["hello" "world"])',
      vec 'hello', 'w', 'o'

    eq '(let [[a b] [1 {:d "d" \'(3 4) true}]
              {:keys [d] e [3 4]} b]
          [a d e])',
      vec 1, 'd', true

    eq '(loop [[a :as coll] [1 2 3 4] copy \'()]
          (if a
              (recur (rest coll) (conj copy a))
              copy))',
      list [4..1]

  it 'averaging numbers', ->
    eq '(defn avg [& xs]
          (/ (apply + xs) (count xs)))

        (avg 1 2 3 4)',
      2.5

    eq '(#(/ (apply + %&) (count %&)) 1 2 3 4)', 2.5

  it 'quick sort', ->
    eq '(defn qsort [[pivot :as coll]]
          (if pivot
            (concat (qsort (filter #(< % pivot) coll))
                    (filter #{pivot} coll)
                    (qsort (filter #(> % pivot) coll)))))

        (qsort [8 3 7 3 2 10 1])',
      seq [1, 2, 3, 3, 7, 8, 10]

  it 'fibonacci sequence', ->
    eq '(defn fibs []
          (map first (iterate (fn [[a b]] [b (+ a b)]) [0 1])))

        (take 10 (fibs))',
      seq [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
