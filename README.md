Closer.js
=========

Closer.js is a Clojure parser written in JavaScript, compatible with the [Mozilla Parser API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API). It also provides much of the Clojure core library as JavaScript (thanks mostly to [swannodette/mori](http://swannodette.github.io/mori/)).

It was created to be used on [CodeCombat.com](http://codecombat.com), a site that teaches users how to code by playing a game (there's multiplayer too!). CodeCombat is [open-source](https://github.com/codecombat/codecombat), backed by [YCombinator](http://blog.codecombat.com/codecombat-in-y-combinator), participating in [Google Summer of Code 2014](https://www.google-melange.com/gsoc/org2/google/gsoc2014/codecombat), and is generally awesome all around. Go [check it out](http://codecombat.com)!

This project could be useful for a variety of other things like browser-based Clojure code editing, linting, syntax highlighting, or even [running sandboxed Clojure code](https://github.com/codecombat/aether).


Supported Language Features
---------------------------

 - [Special forms](http://clojure.org/special_forms)
   - def
   - if
   - do
   - let
   - fn
   - loop / recur
 - [Persistent data structures](http://clojure.org/data_structures) (courtesy [mori](http://swannodette.github.io/mori/))
 - [JavaScript interop](http://clojure.org/java_interop)
 - [Destructuring forms](http://clojure.org/special_forms#Special%20Forms--Binding%20Forms%20%28Destructuring%29)

`defmacro` is __not__ supported.


Documentation & Demo
--------------------

Up-to-date documentation is available on [the project website](https://vickychijwani.github.io/closer.js).


License
-------

Licensed under the [MIT License](LICENSE).


Contributors
------------
 - [Vicky Chijwani](http://github.com/vickychijwani)
