Closer.js
=========

Closer.js is a [parser](src/grammar.y) for the [Clojure programming language](http://clojure.org/) written in JavaScript, compatible with the [Mozilla Parser API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API). It also provides much of the [Clojure core](http://clojuredocs.org/quickref/clojure%20core) library as a [separate module](src/closer-core.coffee) (thanks in large part to [swannodette/mori](http://swannodette.github.io/mori/)). All of this is [heavily tested](http://vickychijwani.github.io/closer.js/spec_runner.html), with [> 90% code coverage](http://vickychijwani.github.io/closer.js/coverage/src/index.html) (the untested 10% is mostly [unused code](http://vickychijwani.github.io/closer.js/coverage/src/parser.js.html) from the [Jison parser generator](http://zaach.github.io/jison/)).

It was created to be used on [CodeCombat](http://codecombat.com), a site that teaches users how to code by playing a game (there's [multiplayer](http://blog.codecombat.com/multiplayer-programming-tournament) too!). CodeCombat is [open-source](https://github.com/codecombat/codecombat), backed by [YCombinator](http://blog.codecombat.com/codecombat-in-y-combinator), participating in [Google Summer of Code 2014](https://www.google-melange.com/gsoc/org2/google/gsoc2014/codecombat), and is generally awesome all around. Go [check it out](http://codecombat.com)!

This project could be useful for a variety of things like browser-based Clojure code editing, linting, syntax highlighting, auto-completion, and [running sandboxed Clojure code in a browser](https://github.com/codecombat/aether).


Key Features
------------

 - [Special forms](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser)
   - def
   - if
   - do
   - let
   - fn
   - loop / recur
 - [Persistent data structures](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser) (courtesy [mori](http://swannodette.github.io/mori/))
 - [JavaScript interop](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser%20JavaScript%20interop)
 - [Destructuring forms](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser%20Destructuring%20forms)
 - [Anonymous function literals](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser%20Functions%20parses%20anonymous%20function%20literals.)
 - [More than 100 functions](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20core%20library) from [clojure.core](http://jafingerhut.github.io/cheatsheet-clj-1.3/cheatsheet-use-title-attribute-cdocs-summary.html)
 - Many of the core functions can work with [lazy sequences](http://clojure.org/sequences), like `range`, `map`, `filter`, `iterate`, `take` and `repeat`
 - In [loose mode](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20parser%20Loose%20mode), the parser can handle common syntax errors (missing / excess parentheses at the end, etc.) and will always return a valid AST, even if empty, similar to [Acorn's loose mode](https://github.com/marijnh/acorn#acorn_loosejs)

`defmacro` is __not__ supported at the moment, as I haven't quite figured it out yet. Ideas and pull requests on how to go about it are always welcome!


Installation & Usage
--------------------

Get it [via NPM](http://npm.im/closer): `npm install closer`.

Closer works on Node.js and all modern browsers (via [browserify](http://browserify.org/)). It has been tested on Node 0.10.24, Chromium 34, and Firefox 28.


#### `closer.parse(src, options={})`

 - __src__ is a String containing the input Clojure code

 - __options__ can contain the following:

   - __loc__ (default `true`): if `true`, AST nodes will have [line and column-based location information](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API#Node_objects) attached to them

   - __range__ (default `false`): if `true`, AST nodes will have range-based location information attached to them, similar to [Esprima](http://esprima.org/doc/index.html#usage)

   - __loose__ (default `false`): if `true`, Closer will try to handle common syntax errors and will always return a valid AST, even if empty, similar to [Acorn's loose mode](https://github.com/marijnh/acorn#acorn_loosejs)

   - __coreIdentifier__ (default `'closerCore'`): if the [core library](src/closer-core.coffee) is being used, it must be in scope at the point of execution with this name. The parser qualifies calls to core functions with this. For example:
   ```js
   // parse
   var closer = require('closer');
   var ast = closer.parse('(+ 1 2)', { coreIdentifier: 'core' });
   // execute
   var core = closer.core; // the name of this variable must match coreIdentifier
   var escodegen = require('escodegen');
   eval(escodegen.generate(ast)); // === 3
   // escodegen generates JS from AST (https://github.com/Constellation/escodegen)
   ```
   If being used in a browser, this parameter will usually not need to be used.

   - __assertionsIdentifier__ (default `'closerAssertions'`): if user-defined functions are to be executed, the [assertions module](src/assertions.coffee) must be in scope at the point of execution with this name. For example:
   ```js
   // parse
   var closer = require('closer');
   var opts = { assertionsIdentifier: 'assertions' };
   var ast1 = closer.parse('(#(do %) 42)', opts);
   var ast2 = closer.parse('(#(do %) 42 57)', opts);
   var ast3 = closer.parse('(#(+ % %2) 42 "str")', opts);
   // execute
   var assertions = closer.assertions; // the name of this variable must match assertionsIdentifier
   var escodegen = require('escodegen');
   eval(escodegen.generate(ast1)); // === 42
   eval(escodegen.generate(ast2)); // ArityError: expected 1..1 args, got 2
   eval(escodegen.generate(ast3)); // ArgTypeError: str is not a number
   ```
   If being used in a browser, this parameter will usually not need to be used.


#### `closer.core`

All implemented clojure.core functions are in this object. A list of what's available can be found [here](http://vickychijwani.github.io/closer.js/spec_runner.html?spec=Closer%20core%20library).

Ensure it is in scope (with the same name as that passed in the parser's `coreIdentifier` option) if you want to execute JS code generated from your AST using [escodegen](https://github.com/Constellation/escodegen), for instance.


#### `closer.assertions`

This is a small module emulating Clojure's arity and type checks. You will never need to use this directly; only ensure it is in scope (with the same name as that passed in the parser's `assertionsIdentifier` option), if you want to execute JS code generated from your AST using [escodegen](https://github.com/Constellation/escodegen), for instance.



Demo
----

Check out [the demo page](https://vickychijwani.github.io/closer.js). Extensive examples of usage can be found in the [core](https://github.com/vickychijwani/closer.js/blob/master/spec/closer-core-spec.coffee) and [functional](https://github.com/vickychijwani/closer.js/blob/master/spec/functional-spec.coffee) tests.


Contributing
------------

Closer's primary dependencies are the [Jison parser generator](http://zaach.github.io/jison/) and [Mori](http://swannodette.github.io/mori/). All new features and functions should have [corresponding tests](spec/). [Issues](https://github.com/vickychijwani/closer.js/issues) and [pull requests](https://github.com/vickychijwani/closer.js/pulls) are welcome. [So are ideas, pointers, and code on how to implement `defmacro` in JavaScript](https://github.com/vickychijwani/closer.js/issues/6).

**Setup / workflow instructions:**

- Fork and clone this repository
- Run `npm install` from project root
- Run `grunt test` to make sure everything's working
- Make your changes, running `grunt test` to test them
- You can run `./repl` to get a basic Clojure REPL: it will display the parser output and execute it as JavaScript
- Once all tests pass, commit and push your changes, and send a pull request! Congratulations!

License
-------

Licensed under the [MIT License](LICENSE).


Contributors
------------

 - [Vicky Chijwani](http://github.com/vickychijwani)
 - Closer exists thanks to the following projects:
   - [CodeCombat](https://github.com/codecombat/codecombat/) and [Aether](https://github.com/codecombat/aether/) (the _raisons d'être_ for this project)
   - [Jison](http://zaach.github.io/jison/)
   - [Mori](http://swannodette.github.io/mori/)
   - [Lodash](http://lodash.com/)
   - [Jasmine](http://jasmine.github.io/)
   - [Reflect.js](https://github.com/zaach/reflect.js) (for helping me get started)
   - [Browserify](http://browserify.org/)
   - [@Constellation's escodegen and estraverse](https://github.com/Constellation?tab=repositories)
   - [Grunt](http://gruntjs.com/)
