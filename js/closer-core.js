!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.closerCore=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function() {
  var ArgTypeError, ArityError, assert, checkTypes, types, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  ArityError = (function(_super) {
    __extends(ArityError, _super);

    function ArityError(expected_min, expected_max, actual) {
      Error.captureStackTrace(this, this.constructor);
      this.name = 'ArityError';
      this.message = "Expected " + expected_min + ".." + expected_max + " args, got " + actual;
    }

    return ArityError;

  })(Error);

  ArgTypeError = (function(_super) {
    __extends(ArgTypeError, _super);

    function ArgTypeError(args, expectedTypes) {
      var actual, expected;
      Error.captureStackTrace(this, this.constructor);
      actual = _.pluck(args, 'type');
      expected = _.pluck(expectedTypes, 'typeName');
      this.name = 'ArgTypeError';
      this.message = "Expected " + (expected.join(' or ')) + ", got [" + (actual.join(', ')) + "]";
    }

    return ArgTypeError;

  })(Error);

  checkTypes = function(args, expectedTypes) {
    return _.every(args, function(arg) {
      return _.some(expectedTypes, function(type) {
        return arg instanceof type;
      });
    });
  };

  assert = {
    types: function(args, expectedTypes) {
      if (!checkTypes(args, expectedTypes)) {
        throw new ArgTypeError(args, expectedTypes);
      }
    },
    notTypes: function(args, expectedTypes) {
      if (checkTypes(args, expectedTypes)) {
        throw new ArgTypeError(args, expectedTypes);
      }
    },
    numbers: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return assert.types(_.flatten(args, true), [types.Number]);
    },
    collections: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return assert.types(_.flatten(args, true), [types.Collection]);
    },
    arity: function() {
      var args, expected_max, expected_min, _ref;
      expected_min = arguments[0], expected_max = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      args = _.flatten(args, true);
      if (!((expected_min <= (_ref = args.length) && _ref <= expected_max))) {
        throw new ArityError(expected_min, expected_max, args.length);
      }
    }
  };

  module.exports = assert;

  _ = _dereq_('lodash-node');

  types = _dereq_('./closer-types');

}).call(this);

},{"./closer-types":3,"lodash-node":77}],2:[function(_dereq_,module,exports){
(function() {
  var allEqual, allOfSameType, assert, core, getUniqueValues, getValues, sameSign, types, _,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  sameSign = function(num1, num2) {
    return num1.value > 0 && num2.value > 0 || num1.value < 0 && num2.value < 0;
  };

  getValues = function(args) {
    return _.map(args, 'value');
  };

  getUniqueValues = function(args) {
    return _.uniq(args, false, 'value');
  };

  allEqual = function(args) {
    return getUniqueValues(args).length === 1;
  };

  allOfSameType = function(args) {
    return _.uniq(args, false, 'type').length === 1;
  };

  core = {
    '+': function() {
      var nums, type;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.numbers(nums);
      type = types.getResultType(nums);
      return new type(_.reduce(nums, (function(sum, num) {
        return sum + num.value;
      }), 0));
    },
    '-': function() {
      var nums, type;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(new types.Integer(0));
      }
      type = types.getResultType(nums);
      return new type(_.reduce(nums.slice(1), (function(diff, num) {
        return diff - num.value;
      }), nums[0].value));
    },
    '*': function() {
      var nums, type;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.numbers(nums);
      type = types.getResultType(nums);
      return new type(_.reduce(nums, (function(prod, num) {
        return prod * num.value;
      }), 1));
    },
    '/': function() {
      var nums, result, resultIsFloat, type;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      if (nums.length === 1) {
        nums.unshift(new types.Integer(1));
      }
      result = _.reduce(nums.slice(1), (function(quo, num) {
        return quo / num.value;
      }), nums[0].value);
      resultIsFloat = types.getResultType(nums) === types.Float || result % 1 !== 0;
      type = resultIsFloat ? types.Float : types.Integer;
      return new type(result);
    },
    'inc': function(num) {
      var type;
      assert.arity(1, 1, arguments);
      assert.numbers(num);
      type = types.getResultType(arguments);
      return new type(++num.value);
    },
    'dec': function(num) {
      var type;
      assert.arity(1, 1, arguments);
      assert.numbers(num);
      type = types.getResultType(arguments);
      return new type(--num.value);
    },
    'max': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      return _.max(nums, 'value');
    },
    'min': function() {
      var nums;
      nums = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      assert.numbers(nums);
      return _.min(nums, 'value');
    },
    'quot': function(num, div) {
      var sign, type;
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      type = types.getResultType(arguments);
      sign = sameSign(num, div) ? 1 : -1;
      return new type(sign * Math.floor(Math.abs(num.value / div.value)));
    },
    'rem': function(num, div) {
      var type;
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      type = types.getResultType(arguments);
      return new type(num.value % div.value);
    },
    'mod': function(num, div) {
      var rem, type;
      assert.arity(2, 2, arguments);
      assert.numbers(arguments);
      type = types.getResultType(arguments);
      rem = num.value % div.value;
      return new type(rem === 0 || sameSign(num, div) ? rem : rem + div.value);
    },
    '=': function() {
      var args, values;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      args = _.uniq(args);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      values = getValues(args);
      if (_.every(args, function(arg) {
        return arg instanceof types.Sequential;
      })) {
        return new types.Boolean(_.reduce(_.zip(values), (function(result, items) {
          if (__indexOf.call(_.map(items, function(item) {
            return typeof item;
          }), 'undefined') >= 0) {
            return false;
          }
          return result && core['='].apply(this, items).isTrue();
        }), true));
      }
      if (_.every(args, function(arg) {
        return arg instanceof types.HashSet;
      })) {
        if (_.uniq(_.map(values, 'length')).length !== 1) {
          return types.Boolean["false"];
        }
        return new types.Boolean(_.reduce(_.rest(args), (function(result, set1) {
          var set2;
          set2 = _.first(args);
          return result && _.every(set1.value, function(item1) {
            return core['contains?'](set2, item1).isTrue() && _.every(set2.value, function(item2) {
              return core['contains?'](set1, item2).isTrue();
            });
          });
        }), true));
      }
      if (_.some(args, function(arg) {
        return arg instanceof types.Collection;
      })) {
        return types.Boolean["false"];
      }
      if (!allOfSameType(args)) {
        return types.Boolean["false"];
      }
      return new types.Boolean(allEqual(args));
    },
    'not=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      return core.not(core['='].apply(this, args));
    },
    '==': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      assert.numbers(args);
      return new types.Boolean(allEqual(_.uniq(args)));
    },
    '<': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      assert.numbers(args);
      return new types.Boolean(_.reduce(getValues(args), (function(result, val, idx, values) {
        return result && (idx + 1 === values.length || val < values[idx + 1]);
      }), true));
    },
    '>': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      assert.numbers(args);
      return new types.Boolean(_.reduce(getValues(args), (function(result, val, idx, values) {
        return result && (idx + 1 === values.length || val > values[idx + 1]);
      }), true));
    },
    '<=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      assert.numbers(args);
      return new types.Boolean(_.reduce(getValues(args), (function(result, val, idx, values) {
        return result && (idx + 1 === values.length || val <= values[idx + 1]);
      }), true));
    },
    '>=': function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(1, Infinity, arguments);
      if (args.length === 1) {
        return types.Boolean["true"];
      }
      assert.numbers(args);
      return new types.Boolean(_.reduce(getValues(args), (function(result, val, idx, values) {
        return result && (idx + 1 === values.length || val >= values[idx + 1]);
      }), true));
    },
    'identical?': function(x, y) {
      assert.arity(2, 2, arguments);
      if (_.every([x, y], function(arg) {
        var _ref;
        return (_ref = arg.type) === 'Integer' || _ref === 'Boolean' || _ref === 'Nil';
      })) {
        return core['='](x, y);
      }
      return new types.Boolean(x === y);
    },
    'true?': function(arg) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(arg instanceof types.BaseType && arg.isTrue());
    },
    'false?': function(arg) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(arg instanceof types.BaseType && arg.isFalse());
    },
    'nil?': function(arg) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(arg instanceof types.BaseType && arg.isNil());
    },
    'some?': function(arg) {
      assert.arity(1, 1, arguments);
      return core['nil?'](arg).complement();
    },
    'number?': function(x) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(x instanceof types.Number);
    },
    'integer?': function(x) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(x instanceof types.Integer);
    },
    'float?': function(x) {
      assert.arity(1, 1, arguments);
      return new types.Boolean(x instanceof types.Float);
    },
    'zero?': function(x) {
      assert.arity(1, 1, arguments);
      return core['=='](x, new types.Integer(0));
    },
    'pos?': function(x) {
      assert.arity(1, 1, arguments);
      return core['>'](x, new types.Integer(0));
    },
    'neg?': function(x) {
      assert.arity(1, 1, arguments);
      return core['<'](x, new types.Integer(0));
    },
    'even?': function(x) {
      assert.arity(1, 1, arguments);
      assert.types([x], [types.Integer]);
      return core['zero?'](core['mod'](x, new types.Integer(2)));
    },
    'odd?': function(x) {
      return core['not'](core['even?'](x));
    },
    'contains?': function(coll, key) {
      var _ref;
      assert.arity(2, 2, arguments);
      assert.collections(coll);
      assert.notTypes([coll], [types.List]);
      if (coll instanceof types.Vector) {
        return new types.Boolean((0 <= (_ref = key.value) && _ref < coll.value.length));
      }
      return new types.Boolean(_.any(coll.value, function(item) {
        return core['='](key, item).isTrue();
      }));
    },
    'boolean': function(arg) {
      assert.arity(1, 1, arguments);
      if (!(arg instanceof types.BaseType)) {
        return types.Boolean["true"];
      }
      return new types.Boolean(!arg.isFalse() && !arg.isNil());
    },
    'not': function(arg) {
      assert.arity(1, 1, arguments);
      return core.boolean(arg).complement();
    },
    'str': function() {
      var arg, args, collStr, str, type, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      assert.arity(0, Infinity, arguments);
      assert.types(args, [types.BaseType]);
      if (args.length === 0) {
        return new types.String('');
      }
      str = '';
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        str += (function() {
          switch (false) {
            case !(arg instanceof types.Nil):
              return '';
            case !(arg instanceof types.Collection):
              type = types[arg.type];
              collStr = _.map(arg.value, function(item) {
                return core['str'](item).value;
              }).join(' ');
              return type.startDelimiter + collStr + type.endDelimiter;
            default:
              return arg.value.toString();
          }
        })();
      }
      return new types.String(str);
    },
    'count': function(coll) {
      assert.arity(1, 1, arguments);
      assert.types([coll], [types.Nil, types.String, types.Collection]);
      return new types.Integer(coll instanceof types.Nil ? 0 : coll.value.length);
    }
  };

  module.exports = core;

  _ = _dereq_('lodash-node');

  types = _dereq_('./closer-types');

  assert = _dereq_('./assert');

}).call(this);

},{"./assert":1,"./closer-types":3,"lodash-node":77}],3:[function(_dereq_,module,exports){
(function() {
  var core, types, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  types = {};

  types.BaseType = (function() {
    function _Class(value, type) {
      if (type == null) {
        type = this.constructor.typeName;
      }
      this.type = type;
      this.value = value;
    }

    _Class.prototype.isTrue = function() {
      return this instanceof types.Boolean && this.value === true;
    };

    _Class.prototype.isFalse = function() {
      return this instanceof types.Boolean && this.value === false;
    };

    _Class.prototype.isNil = function() {
      return this instanceof types.Nil;
    };

    _Class.typeName = 'BaseType';

    return _Class;

  })();

  types.Primitive = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Primitive';

    return _Class;

  })(types.BaseType);

  types.Number = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Number';

    return _Class;

  })(types.Primitive);

  types.Integer = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Integer';

    return _Class;

  })(types.Number);

  types.Float = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Float';

    return _Class;

  })(types.Number);

  types.String = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'String';

    return _Class;

  })(types.Primitive);

  types.Boolean = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.complement = function() {
      if (this.isTrue()) {
        return this.constructor["false"];
      } else {
        return this.constructor["true"];
      }
    };

    _Class.typeName = 'Boolean';

    _Class["true"] = new _Class(true, 'Boolean');

    _Class["false"] = new _Class(false, 'Boolean');

    return _Class;

  })(types.Primitive);

  types.Nil = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Nil';

    _Class.nil = new _Class(null, 'Nil');

    return _Class;

  })(types.Primitive);

  types.Collection = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Collection';

    _Class.startDelimiter = 'Collection(';

    _Class.endDelimiter = ')';

    return _Class;

  })(types.BaseType);

  types.Sequential = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Sequential';

    return _Class;

  })(types.Collection);

  types.Vector = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'Vector';

    _Class.startDelimiter = '[';

    _Class.endDelimiter = ']';

    return _Class;

  })(types.Sequential);

  types.List = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.typeName = 'List';

    _Class.startDelimiter = '(';

    _Class.endDelimiter = ')';

    return _Class;

  })(types.Sequential);

  types.HashSet = (function(_super) {
    __extends(_Class, _super);

    function _Class(values) {
      var uniques;
      uniques = [];
      _.each(values, function(val) {
        var isNew;
        isNew = _.every(uniques, function(uniq) {
          return core['not='](val, uniq).value;
        });
        if (isNew) {
          return uniques.push(val);
        }
      });
      _Class.__super__.constructor.call(this, uniques);
    }

    _Class.typeName = 'HashSet';

    _Class.startDelimiter = '#{';

    _Class.endDelimiter = '}';

    return _Class;

  })(types.Collection);

  types.getResultType = function(nums) {
    if (_.some(nums, function(n) {
      return n instanceof types.Float;
    })) {
      return types.Float;
    } else {
      return types.Integer;
    }
  };

  module.exports = types;

  _ = _dereq_('lodash-node');

  core = _dereq_('./closer-core');

}).call(this);

},{"./closer-core":2,"lodash-node":77}],4:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'compact': _dereq_('./arrays/compact'),
  'difference': _dereq_('./arrays/difference'),
  'drop': _dereq_('./arrays/rest'),
  'findIndex': _dereq_('./arrays/findIndex'),
  'findLastIndex': _dereq_('./arrays/findLastIndex'),
  'first': _dereq_('./arrays/first'),
  'flatten': _dereq_('./arrays/flatten'),
  'head': _dereq_('./arrays/first'),
  'indexOf': _dereq_('./arrays/indexOf'),
  'initial': _dereq_('./arrays/initial'),
  'intersection': _dereq_('./arrays/intersection'),
  'last': _dereq_('./arrays/last'),
  'lastIndexOf': _dereq_('./arrays/lastIndexOf'),
  'object': _dereq_('./arrays/zipObject'),
  'pull': _dereq_('./arrays/pull'),
  'range': _dereq_('./arrays/range'),
  'remove': _dereq_('./arrays/remove'),
  'rest': _dereq_('./arrays/rest'),
  'sortedIndex': _dereq_('./arrays/sortedIndex'),
  'tail': _dereq_('./arrays/rest'),
  'take': _dereq_('./arrays/first'),
  'union': _dereq_('./arrays/union'),
  'uniq': _dereq_('./arrays/uniq'),
  'unique': _dereq_('./arrays/uniq'),
  'unzip': _dereq_('./arrays/zip'),
  'without': _dereq_('./arrays/without'),
  'xor': _dereq_('./arrays/xor'),
  'zip': _dereq_('./arrays/zip'),
  'zipObject': _dereq_('./arrays/zipObject')
};

},{"./arrays/compact":5,"./arrays/difference":6,"./arrays/findIndex":7,"./arrays/findLastIndex":8,"./arrays/first":9,"./arrays/flatten":10,"./arrays/indexOf":11,"./arrays/initial":12,"./arrays/intersection":13,"./arrays/last":14,"./arrays/lastIndexOf":15,"./arrays/pull":16,"./arrays/range":17,"./arrays/remove":18,"./arrays/rest":19,"./arrays/sortedIndex":20,"./arrays/union":21,"./arrays/uniq":22,"./arrays/without":23,"./arrays/xor":24,"./arrays/zip":25,"./arrays/zipObject":26}],5:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are all falsey.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to compact.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result.push(value);
    }
  }
  return result;
}

module.exports = compact;

},{}],6:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseFlatten = _dereq_('../internals/baseFlatten');

/**
 * Creates an array excluding all values of the provided arrays using strict
 * equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
 * // => [1, 3, 4]
 */
function difference(array) {
  return baseDifference(array, baseFlatten(arguments, true, true, 1));
}

module.exports = difference;

},{"../internals/baseDifference":84,"../internals/baseFlatten":85}],7:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * This method is like `_.find` except that it returns the index of the first
 * element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.findIndex(characters, function(chr) {
 *   return chr.age < 20;
 * });
 * // => 2
 *
 * // using "_.where" callback shorthand
 * _.findIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findIndex(characters, 'blocked');
 * // => 1
 */
function findIndex(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0;

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    if (callback(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = findIndex;

},{"../functions/createCallback":66}],8:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': true },
 *   { 'name': 'fred',    'age': 40, 'blocked': false },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
 * ];
 *
 * _.findLastIndex(characters, function(chr) {
 *   return chr.age > 30;
 * });
 * // => 1
 *
 * // using "_.where" callback shorthand
 * _.findLastIndex(characters, { 'age': 36 });
 * // => 0
 *
 * // using "_.pluck" callback shorthand
 * _.findLastIndex(characters, 'blocked');
 * // => 2
 */
function findLastIndex(array, callback, thisArg) {
  var length = array ? array.length : 0;
  callback = createCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(array[length], length, array)) {
      return length;
    }
  }
  return -1;
}

module.exports = findLastIndex;

},{"../functions/createCallback":66}],9:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the first element or first `n` elements of an array. If a callback
 * is provided elements at the beginning of the array are returned as long
 * as the callback returns truey. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias head, take
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the first element(s) of `array`.
 * @example
 *
 * _.first([1, 2, 3]);
 * // => 1
 *
 * _.first([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.first([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.first(characters, 'blocked');
 * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
 * // => ['barney', 'fred']
 */
function first(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = -1;
    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[0] : undefined;
    }
  }
  return slice(array, 0, nativeMin(nativeMax(0, n), length));
}

module.exports = first;

},{"../functions/createCallback":66,"../internals/slice":119}],10:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    map = _dereq_('../collections/map');

/**
 * Flattens a nested array (the nesting can be to any depth). If `isShallow`
 * is truey, the array will only be flattened a single level. If a callback
 * is provided each element of the array is passed through the callback before
 * flattening. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new flattened array.
 * @example
 *
 * _.flatten([1, [2], [3, [[4]]]]);
 * // => [1, 2, 3, 4];
 *
 * _.flatten([1, [2], [3, [[4]]]], true);
 * // => [1, 2, 3, [[4]]];
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.flatten(characters, 'pets');
 * // => ['hoppy', 'baby puss', 'dino']
 */
function flatten(array, isShallow, callback, thisArg) {
  // juggle arguments
  if (typeof isShallow != 'boolean' && isShallow != null) {
    thisArg = callback;
    callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
    isShallow = false;
  }
  if (callback != null) {
    array = map(array, callback, thisArg);
  }
  return baseFlatten(array, isShallow);
}

module.exports = flatten;

},{"../collections/map":46,"../internals/baseFlatten":85}],11:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    sortedIndex = _dereq_('./sortedIndex');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found using
 * strict equality for comparisons, i.e. `===`. If the array is already sorted
 * providing `true` for `fromIndex` will run a faster binary search.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {boolean|number} [fromIndex=0] The index to search from or `true`
 *  to perform a binary search on a sorted array.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 1
 *
 * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 4
 *
 * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
 * // => 2
 */
function indexOf(array, value, fromIndex) {
  if (typeof fromIndex == 'number') {
    var length = array ? array.length : 0;
    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
  } else if (fromIndex) {
    var index = sortedIndex(array, value);
    return array[index] === value ? index : -1;
  }
  return baseIndexOf(array, value, fromIndex);
}

module.exports = indexOf;

},{"../internals/baseIndexOf":86,"./sortedIndex":20}],12:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets all but the last element or last `n` elements of an array. If a
 * callback is provided elements at the end of the array are excluded from
 * the result as long as the callback returns truey. The callback is bound
 * to `thisArg` and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 *
 * _.initial([1, 2, 3], 2);
 * // => [1]
 *
 * _.initial([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [1]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.initial(characters, 'blocked');
 * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
 *
 * // using "_.where" callback shorthand
 * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
 * // => ['barney', 'fred']
 */
function initial(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : callback || n;
  }
  return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
}

module.exports = initial;

},{"../functions/createCallback":66,"../internals/slice":119}],13:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    cacheIndexOf = _dereq_('../internals/cacheIndexOf'),
    createCache = _dereq_('../internals/createCache'),
    getArray = _dereq_('../internals/getArray'),
    isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray'),
    largeArraySize = _dereq_('../internals/largeArraySize'),
    releaseArray = _dereq_('../internals/releaseArray'),
    releaseObject = _dereq_('../internals/releaseObject');

/**
 * Creates an array of unique values present in all provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of shared values.
 * @example
 *
 * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2]
 */
function intersection() {
  var args = [],
      argsIndex = -1,
      argsLength = arguments.length,
      caches = getArray(),
      indexOf = baseIndexOf,
      trustIndexOf = indexOf === baseIndexOf,
      seen = getArray();

  while (++argsIndex < argsLength) {
    var value = arguments[argsIndex];
    if (isArray(value) || isArguments(value)) {
      args.push(value);
      caches.push(trustIndexOf && value.length >= largeArraySize &&
        createCache(argsIndex ? args[argsIndex] : seen));
    }
  }
  var array = args[0],
      index = -1,
      length = array ? array.length : 0,
      result = [];

  outer:
  while (++index < length) {
    var cache = caches[0];
    value = array[index];

    if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
      argsIndex = argsLength;
      (cache || seen).push(value);
      while (--argsIndex) {
        cache = caches[argsIndex];
        if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
          continue outer;
        }
      }
      result.push(value);
    }
  }
  while (argsLength--) {
    cache = caches[argsLength];
    if (cache) {
      releaseObject(cache);
    }
  }
  releaseArray(caches);
  releaseArray(seen);
  return result;
}

module.exports = intersection;

},{"../internals/baseIndexOf":86,"../internals/cacheIndexOf":91,"../internals/createCache":96,"../internals/getArray":100,"../internals/largeArraySize":106,"../internals/releaseArray":114,"../internals/releaseObject":115,"../objects/isArguments":136,"../objects/isArray":137}],14:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Gets the last element or last `n` elements of an array. If a callback is
 * provided elements at the end of the array are returned as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback] The function called
 *  per element or the number of elements to return. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the last element(s) of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 *
 * _.last([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.last([1, 2, 3], function(num) {
 *   return num > 1;
 * });
 * // => [2, 3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.last(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.last(characters, { 'employer': 'na' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function last(array, callback, thisArg) {
  var n = 0,
      length = array ? array.length : 0;

  if (typeof callback != 'number' && callback != null) {
    var index = length;
    callback = createCallback(callback, thisArg, 3);
    while (index-- && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = callback;
    if (n == null || thisArg) {
      return array ? array[length - 1] : undefined;
    }
  }
  return slice(array, nativeMax(0, length - n));
}

module.exports = last;

},{"../functions/createCallback":66,"../internals/slice":119}],15:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the index at which the last occurrence of `value` is found using strict
 * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
 * as the offset from the end of the collection.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
 * // => 4
 *
 * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var index = array ? array.length : 0;
  if (typeof fromIndex == 'number') {
    index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
  }
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = lastIndexOf;

},{}],16:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all provided values from the given array using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {...*} [value] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3, 1, 2, 3];
 * _.pull(array, 2, 3);
 * console.log(array);
 * // => [1, 1]
 */
function pull(array) {
  var args = arguments,
      argsIndex = 0,
      argsLength = args.length,
      length = array ? array.length : 0;

  while (++argsIndex < argsLength) {
    var index = -1,
        value = args[argsIndex];
    while (++index < length) {
      if (array[index] === value) {
        splice.call(array, index--, 1);
        length--;
      }
    }
  }
  return array;
}

module.exports = pull;

},{}],17:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var ceil = Math.ceil;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to but not including `end`. If `start` is less than `stop` a
 * zero-length range is created unless a negative `step` is specified.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns a new range array.
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
function range(start, end, step) {
  start = +start || 0;
  step = typeof step == 'number' ? step : (+step || 1);

  if (end == null) {
    end = start;
    start = 0;
  }
  // use `Array(length)` so engines like Chakra and V8 avoid slower modes
  // http://youtu.be/XAqIpGU8ZZk#t=17m25s
  var index = -1,
      length = nativeMax(0, ceil((end - start) / (step || 1))),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
}

module.exports = range;

},{}],18:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var splice = arrayRef.splice;

/**
 * Removes all elements from an array that the callback returns truey for
 * and returns an array of removed elements. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to modify.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4, 5, 6];
 * var evens = _.remove(array, function(num) { return num % 2 == 0; });
 *
 * console.log(array);
 * // => [1, 3, 5]
 *
 * console.log(evens);
 * // => [2, 4, 6]
 */
function remove(array, callback, thisArg) {
  var index = -1,
      length = array ? array.length : 0,
      result = [];

  callback = createCallback(callback, thisArg, 3);
  while (++index < length) {
    var value = array[index];
    if (callback(value, index, array)) {
      result.push(value);
      splice.call(array, index--, 1);
      length--;
    }
  }
  return result;
}

module.exports = remove;

},{"../functions/createCallback":66}],19:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    slice = _dereq_('../internals/slice');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * The opposite of `_.initial` this method gets all but the first element or
 * first `n` elements of an array. If a callback function is provided elements
 * at the beginning of the array are excluded from the result as long as the
 * callback returns truey. The callback is bound to `thisArg` and invoked
 * with three arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias drop, tail
 * @category Arrays
 * @param {Array} array The array to query.
 * @param {Function|Object|number|string} [callback=1] The function called
 *  per element or the number of elements to exclude. If a property name or
 *  object is provided it will be used to create a "_.pluck" or "_.where"
 *  style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a slice of `array`.
 * @example
 *
 * _.rest([1, 2, 3]);
 * // => [2, 3]
 *
 * _.rest([1, 2, 3], 2);
 * // => [3]
 *
 * _.rest([1, 2, 3], function(num) {
 *   return num < 3;
 * });
 * // => [3]
 *
 * var characters = [
 *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
 *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
 *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.pluck(_.rest(characters, 'blocked'), 'name');
 * // => ['fred', 'pebbles']
 *
 * // using "_.where" callback shorthand
 * _.rest(characters, { 'employer': 'slate' });
 * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
 */
function rest(array, callback, thisArg) {
  if (typeof callback != 'number' && callback != null) {
    var n = 0,
        index = -1,
        length = array ? array.length : 0;

    callback = createCallback(callback, thisArg, 3);
    while (++index < length && callback(array[index], index, array)) {
      n++;
    }
  } else {
    n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
  }
  return slice(array, n);
}

module.exports = rest;

},{"../functions/createCallback":66,"../internals/slice":119}],20:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    identity = _dereq_('../utilities/identity');

/**
 * Uses a binary search to determine the smallest index at which a value
 * should be inserted into a given sorted array in order to maintain the sort
 * order of the array. If a callback is provided it will be executed for
 * `value` and each element of `array` to compute their sort ranking. The
 * callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([20, 30, 50], 40);
 * // => 2
 *
 * // using "_.pluck" callback shorthand
 * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
 * // => 2
 *
 * var dict = {
 *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
 * };
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return dict.wordToNumber[word];
 * });
 * // => 2
 *
 * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
 *   return this.wordToNumber[word];
 * }, dict);
 * // => 2
 */
function sortedIndex(array, value, callback, thisArg) {
  var low = 0,
      high = array ? array.length : low;

  // explicitly reference `identity` for better inlining in Firefox
  callback = callback ? createCallback(callback, thisArg, 1) : identity;
  value = callback(value);

  while (low < high) {
    var mid = (low + high) >>> 1;
    (callback(array[mid]) < value)
      ? low = mid + 1
      : high = mid;
  }
  return low;
}

module.exports = sortedIndex;

},{"../functions/createCallback":66,"../utilities/identity":165}],21:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    baseUniq = _dereq_('../internals/baseUniq');

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * strict equality for comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of combined values.
 * @example
 *
 * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
 * // => [1, 2, 3, 5, 4]
 */
function union() {
  return baseUniq(baseFlatten(arguments, true, true));
}

module.exports = union;

},{"../internals/baseFlatten":85,"../internals/baseUniq":90}],22:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseUniq = _dereq_('../internals/baseUniq'),
    createCallback = _dereq_('../functions/createCallback');

/**
 * Creates a duplicate-value-free version of an array using strict equality
 * for comparisons, i.e. `===`. If the array is sorted, providing
 * `true` for `isSorted` will use a faster algorithm. If a callback is provided
 * each element of `array` is passed through the callback before uniqueness
 * is computed. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias unique
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a duplicate-value-free array.
 * @example
 *
 * _.uniq([1, 2, 1, 3, 1]);
 * // => [1, 2, 3]
 *
 * _.uniq([1, 1, 2, 2, 3], true);
 * // => [1, 2, 3]
 *
 * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
 * // => ['A', 'b', 'C']
 *
 * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
 * // => [1, 2.5, 3]
 *
 * // using "_.pluck" callback shorthand
 * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniq(array, isSorted, callback, thisArg) {
  // juggle arguments
  if (typeof isSorted != 'boolean' && isSorted != null) {
    thisArg = callback;
    callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
    isSorted = false;
  }
  if (callback != null) {
    callback = createCallback(callback, thisArg, 3);
  }
  return baseUniq(array, isSorted, callback);
}

module.exports = uniq;

},{"../functions/createCallback":66,"../internals/baseUniq":90}],23:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    slice = _dereq_('../internals/slice');

/**
 * Creates an array excluding all provided values using strict equality for
 * comparisons, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {Array} array The array to filter.
 * @param {...*} [value] The values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 * @example
 *
 * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
 * // => [2, 3, 4]
 */
function without(array) {
  return baseDifference(array, slice(arguments, 1));
}

module.exports = without;

},{"../internals/baseDifference":84,"../internals/slice":119}],24:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseUniq = _dereq_('../internals/baseUniq'),
    isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray');

/**
 * Creates an array that is the symmetric difference of the provided arrays.
 * See http://en.wikipedia.org/wiki/Symmetric_difference.
 *
 * @static
 * @memberOf _
 * @category Arrays
 * @param {...Array} [array] The arrays to inspect.
 * @returns {Array} Returns an array of values.
 * @example
 *
 * _.xor([1, 2, 3], [5, 2, 1, 4]);
 * // => [3, 5, 4]
 *
 * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
 * // => [1, 4, 5]
 */
function xor() {
  var index = -1,
      length = arguments.length;

  while (++index < length) {
    var array = arguments[index];
    if (isArray(array) || isArguments(array)) {
      var result = result
        ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
        : array;
    }
  }
  return result || [];
}

module.exports = xor;

},{"../internals/baseDifference":84,"../internals/baseUniq":90,"../objects/isArguments":136,"../objects/isArray":137}],25:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var max = _dereq_('../collections/max'),
    pluck = _dereq_('../collections/pluck');

/**
 * Creates an array of grouped elements, the first of which contains the first
 * elements of the given arrays, the second of which contains the second
 * elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @alias unzip
 * @category Arrays
 * @param {...Array} [array] Arrays to process.
 * @returns {Array} Returns a new array of grouped elements.
 * @example
 *
 * _.zip(['fred', 'barney'], [30, 40], [true, false]);
 * // => [['fred', 30, true], ['barney', 40, false]]
 */
function zip() {
  var array = arguments.length > 1 ? arguments : arguments[0],
      index = -1,
      length = array ? max(pluck(array, 'length')) : 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = pluck(array, index);
  }
  return result;
}

module.exports = zip;

},{"../collections/max":47,"../collections/pluck":49}],26:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArray = _dereq_('../objects/isArray');

/**
 * Creates an object composed from arrays of `keys` and `values`. Provide
 * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
 * or two arrays, one of `keys` and one of corresponding `values`.
 *
 * @static
 * @memberOf _
 * @alias object
 * @category Arrays
 * @param {Array} keys The array of keys.
 * @param {Array} [values=[]] The array of values.
 * @returns {Object} Returns an object composed of the given keys and
 *  corresponding values.
 * @example
 *
 * _.zipObject(['fred', 'barney'], [30, 40]);
 * // => { 'fred': 30, 'barney': 40 }
 */
function zipObject(keys, values) {
  var index = -1,
      length = keys ? keys.length : 0,
      result = {};

  if (!values && length && !isArray(keys[0])) {
    values = [];
  }
  while (++index < length) {
    var key = keys[index];
    if (values) {
      result[key] = values[index];
    } else if (key) {
      result[key[0]] = key[1];
    }
  }
  return result;
}

module.exports = zipObject;

},{"../objects/isArray":137}],27:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'chain': _dereq_('./chaining/chain'),
  'tap': _dereq_('./chaining/tap'),
  'value': _dereq_('./chaining/wrapperValueOf'),
  'wrapperChain': _dereq_('./chaining/wrapperChain'),
  'wrapperToString': _dereq_('./chaining/wrapperToString'),
  'wrapperValueOf': _dereq_('./chaining/wrapperValueOf')
};

},{"./chaining/chain":28,"./chaining/tap":29,"./chaining/wrapperChain":30,"./chaining/wrapperToString":31,"./chaining/wrapperValueOf":32}],28:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var lodashWrapper = _dereq_('../internals/lodashWrapper');

/**
 * Creates a `lodash` object that wraps the given value with explicit
 * method chaining enabled.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to wrap.
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'pebbles', 'age': 1 }
 * ];
 *
 * var youngest = _.chain(characters)
 *     .sortBy('age')
 *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
 *     .first()
 *     .value();
 * // => 'pebbles is 1'
 */
function chain(value) {
  value = new lodashWrapper(value);
  value.__chain__ = true;
  return value;
}

module.exports = chain;

},{"../internals/lodashWrapper":107}],29:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Invokes `interceptor` with the `value` as the first argument and then
 * returns `value`. The purpose of this method is to "tap into" a method
 * chain in order to perform operations on intermediate results within
 * the chain.
 *
 * @static
 * @memberOf _
 * @category Chaining
 * @param {*} value The value to provide to `interceptor`.
 * @param {Function} interceptor The function to invoke.
 * @returns {*} Returns `value`.
 * @example
 *
 * _([1, 2, 3, 4])
 *  .tap(function(array) { array.pop(); })
 *  .reverse()
 *  .value();
 * // => [3, 2, 1]
 */
function tap(value, interceptor) {
  interceptor(value);
  return value;
}

module.exports = tap;

},{}],30:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Enables explicit method chaining on the wrapper object.
 *
 * @name chain
 * @memberOf _
 * @category Chaining
 * @returns {*} Returns the wrapper object.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // without explicit chaining
 * _(characters).first();
 * // => { 'name': 'barney', 'age': 36 }
 *
 * // with explicit chaining
 * _(characters).chain()
 *   .first()
 *   .pick('age')
 *   .value();
 * // => { 'age': 36 }
 */
function wrapperChain() {
  this.__chain__ = true;
  return this;
}

module.exports = wrapperChain;

},{}],31:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Produces the `toString` result of the wrapped value.
 *
 * @name toString
 * @memberOf _
 * @category Chaining
 * @returns {string} Returns the string result.
 * @example
 *
 * _([1, 2, 3]).toString();
 * // => '1,2,3'
 */
function wrapperToString() {
  return String(this.__wrapped__);
}

module.exports = wrapperToString;

},{}],32:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    support = _dereq_('../support');

/**
 * Extracts the wrapped value.
 *
 * @name valueOf
 * @memberOf _
 * @alias value
 * @category Chaining
 * @returns {*} Returns the wrapped value.
 * @example
 *
 * _([1, 2, 3]).valueOf();
 * // => [1, 2, 3]
 */
function wrapperValueOf() {
  return this.__wrapped__;
}

module.exports = wrapperValueOf;

},{"../collections/forEach":41,"../support":161}],33:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'all': _dereq_('./collections/every'),
  'any': _dereq_('./collections/some'),
  'at': _dereq_('./collections/at'),
  'collect': _dereq_('./collections/map'),
  'contains': _dereq_('./collections/contains'),
  'countBy': _dereq_('./collections/countBy'),
  'detect': _dereq_('./collections/find'),
  'each': _dereq_('./collections/forEach'),
  'eachRight': _dereq_('./collections/forEachRight'),
  'every': _dereq_('./collections/every'),
  'filter': _dereq_('./collections/filter'),
  'find': _dereq_('./collections/find'),
  'findLast': _dereq_('./collections/findLast'),
  'findWhere': _dereq_('./collections/find'),
  'foldl': _dereq_('./collections/reduce'),
  'foldr': _dereq_('./collections/reduceRight'),
  'forEach': _dereq_('./collections/forEach'),
  'forEachRight': _dereq_('./collections/forEachRight'),
  'groupBy': _dereq_('./collections/groupBy'),
  'include': _dereq_('./collections/contains'),
  'indexBy': _dereq_('./collections/indexBy'),
  'inject': _dereq_('./collections/reduce'),
  'invoke': _dereq_('./collections/invoke'),
  'map': _dereq_('./collections/map'),
  'max': _dereq_('./collections/max'),
  'min': _dereq_('./collections/min'),
  'pluck': _dereq_('./collections/pluck'),
  'reduce': _dereq_('./collections/reduce'),
  'reduceRight': _dereq_('./collections/reduceRight'),
  'reject': _dereq_('./collections/reject'),
  'sample': _dereq_('./collections/sample'),
  'select': _dereq_('./collections/filter'),
  'shuffle': _dereq_('./collections/shuffle'),
  'size': _dereq_('./collections/size'),
  'some': _dereq_('./collections/some'),
  'sortBy': _dereq_('./collections/sortBy'),
  'toArray': _dereq_('./collections/toArray'),
  'where': _dereq_('./collections/where')
};

},{"./collections/at":34,"./collections/contains":35,"./collections/countBy":36,"./collections/every":37,"./collections/filter":38,"./collections/find":39,"./collections/findLast":40,"./collections/forEach":41,"./collections/forEachRight":42,"./collections/groupBy":43,"./collections/indexBy":44,"./collections/invoke":45,"./collections/map":46,"./collections/max":47,"./collections/min":48,"./collections/pluck":49,"./collections/reduce":50,"./collections/reduceRight":51,"./collections/reject":52,"./collections/sample":53,"./collections/shuffle":54,"./collections/size":55,"./collections/some":56,"./collections/sortBy":57,"./collections/toArray":58,"./collections/where":59}],34:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    isString = _dereq_('../objects/isString');

/**
 * Creates an array of elements from the specified indexes, or keys, of the
 * `collection`. Indexes may be specified as individual arguments or as arrays
 * of indexes.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
 *   to retrieve, specified as individual indexes or arrays of indexes.
 * @returns {Array} Returns a new array of elements corresponding to the
 *  provided indexes.
 * @example
 *
 * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
 * // => ['a', 'c', 'e']
 *
 * _.at(['fred', 'barney', 'pebbles'], 0, 2);
 * // => ['fred', 'pebbles']
 */
function at(collection) {
  var args = arguments,
      index = -1,
      props = baseFlatten(args, true, false, 1),
      length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
      result = Array(length);

  while(++index < length) {
    result[index] = collection[props[index]];
  }
  return result;
}

module.exports = at;

},{"../internals/baseFlatten":85,"../objects/isString":151}],35:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('../internals/baseIndexOf'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Checks if a given value is present in a collection using strict equality
 * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
 * offset from the end of the collection.
 *
 * @static
 * @memberOf _
 * @alias include
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {*} target The value to check for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
 * @example
 *
 * _.contains([1, 2, 3], 1);
 * // => true
 *
 * _.contains([1, 2, 3], 1, 2);
 * // => false
 *
 * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
 * // => true
 *
 * _.contains('pebbles', 'eb');
 * // => true
 */
function contains(collection, target, fromIndex) {
  var index = -1,
      indexOf = baseIndexOf,
      length = collection ? collection.length : 0,
      result = false;

  fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
  if (isArray(collection)) {
    result = indexOf(collection, target, fromIndex) > -1;
  } else if (typeof length == 'number') {
    result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
  } else {
    forOwn(collection, function(value) {
      if (++index >= fromIndex) {
        return !(result = value === target);
      }
    });
  }
  return result;
}

module.exports = contains;

},{"../internals/baseIndexOf":86,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isString":151}],36:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` through the callback. The corresponding value
 * of each key is the number of times the key was returned by the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': 1, '6': 2 }
 *
 * _.countBy(['one', 'two', 'three'], 'length');
 * // => { '3': 2, '5': 1 }
 */
var countBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
});

module.exports = countBy;

},{"../internals/createAggregator":95}],37:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Checks if the given callback returns truey value for **all** elements of
 * a collection. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias all
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if all elements passed the callback check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes']);
 * // => false
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.every(characters, 'age');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.every(characters, { 'age': 36 });
 * // => false
 */
function every(collection, callback, thisArg) {
  var result = true;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if (!(result = !!callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return (result = !!callback(value, index, collection));
    });
  }
  return result;
}

module.exports = every;

},{"../functions/createCallback":66,"../objects/forOwn":131}],38:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning an array of all elements
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that passed the callback check.
 * @example
 *
 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [2, 4, 6]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.filter(characters, 'blocked');
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 *
 * // using "_.where" callback shorthand
 * _.filter(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 */
function filter(collection, callback, thisArg) {
  var result = [];
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        result.push(value);
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result.push(value);
      }
    });
  }
  return result;
}

module.exports = filter;

},{"../functions/createCallback":66,"../objects/forOwn":131}],39:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, returning the first element that
 * the callback returns truey for. The callback is bound to `thisArg` and
 * invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect, findWhere
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36, 'blocked': false },
 *   { 'name': 'fred',    'age': 40, 'blocked': true },
 *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
 * ];
 *
 * _.find(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => { 'name': 'barney', 'age': 36, 'blocked': false }
 *
 * // using "_.where" callback shorthand
 * _.find(characters, { 'age': 1 });
 * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
 *
 * // using "_.pluck" callback shorthand
 * _.find(characters, 'blocked');
 * // => { 'name': 'fred', 'age': 40, 'blocked': true }
 */
function find(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      var value = collection[index];
      if (callback(value, index, collection)) {
        return value;
      }
    }
  } else {
    var result;
    forOwn(collection, function(value, index, collection) {
      if (callback(value, index, collection)) {
        result = value;
        return false;
      }
    });
    return result;
  }
}

module.exports = find;

},{"../functions/createCallback":66,"../objects/forOwn":131}],40:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forEachRight = _dereq_('./forEachRight');

/**
 * This method is like `_.find` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the found element, else `undefined`.
 * @example
 *
 * _.findLast([1, 2, 3, 4], function(num) {
 *   return num % 2 == 1;
 * });
 * // => 3
 */
function findLast(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forEachRight(collection, function(value, index, collection) {
    if (callback(value, index, collection)) {
      result = value;
      return false;
    }
  });
  return result;
}

module.exports = findLast;

},{"../functions/createCallback":66,"./forEachRight":42}],41:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Iterates over elements of a collection, executing the callback for each
 * element. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * Note: As with other "Collections" methods, objects with a `length` property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
 * // => logs each number and returns '1,2,3'
 *
 * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
 * // => logs each number and returns the object (property order is not guaranteed across environments)
 */
function forEach(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (++index < length) {
      if (callback(collection[index], index, collection) === false) {
        break;
      }
    }
  } else {
    forOwn(collection, callback);
  }
  return collection;
}

module.exports = forEach;

},{"../internals/baseCreateCallback":82,"../objects/forOwn":131}],42:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString'),
    keys = _dereq_('../objects/keys');

/**
 * This method is like `_.forEach` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias eachRight
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
 * // => logs each number from right to left and returns '3,2,1'
 */
function forEachRight(collection, callback, thisArg) {
  var length = collection ? collection.length : 0;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    while (length--) {
      if (callback(collection[length], length, collection) === false) {
        break;
      }
    }
  } else {
    var props = keys(collection);
    length = props.length;
    forOwn(collection, function(value, key, collection) {
      key = props ? props[--length] : --length;
      return callback(collection[key], key, collection);
    });
  }
  return collection;
}

module.exports = forEachRight;

},{"../internals/baseCreateCallback":82,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isString":151,"../objects/keys":153}],43:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of a collection through the callback. The corresponding value
 * of each key is an array of the elements responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
 * // => { '4': [4.2], '6': [6.1, 6.4] }
 *
 * // using "_.pluck" callback shorthand
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
});

module.exports = groupBy;

},{"../internals/createAggregator":95}],44:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createAggregator = _dereq_('../internals/createAggregator');

/**
 * Creates an object composed of keys generated from the results of running
 * each element of the collection through the given callback. The corresponding
 * value of each key is the last element responsible for generating the key.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var keys = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.indexBy(keys, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 */
var indexBy = createAggregator(function(result, value, key) {
  result[key] = value;
});

module.exports = indexBy;

},{"../internals/createAggregator":95}],45:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('./forEach'),
    slice = _dereq_('../internals/slice');

/**
 * Invokes the method named by `methodName` on each element in the `collection`
 * returning an array of the results of each invoked method. Additional arguments
 * will be provided to each invoked method. If `methodName` is a function it
 * will be invoked for, and `this` bound to, each element in the `collection`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|string} methodName The name of the method to invoke or
 *  the function invoked per iteration.
 * @param {...*} [arg] Arguments to invoke the method with.
 * @returns {Array} Returns a new array of the results of each invoked method.
 * @example
 *
 * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
 * // => [[1, 5, 7], [1, 2, 3]]
 *
 * _.invoke([123, 456], String.prototype.split, '');
 * // => [['1', '2', '3'], ['4', '5', '6']]
 */
function invoke(collection, methodName) {
  var args = slice(arguments, 2),
      index = -1,
      isFunc = typeof methodName == 'function',
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
  });
  return result;
}

module.exports = invoke;

},{"../internals/slice":119,"./forEach":41}],46:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Creates an array of values by running each element in the collection
 * through the callback. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of the results of each `callback` execution.
 * @example
 *
 * _.map([1, 2, 3], function(num) { return num * 3; });
 * // => [3, 6, 9]
 *
 * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
 * // => [3, 6, 9] (property order is not guaranteed across environments)
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(characters, 'name');
 * // => ['barney', 'fred']
 */
function map(collection, callback, thisArg) {
  var index = -1,
      length = collection ? collection.length : 0;

  callback = createCallback(callback, thisArg, 3);
  if (typeof length == 'number') {
    var result = Array(length);
    while (++index < length) {
      result[index] = callback(collection[index], index, collection);
    }
  } else {
    result = [];
    forOwn(collection, function(value, key, collection) {
      result[++index] = callback(value, key, collection);
    });
  }
  return result;
}

module.exports = map;

},{"../functions/createCallback":66,"../objects/forOwn":131}],47:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = _dereq_('../internals/charAtCallback'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/**
 * Retrieves the maximum value of a collection. If the collection is empty or
 * falsey `-Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the maximum value.
 * @example
 *
 * _.max([4, 2, 8, 6]);
 * // => 8
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.max(characters, function(chr) { return chr.age; });
 * // => { 'name': 'fred', 'age': 40 };
 *
 * // using "_.pluck" callback shorthand
 * _.max(characters, 'age');
 * // => { 'name': 'fred', 'age': 40 };
 */
function max(collection, callback, thisArg) {
  var computed = -Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value > result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current > computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = max;

},{"../functions/createCallback":66,"../internals/charAtCallback":93,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isString":151,"./forEach":41}],48:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var charAtCallback = _dereq_('../internals/charAtCallback'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isString = _dereq_('../objects/isString');

/**
 * Retrieves the minimum value of a collection. If the collection is empty or
 * falsey `Infinity` is returned. If a callback is provided it will be executed
 * for each value in the collection to generate the criterion by which the value
 * is ranked. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the minimum value.
 * @example
 *
 * _.min([4, 2, 8, 6]);
 * // => 2
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.min(characters, function(chr) { return chr.age; });
 * // => { 'name': 'barney', 'age': 36 };
 *
 * // using "_.pluck" callback shorthand
 * _.min(characters, 'age');
 * // => { 'name': 'barney', 'age': 36 };
 */
function min(collection, callback, thisArg) {
  var computed = Infinity,
      result = computed;

  // allows working with functions like `_.map` without using
  // their `index` argument as a callback
  if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
    callback = null;
  }
  if (callback == null && isArray(collection)) {
    var index = -1,
        length = collection.length;

    while (++index < length) {
      var value = collection[index];
      if (value < result) {
        result = value;
      }
    }
  } else {
    callback = (callback == null && isString(collection))
      ? charAtCallback
      : createCallback(callback, thisArg, 3);

    forEach(collection, function(value, index, collection) {
      var current = callback(value, index, collection);
      if (current < computed) {
        computed = current;
        result = value;
      }
    });
  }
  return result;
}

module.exports = min;

},{"../functions/createCallback":66,"../internals/charAtCallback":93,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isString":151,"./forEach":41}],49:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var map = _dereq_('./map');

/**
 * Retrieves the value of a specified property from all elements in the collection.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {string} property The name of the property to pluck.
 * @returns {Array} Returns a new array of property values.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * _.pluck(characters, 'name');
 * // => ['barney', 'fred']
 */
var pluck = map;

module.exports = pluck;

},{"./map":46}],50:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn');

/**
 * Reduces a collection to a value which is the accumulated result of running
 * each element in the collection through the callback, where each successive
 * callback execution consumes the return value of the previous execution. If
 * `accumulator` is not provided the first element of the collection will be
 * used as the initial `accumulator` value. The callback is bound to `thisArg`
 * and invoked with four arguments; (accumulator, value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var sum = _.reduce([1, 2, 3], function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function reduce(collection, callback, accumulator, thisArg) {
  if (!collection) return accumulator;
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);

  var index = -1,
      length = collection.length;

  if (typeof length == 'number') {
    if (noaccum) {
      accumulator = collection[++index];
    }
    while (++index < length) {
      accumulator = callback(accumulator, collection[index], index, collection);
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      accumulator = noaccum
        ? (noaccum = false, value)
        : callback(accumulator, value, index, collection)
    });
  }
  return accumulator;
}

module.exports = reduce;

},{"../functions/createCallback":66,"../objects/forOwn":131}],51:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forEachRight = _dereq_('./forEachRight');

/**
 * This method is like `_.reduce` except that it iterates over elements
 * of a `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @alias foldr
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] Initial value of the accumulator.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var list = [[0, 1], [2, 3], [4, 5]];
 * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
 * // => [4, 5, 2, 3, 0, 1]
 */
function reduceRight(collection, callback, accumulator, thisArg) {
  var noaccum = arguments.length < 3;
  callback = createCallback(callback, thisArg, 4);
  forEachRight(collection, function(value, index, collection) {
    accumulator = noaccum
      ? (noaccum = false, value)
      : callback(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = reduceRight;

},{"../functions/createCallback":66,"./forEachRight":42}],52:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    filter = _dereq_('./filter');

/**
 * The opposite of `_.filter` this method returns the elements of a
 * collection that the callback does **not** return truey for.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of elements that failed the callback check.
 * @example
 *
 * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
 * // => [1, 3, 5]
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.reject(characters, 'blocked');
 * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
 *
 * // using "_.where" callback shorthand
 * _.reject(characters, { 'age': 36 });
 * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
 */
function reject(collection, callback, thisArg) {
  callback = createCallback(callback, thisArg, 3);
  return filter(collection, function(value, index, collection) {
    return !callback(value, index, collection);
  });
}

module.exports = reject;

},{"../functions/createCallback":66,"./filter":38}],53:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom'),
    isString = _dereq_('../objects/isString'),
    shuffle = _dereq_('./shuffle'),
    values = _dereq_('../objects/values');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Retrieves a random element or `n` random elements from a collection.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to sample.
 * @param {number} [n] The number of elements to sample.
 * @param- {Object} [guard] Allows working with functions like `_.map`
 *  without using their `index` arguments as `n`.
 * @returns {Array} Returns the random sample(s) of `collection`.
 * @example
 *
 * _.sample([1, 2, 3, 4]);
 * // => 2
 *
 * _.sample([1, 2, 3, 4], 2);
 * // => [3, 1]
 */
function sample(collection, n, guard) {
  if (collection && typeof collection.length != 'number') {
    collection = values(collection);
  }
  if (n == null || guard) {
    return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
  }
  var result = shuffle(collection);
  result.length = nativeMin(nativeMax(0, n), result.length);
  return result;
}

module.exports = sample;

},{"../internals/baseRandom":89,"../objects/isString":151,"../objects/values":160,"./shuffle":54}],54:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom'),
    forEach = _dereq_('./forEach');

/**
 * Creates an array of shuffled values, using a version of the Fisher-Yates
 * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to shuffle.
 * @returns {Array} Returns a new shuffled collection.
 * @example
 *
 * _.shuffle([1, 2, 3, 4, 5, 6]);
 * // => [4, 1, 6, 3, 5, 2]
 */
function shuffle(collection) {
  var index = -1,
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  forEach(collection, function(value) {
    var rand = baseRandom(0, ++index);
    result[index] = result[rand];
    result[rand] = value;
  });
  return result;
}

module.exports = shuffle;

},{"../internals/baseRandom":89,"./forEach":41}],55:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('../objects/keys');

/**
 * Gets the size of the `collection` by returning `collection.length` for arrays
 * and array-like objects or the number of own enumerable properties for objects.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns `collection.length` or number of own enumerable properties.
 * @example
 *
 * _.size([1, 2]);
 * // => 2
 *
 * _.size({ 'one': 1, 'two': 2, 'three': 3 });
 * // => 3
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  var length = collection ? collection.length : 0;
  return typeof length == 'number' ? length : keys(collection).length;
}

module.exports = size;

},{"../objects/keys":153}],56:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray');

/**
 * Checks if the callback returns a truey value for **any** element of a
 * collection. The function returns as soon as it finds a passing value and
 * does not iterate over the entire collection. The callback is bound to
 * `thisArg` and invoked with three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias any
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if any element passed the callback check,
 *  else `false`.
 * @example
 *
 * _.some([null, 0, 'yes', false], Boolean);
 * // => true
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'blocked': false },
 *   { 'name': 'fred',   'age': 40, 'blocked': true }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.some(characters, 'blocked');
 * // => true
 *
 * // using "_.where" callback shorthand
 * _.some(characters, { 'age': 1 });
 * // => false
 */
function some(collection, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);

  var index = -1,
      length = collection ? collection.length : 0;

  if (typeof length == 'number') {
    while (++index < length) {
      if ((result = callback(collection[index], index, collection))) {
        break;
      }
    }
  } else {
    forOwn(collection, function(value, index, collection) {
      return !(result = callback(value, index, collection));
    });
  }
  return !!result;
}

module.exports = some;

},{"../functions/createCallback":66,"../objects/forOwn":131,"../objects/isArray":137}],57:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var compareAscending = _dereq_('../internals/compareAscending'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('./forEach'),
    getArray = _dereq_('../internals/getArray'),
    getObject = _dereq_('../internals/getObject'),
    isArray = _dereq_('../objects/isArray'),
    map = _dereq_('./map'),
    releaseArray = _dereq_('../internals/releaseArray'),
    releaseObject = _dereq_('../internals/releaseObject');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection through the callback. This method
 * performs a stable sort, that is, it will preserve the original sort order
 * of equal elements. The callback is bound to `thisArg` and invoked with
 * three arguments; (value, index|key, collection).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an array of property names is provided for `callback` the collection
 * will be sorted by each property value.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new array of sorted elements.
 * @example
 *
 * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
 * // => [3, 1, 2]
 *
 * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
 * // => [3, 1, 2]
 *
 * var characters = [
 *   { 'name': 'barney',  'age': 36 },
 *   { 'name': 'fred',    'age': 40 },
 *   { 'name': 'barney',  'age': 26 },
 *   { 'name': 'fred',    'age': 30 }
 * ];
 *
 * // using "_.pluck" callback shorthand
 * _.map(_.sortBy(characters, 'age'), _.values);
 * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
 *
 * // sorting by multiple properties
 * _.map(_.sortBy(characters, ['name', 'age']), _.values);
 * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
 */
function sortBy(collection, callback, thisArg) {
  var index = -1,
      isArr = isArray(callback),
      length = collection ? collection.length : 0,
      result = Array(typeof length == 'number' ? length : 0);

  if (!isArr) {
    callback = createCallback(callback, thisArg, 3);
  }
  forEach(collection, function(value, key, collection) {
    var object = result[++index] = getObject();
    if (isArr) {
      object.criteria = map(callback, function(key) { return value[key]; });
    } else {
      (object.criteria = getArray())[0] = callback(value, key, collection);
    }
    object.index = index;
    object.value = value;
  });

  length = result.length;
  result.sort(compareAscending);
  while (length--) {
    var object = result[length];
    result[length] = object.value;
    if (!isArr) {
      releaseArray(object.criteria);
    }
    releaseObject(object);
  }
  return result;
}

module.exports = sortBy;

},{"../functions/createCallback":66,"../internals/compareAscending":94,"../internals/getArray":100,"../internals/getObject":101,"../internals/releaseArray":114,"../internals/releaseObject":115,"../objects/isArray":137,"./forEach":41,"./map":46}],58:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = _dereq_('../objects/isString'),
    slice = _dereq_('../internals/slice'),
    values = _dereq_('../objects/values');

/**
 * Converts the `collection` to an array.
 *
 * @static
 * @memberOf _
 * @category Collections
 * @param {Array|Object|string} collection The collection to convert.
 * @returns {Array} Returns the new converted array.
 * @example
 *
 * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
 * // => [2, 3, 4]
 */
function toArray(collection) {
  if (collection && typeof collection.length == 'number') {
    return slice(collection);
  }
  return values(collection);
}

module.exports = toArray;

},{"../internals/slice":119,"../objects/isString":151,"../objects/values":160}],59:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var filter = _dereq_('./filter');

/**
 * Performs a deep comparison of each element in a `collection` to the given
 * `properties` object, returning an array of all elements that have equivalent
 * property values.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Collections
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Object} props The object of property values to filter by.
 * @returns {Array} Returns a new array of elements that have the given properties.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
 *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
 * ];
 *
 * _.where(characters, { 'age': 36 });
 * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
 *
 * _.where(characters, { 'pets': ['dino'] });
 * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
 */
var where = filter;

module.exports = where;

},{"./filter":38}],60:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'after': _dereq_('./functions/after'),
  'bind': _dereq_('./functions/bind'),
  'bindAll': _dereq_('./functions/bindAll'),
  'bindKey': _dereq_('./functions/bindKey'),
  'compose': _dereq_('./functions/compose'),
  'createCallback': _dereq_('./functions/createCallback'),
  'curry': _dereq_('./functions/curry'),
  'debounce': _dereq_('./functions/debounce'),
  'defer': _dereq_('./functions/defer'),
  'delay': _dereq_('./functions/delay'),
  'memoize': _dereq_('./functions/memoize'),
  'once': _dereq_('./functions/once'),
  'partial': _dereq_('./functions/partial'),
  'partialRight': _dereq_('./functions/partialRight'),
  'throttle': _dereq_('./functions/throttle'),
  'wrap': _dereq_('./functions/wrap')
};

},{"./functions/after":61,"./functions/bind":62,"./functions/bindAll":63,"./functions/bindKey":64,"./functions/compose":65,"./functions/createCallback":66,"./functions/curry":67,"./functions/debounce":68,"./functions/defer":69,"./functions/delay":70,"./functions/memoize":71,"./functions/once":72,"./functions/partial":73,"./functions/partialRight":74,"./functions/throttle":75,"./functions/wrap":76}],61:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that executes `func`, with  the `this` binding and
 * arguments of the created function, only after being called `n` times.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {number} n The number of times the function must be called before
 *  `func` is executed.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var saves = ['profile', 'settings'];
 *
 * var done = _.after(saves.length, function() {
 *   console.log('Done saving!');
 * });
 *
 * _.forEach(saves, function(type) {
 *   asyncSave({ 'type': type, 'complete': done });
 * });
 * // => logs 'Done saving!', after all saves have completed
 */
function after(n, func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}

module.exports = after;

},{"../objects/isFunction":144}],62:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;

},{"../internals/createWrapper":97,"../internals/slice":119}],63:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    createWrapper = _dereq_('../internals/createWrapper'),
    functions = _dereq_('../objects/functions');

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method. Method names may be specified as individual arguments or as arrays
 * of method names. If no method names are provided all the function properties
 * of `object` will be bound.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...string} [methodName] The object method names to
 *  bind, specified as individual method names or arrays of method names.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'onClick': function() { console.log('clicked ' + this.label); }
 * };
 *
 * _.bindAll(view);
 * jQuery('#docs').on('click', view.onClick);
 * // => logs 'clicked docs', when the button is clicked
 */
function bindAll(object) {
  var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
      index = -1,
      length = funcs.length;

  while (++index < length) {
    var key = funcs[index];
    object[key] = createWrapper(object[key], 1, null, null, object);
  }
  return object;
}

module.exports = bindAll;

},{"../internals/baseFlatten":85,"../internals/createWrapper":97,"../objects/functions":133}],64:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes the method at `object[key]`
 * and prepends any additional `bindKey` arguments to those provided to the bound
 * function. This method differs from `_.bind` by allowing bound functions to
 * reference methods that will be redefined or don't yet exist.
 * See http://michaux.ca/articles/lazy-function-definition-pattern.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Object} object The object the method belongs to.
 * @param {string} key The key of the method.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var object = {
 *   'name': 'fred',
 *   'greet': function(greeting) {
 *     return greeting + ' ' + this.name;
 *   }
 * };
 *
 * var func = _.bindKey(object, 'greet', 'hi');
 * func();
 * // => 'hi fred'
 *
 * object.greet = function(greeting) {
 *   return greeting + 'ya ' + this.name + '!';
 * };
 *
 * func();
 * // => 'hiya fred!'
 */
function bindKey(object, key) {
  return arguments.length > 2
    ? createWrapper(key, 19, slice(arguments, 2), null, object)
    : createWrapper(key, 3, null, null, object);
}

module.exports = bindKey;

},{"../internals/createWrapper":97,"../internals/slice":119}],65:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that is the composition of the provided functions,
 * where each function consumes the return value of the function that follows.
 * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
 * Each function is executed with the `this` binding of the composed function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {...Function} [func] Functions to compose.
 * @returns {Function} Returns the new composed function.
 * @example
 *
 * var realNameMap = {
 *   'pebbles': 'penelope'
 * };
 *
 * var format = function(name) {
 *   name = realNameMap[name.toLowerCase()] || name;
 *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
 * };
 *
 * var greet = function(formatted) {
 *   return 'Hiya ' + formatted + '!';
 * };
 *
 * var welcome = _.compose(greet, format);
 * welcome('pebbles');
 * // => 'Hiya Penelope!'
 */
function compose() {
  var funcs = arguments,
      length = funcs.length;

  while (length--) {
    if (!isFunction(funcs[length])) {
      throw new TypeError;
    }
  }
  return function() {
    var args = arguments,
        length = funcs.length;

    while (length--) {
      args = [funcs[length].apply(this, args)];
    }
    return args[0];
  };
}

module.exports = compose;

},{"../objects/isFunction":144}],66:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseIsEqual = _dereq_('../internals/baseIsEqual'),
    isObject = _dereq_('../objects/isObject'),
    keys = _dereq_('../objects/keys'),
    property = _dereq_('../utilities/property');

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;

},{"../internals/baseCreateCallback":82,"../internals/baseIsEqual":87,"../objects/isObject":148,"../objects/keys":153,"../utilities/property":171}],67:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper');

/**
 * Creates a function which accepts one or more arguments of `func` that when
 * invoked either executes `func` returning its result, if all `func` arguments
 * have been provided, or returns a function that accepts one or more of the
 * remaining `func` arguments, and so on. The arity of `func` can be specified
 * if `func.length` is not sufficient.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var curried = _.curry(function(a, b, c) {
 *   console.log(a + b + c);
 * });
 *
 * curried(1)(2)(3);
 * // => 6
 *
 * curried(1, 2)(3);
 * // => 6
 *
 * curried(1, 2, 3);
 * // => 6
 */
function curry(func, arity) {
  arity = typeof arity == 'number' ? arity : (+arity || func.length);
  return createWrapper(func, 4, null, null, null, arity);
}

module.exports = curry;

},{"../internals/createWrapper":97}],68:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject'),
    now = _dereq_('../utilities/now');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates a function that will delay the execution of `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * Provide an options object to indicate that `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
 * to the debounced function will return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * var lazyLayout = _.debounce(calculateLayout, 150);
 * jQuery(window).on('resize', lazyLayout);
 *
 * // execute `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * });
 *
 * // ensure `batchLog` is executed once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * source.addEventListener('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }, false);
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  wait = nativeMax(0, wait) || 0;
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = options.leading;
    maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  var delayed = function() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0) {
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      var isCalled = trailingCall;
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
      }
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  };

  var maxDelayed = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (trailing || (maxWait !== wait)) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = null;
      }
    }
  };

  return function() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = null;
    }
    return result;
  };
}

module.exports = debounce;

},{"../objects/isFunction":144,"../objects/isObject":148,"../utilities/now":169}],69:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('../internals/slice');

/**
 * Defers executing the `func` function until the current call stack has cleared.
 * Additional arguments will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to defer.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.defer(function(text) { console.log(text); }, 'deferred');
 * // logs 'deferred' after one or more milliseconds
 */
function defer(func) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 1);
  return setTimeout(function() { func.apply(undefined, args); }, 1);
}

module.exports = defer;

},{"../internals/slice":119,"../objects/isFunction":144}],70:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('../internals/slice');

/**
 * Executes the `func` function after `wait` milliseconds. Additional arguments
 * will be provided to `func` when it is invoked.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to delay.
 * @param {number} wait The number of milliseconds to delay execution.
 * @param {...*} [arg] Arguments to invoke the function with.
 * @returns {number} Returns the timer id.
 * @example
 *
 * _.delay(function(text) { console.log(text); }, 1000, 'later');
 * // => logs 'later' after one second
 */
function delay(func, wait) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var args = slice(arguments, 2);
  return setTimeout(function() { func.apply(undefined, args); }, wait);
}

module.exports = delay;

},{"../internals/slice":119,"../objects/isFunction":144}],71:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction'),
    keyPrefix = _dereq_('../internals/keyPrefix');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided it will be used to determine the cache key for storing the result
 * based on the arguments provided to the memoized function. By default, the
 * first argument provided to the memoized function is used as the cache key.
 * The `func` is executed with the `this` binding of the memoized function.
 * The result cache is exposed as the `cache` property on the memoized function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] A function used to resolve the cache key.
 * @returns {Function} Returns the new memoizing function.
 * @example
 *
 * var fibonacci = _.memoize(function(n) {
 *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 * });
 *
 * fibonacci(9)
 * // => 34
 *
 * var data = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // modifying the result cache
 * var get = _.memoize(function(name) { return data[name]; }, _.identity);
 * get('pebbles');
 * // => { 'name': 'pebbles', 'age': 1 }
 *
 * get.cache.pebbles.name = 'penelope';
 * get('pebbles');
 * // => { 'name': 'penelope', 'age': 1 }
 */
function memoize(func, resolver) {
  if (!isFunction(func)) {
    throw new TypeError;
  }
  var memoized = function() {
    var cache = memoized.cache,
        key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

    return hasOwnProperty.call(cache, key)
      ? cache[key]
      : (cache[key] = func.apply(this, arguments));
  }
  memoized.cache = {};
  return memoized;
}

module.exports = memoize;

},{"../internals/keyPrefix":105,"../objects/isFunction":144}],72:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Creates a function that is restricted to execute `func` once. Repeat calls to
 * the function will return the value of the first call. The `func` is executed
 * with the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // `initialize` executes `createApplication` once
 */
function once(func) {
  var ran,
      result;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  return function() {
    if (ran) {
      return result;
    }
    ran = true;
    result = func.apply(this, arguments);

    // clear the `func` variable so the function may be garbage collected
    func = null;
    return result;
  };
}

module.exports = once;

},{"../objects/isFunction":144}],73:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * Creates a function that, when called, invokes `func` with any additional
 * `partial` arguments prepended to those provided to the new function. This
 * method is similar to `_.bind` except it does **not** alter the `this` binding.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var greet = function(greeting, name) { return greeting + ' ' + name; };
 * var hi = _.partial(greet, 'hi');
 * hi('fred');
 * // => 'hi fred'
 */
function partial(func) {
  return createWrapper(func, 16, slice(arguments, 1));
}

module.exports = partial;

},{"../internals/createWrapper":97,"../internals/slice":119}],74:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper'),
    slice = _dereq_('../internals/slice');

/**
 * This method is like `_.partial` except that `partial` arguments are
 * appended to those provided to the new function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * var defaultsDeep = _.partialRight(_.merge, _.defaults);
 *
 * var options = {
 *   'variable': 'data',
 *   'imports': { 'jq': $ }
 * };
 *
 * defaultsDeep(options, _.templateSettings);
 *
 * options.variable
 * // => 'data'
 *
 * options.imports
 * // => { '_': _, 'jq': $ }
 */
function partialRight(func) {
  return createWrapper(func, 32, null, slice(arguments, 1));
}

module.exports = partialRight;

},{"../internals/createWrapper":97,"../internals/slice":119}],75:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var debounce = _dereq_('./debounce'),
    isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject');

/** Used as an internal `_.debounce` options object */
var debounceOptions = {
  'leading': false,
  'maxWait': 0,
  'trailing': false
};

/**
 * Creates a function that, when executed, will only call the `func` function
 * at most once per every `wait` milliseconds. Provide an options object to
 * indicate that `func` should be invoked on the leading and/or trailing edge
 * of the `wait` timeout. Subsequent calls to the throttled function will
 * return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to throttle.
 * @param {number} wait The number of milliseconds to throttle executions to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * var throttled = _.throttle(updatePosition, 100);
 * jQuery(window).on('scroll', throttled);
 *
 * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? options.leading : leading;
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  debounceOptions.leading = leading;
  debounceOptions.maxWait = wait;
  debounceOptions.trailing = trailing;

  return debounce(func, wait, debounceOptions);
}

module.exports = throttle;

},{"../objects/isFunction":144,"../objects/isObject":148,"./debounce":68}],76:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('../internals/createWrapper');

/**
 * Creates a function that provides `value` to the wrapper function as its
 * first argument. Additional arguments provided to the function are appended
 * to those provided to the wrapper function. The wrapper is executed with
 * the `this` binding of the created function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {*} value The value to wrap.
 * @param {Function} wrapper The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('Fred, Wilma, & Pebbles');
 * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
 */
function wrap(value, wrapper) {
  return createWrapper(wrapper, 16, [value]);
}

module.exports = wrap;

},{"../internals/createWrapper":97}],77:[function(_dereq_,module,exports){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrays = _dereq_('./arrays'),
    chaining = _dereq_('./chaining'),
    collections = _dereq_('./collections'),
    functions = _dereq_('./functions'),
    objects = _dereq_('./objects'),
    utilities = _dereq_('./utilities'),
    forEach = _dereq_('./collections/forEach'),
    forOwn = _dereq_('./objects/forOwn'),
    isArray = _dereq_('./objects/isArray'),
    lodashWrapper = _dereq_('./internals/lodashWrapper'),
    mixin = _dereq_('./utilities/mixin'),
    support = _dereq_('./support'),
    templateSettings = _dereq_('./utilities/templateSettings');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps the given value to enable intuitive
 * method chaining.
 *
 * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
 * and `unshift`
 *
 * Chaining is supported in custom builds as long as the `value` method is
 * implicitly or explicitly included in the build.
 *
 * The chainable wrapper functions are:
 * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
 * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
 * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
 * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
 * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
 * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
 * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
 * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
 * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
 * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
 * and `zip`
 *
 * The non-chainable wrapper functions are:
 * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
 * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
 * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
 * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
 * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
 * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
 * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
 * `template`, `unescape`, `uniqueId`, and `value`
 *
 * The wrapper functions `first` and `last` return wrapped values when `n` is
 * provided, otherwise they return unwrapped values.
 *
 * Explicit chaining can be enabled by using the `_.chain` method.
 *
 * @name _
 * @constructor
 * @category Chaining
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns a `lodash` instance.
 * @example
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // returns an unwrapped value
 * wrapped.reduce(function(sum, num) {
 *   return sum + num;
 * });
 * // => 6
 *
 * // returns a wrapped value
 * var squares = wrapped.map(function(num) {
 *   return num * num;
 * });
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
  return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
   ? value
   : new lodashWrapper(value);
}
// ensure `new lodashWrapper` is an instance of `lodash`
lodashWrapper.prototype = lodash.prototype;

// wrap `_.mixin` so it works when provided only one argument
mixin = (function(fn) {
  var functions = objects.functions;
  return function(object, source, options) {
    if (!source || (!options && !functions(source).length)) {
      if (options == null) {
        options = source;
      }
      source = object;
      object = lodash;
    }
    return fn(object, source, options);
  };
}(mixin));

// add functions that return wrapped values when chaining
lodash.after = functions.after;
lodash.assign = objects.assign;
lodash.at = collections.at;
lodash.bind = functions.bind;
lodash.bindAll = functions.bindAll;
lodash.bindKey = functions.bindKey;
lodash.chain = chaining.chain;
lodash.compact = arrays.compact;
lodash.compose = functions.compose;
lodash.constant = utilities.constant;
lodash.countBy = collections.countBy;
lodash.create = objects.create;
lodash.createCallback = functions.createCallback;
lodash.curry = functions.curry;
lodash.debounce = functions.debounce;
lodash.defaults = objects.defaults;
lodash.defer = functions.defer;
lodash.delay = functions.delay;
lodash.difference = arrays.difference;
lodash.filter = collections.filter;
lodash.flatten = arrays.flatten;
lodash.forEach = forEach;
lodash.forEachRight = collections.forEachRight;
lodash.forIn = objects.forIn;
lodash.forInRight = objects.forInRight;
lodash.forOwn = forOwn;
lodash.forOwnRight = objects.forOwnRight;
lodash.functions = objects.functions;
lodash.groupBy = collections.groupBy;
lodash.indexBy = collections.indexBy;
lodash.initial = arrays.initial;
lodash.intersection = arrays.intersection;
lodash.invert = objects.invert;
lodash.invoke = collections.invoke;
lodash.keys = objects.keys;
lodash.map = collections.map;
lodash.mapValues = objects.mapValues;
lodash.max = collections.max;
lodash.memoize = functions.memoize;
lodash.merge = objects.merge;
lodash.min = collections.min;
lodash.omit = objects.omit;
lodash.once = functions.once;
lodash.pairs = objects.pairs;
lodash.partial = functions.partial;
lodash.partialRight = functions.partialRight;
lodash.pick = objects.pick;
lodash.pluck = collections.pluck;
lodash.property = utilities.property;
lodash.pull = arrays.pull;
lodash.range = arrays.range;
lodash.reject = collections.reject;
lodash.remove = arrays.remove;
lodash.rest = arrays.rest;
lodash.shuffle = collections.shuffle;
lodash.sortBy = collections.sortBy;
lodash.tap = chaining.tap;
lodash.throttle = functions.throttle;
lodash.times = utilities.times;
lodash.toArray = collections.toArray;
lodash.transform = objects.transform;
lodash.union = arrays.union;
lodash.uniq = arrays.uniq;
lodash.values = objects.values;
lodash.where = collections.where;
lodash.without = arrays.without;
lodash.wrap = functions.wrap;
lodash.xor = arrays.xor;
lodash.zip = arrays.zip;
lodash.zipObject = arrays.zipObject;

// add aliases
lodash.collect = collections.map;
lodash.drop = arrays.rest;
lodash.each = forEach;
lodash.eachRight = collections.forEachRight;
lodash.extend = objects.assign;
lodash.methods = objects.functions;
lodash.object = arrays.zipObject;
lodash.select = collections.filter;
lodash.tail = arrays.rest;
lodash.unique = arrays.uniq;
lodash.unzip = arrays.zip;

// add functions to `lodash.prototype`
mixin(lodash);

// add functions that return unwrapped values when chaining
lodash.clone = objects.clone;
lodash.cloneDeep = objects.cloneDeep;
lodash.contains = collections.contains;
lodash.escape = utilities.escape;
lodash.every = collections.every;
lodash.find = collections.find;
lodash.findIndex = arrays.findIndex;
lodash.findKey = objects.findKey;
lodash.findLast = collections.findLast;
lodash.findLastIndex = arrays.findLastIndex;
lodash.findLastKey = objects.findLastKey;
lodash.has = objects.has;
lodash.identity = utilities.identity;
lodash.indexOf = arrays.indexOf;
lodash.isArguments = objects.isArguments;
lodash.isArray = isArray;
lodash.isBoolean = objects.isBoolean;
lodash.isDate = objects.isDate;
lodash.isElement = objects.isElement;
lodash.isEmpty = objects.isEmpty;
lodash.isEqual = objects.isEqual;
lodash.isFinite = objects.isFinite;
lodash.isFunction = objects.isFunction;
lodash.isNaN = objects.isNaN;
lodash.isNull = objects.isNull;
lodash.isNumber = objects.isNumber;
lodash.isObject = objects.isObject;
lodash.isPlainObject = objects.isPlainObject;
lodash.isRegExp = objects.isRegExp;
lodash.isString = objects.isString;
lodash.isUndefined = objects.isUndefined;
lodash.lastIndexOf = arrays.lastIndexOf;
lodash.mixin = mixin;
lodash.noConflict = utilities.noConflict;
lodash.noop = utilities.noop;
lodash.now = utilities.now;
lodash.parseInt = utilities.parseInt;
lodash.random = utilities.random;
lodash.reduce = collections.reduce;
lodash.reduceRight = collections.reduceRight;
lodash.result = utilities.result;
lodash.size = collections.size;
lodash.some = collections.some;
lodash.sortedIndex = arrays.sortedIndex;
lodash.template = utilities.template;
lodash.unescape = utilities.unescape;
lodash.uniqueId = utilities.uniqueId;

// add aliases
lodash.all = collections.every;
lodash.any = collections.some;
lodash.detect = collections.find;
lodash.findWhere = collections.find;
lodash.foldl = collections.reduce;
lodash.foldr = collections.reduceRight;
lodash.include = collections.contains;
lodash.inject = collections.reduce;

mixin(function() {
  var source = {}
  forOwn(lodash, function(func, methodName) {
    if (!lodash.prototype[methodName]) {
      source[methodName] = func;
    }
  });
  return source;
}(), false);

// add functions capable of returning wrapped and unwrapped values when chaining
lodash.first = arrays.first;
lodash.last = arrays.last;
lodash.sample = collections.sample;

// add aliases
lodash.take = arrays.first;
lodash.head = arrays.first;

forOwn(lodash, function(func, methodName) {
  var callbackable = methodName !== 'sample';
  if (!lodash.prototype[methodName]) {
    lodash.prototype[methodName]= function(n, guard) {
      var chainAll = this.__chain__,
          result = func(this.__wrapped__, n, guard);

      return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
        ? result
        : new lodashWrapper(result, chainAll);
    };
  }
});

/**
 * The semantic version number.
 *
 * @static
 * @memberOf _
 * @type string
 */
lodash.VERSION = '2.4.1';

// add "Chaining" functions to the wrapper
lodash.prototype.chain = chaining.wrapperChain;
lodash.prototype.toString = chaining.wrapperToString;
lodash.prototype.value = chaining.wrapperValueOf;
lodash.prototype.valueOf = chaining.wrapperValueOf;

// add `Array` functions that return unwrapped values
forEach(['join', 'pop', 'shift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    var chainAll = this.__chain__,
        result = func.apply(this.__wrapped__, arguments);

    return chainAll
      ? new lodashWrapper(result, chainAll)
      : result;
  };
});

// add `Array` functions that return the existing wrapped value
forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    func.apply(this.__wrapped__, arguments);
    return this;
  };
});

// add `Array` functions that return new wrapped values
forEach(['concat', 'slice', 'splice'], function(methodName) {
  var func = arrayRef[methodName];
  lodash.prototype[methodName] = function() {
    return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
  };
});

lodash.support = support;
(lodash.templateSettings = utilities.templateSettings).imports._ = lodash;
module.exports = lodash;

},{"./arrays":4,"./chaining":27,"./collections":33,"./collections/forEach":41,"./functions":60,"./internals/lodashWrapper":107,"./objects":121,"./objects/forOwn":131,"./objects/isArray":137,"./support":161,"./utilities":162,"./utilities/mixin":166,"./utilities/templateSettings":175}],78:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;

},{}],79:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('./baseCreate'),
    isObject = _dereq_('../objects/isObject'),
    setBindData = _dereq_('./setBindData'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"../objects/isObject":148,"./baseCreate":81,"./setBindData":116,"./slice":119}],80:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = _dereq_('../objects/assign'),
    forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    getArray = _dereq_('./getArray'),
    isArray = _dereq_('../objects/isArray'),
    isObject = _dereq_('../objects/isObject'),
    releaseArray = _dereq_('./releaseArray'),
    slice = _dereq_('./slice');

/** Used to match regexp flags from their coerced string values */
var reFlags = /\w*$/;

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used to identify object classifications that `_.clone` supports */
var cloneableClasses = {};
cloneableClasses[funcClass] = false;
cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
cloneableClasses[boolClass] = cloneableClasses[dateClass] =
cloneableClasses[numberClass] = cloneableClasses[objectClass] =
cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to lookup a built-in constructor by [[Class]] */
var ctorByClass = {};
ctorByClass[arrayClass] = Array;
ctorByClass[boolClass] = Boolean;
ctorByClass[dateClass] = Date;
ctorByClass[funcClass] = Function;
ctorByClass[objectClass] = Object;
ctorByClass[numberClass] = Number;
ctorByClass[regexpClass] = RegExp;
ctorByClass[stringClass] = String;

/**
 * The base implementation of `_.clone` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, callback, stackA, stackB) {
  if (callback) {
    var result = callback(value);
    if (typeof result != 'undefined') {
      return result;
    }
  }
  // inspect [[Class]]
  var isObj = isObject(value);
  if (isObj) {
    var className = toString.call(value);
    if (!cloneableClasses[className]) {
      return value;
    }
    var ctor = ctorByClass[className];
    switch (className) {
      case boolClass:
      case dateClass:
        return new ctor(+value);

      case numberClass:
      case stringClass:
        return new ctor(value);

      case regexpClass:
        result = ctor(value.source, reFlags.exec(value));
        result.lastIndex = value.lastIndex;
        return result;
    }
  } else {
    return value;
  }
  var isArr = isArray(value);
  if (isDeep) {
    // check for circular references and return corresponding clone
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    result = isArr ? ctor(value.length) : {};
  }
  else {
    result = isArr ? slice(value) : assign({}, value);
  }
  // add array properties assigned by `RegExp#exec`
  if (isArr) {
    if (hasOwnProperty.call(value, 'index')) {
      result.index = value.index;
    }
    if (hasOwnProperty.call(value, 'input')) {
      result.input = value.input;
    }
  }
  // exit for shallow clone
  if (!isDeep) {
    return result;
  }
  // add the source value to the stack of traversed objects
  // and associate it with its clone
  stackA.push(value);
  stackB.push(result);

  // recursively populate clone (susceptible to call stack limits)
  (isArr ? forEach : forOwn)(value, function(objValue, key) {
    result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
  });

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseClone;

},{"../collections/forEach":41,"../objects/assign":122,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isObject":148,"./getArray":100,"./releaseArray":114,"./slice":119}],81:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./isNative'),
    isObject = _dereq_('../objects/isObject'),
    noop = _dereq_('../utilities/noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isObject":148,"../utilities/noop":168,"./isNative":104}],82:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = _dereq_('../functions/bind'),
    identity = _dereq_('../utilities/identity'),
    setBindData = _dereq_('./setBindData'),
    support = _dereq_('../support');

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;

},{"../functions/bind":62,"../support":161,"../utilities/identity":165,"./setBindData":116}],83:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('./baseCreate'),
    isObject = _dereq_('../objects/isObject'),
    setBindData = _dereq_('./setBindData'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"../objects/isObject":148,"./baseCreate":81,"./setBindData":116,"./slice":119}],84:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    cacheIndexOf = _dereq_('./cacheIndexOf'),
    createCache = _dereq_('./createCache'),
    largeArraySize = _dereq_('./largeArraySize'),
    releaseObject = _dereq_('./releaseObject');

/**
 * The base implementation of `_.difference` that accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {Array} [values] The array of values to exclude.
 * @returns {Array} Returns a new array of filtered values.
 */
function baseDifference(array, values) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      isLarge = length >= largeArraySize,
      result = [];

  if (isLarge) {
    var cache = createCache(values);
    if (cache) {
      indexOf = cacheIndexOf;
      values = cache;
    } else {
      isLarge = false;
    }
  }
  while (++index < length) {
    var value = array[index];
    if (indexOf(values, value) < 0) {
      result.push(value);
    }
  }
  if (isLarge) {
    releaseObject(values);
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":86,"./cacheIndexOf":91,"./createCache":96,"./largeArraySize":106,"./releaseObject":115}],85:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isArguments = _dereq_('../objects/isArguments'),
    isArray = _dereq_('../objects/isArray');

/**
 * The base implementation of `_.flatten` without support for callback
 * shorthands or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
 * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
 * @param {number} [fromIndex=0] The index to start from.
 * @returns {Array} Returns a new flattened array.
 */
function baseFlatten(array, isShallow, isStrict, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value && typeof value == 'object' && typeof value.length == 'number'
        && (isArray(value) || isArguments(value))) {
      // recursively flatten arrays (susceptible to call stack limits)
      if (!isShallow) {
        value = baseFlatten(value, isShallow, isStrict);
      }
      var valIndex = -1,
          valLength = value.length,
          resIndex = result.length;

      result.length += valLength;
      while (++valIndex < valLength) {
        result[resIndex++] = value[valIndex];
      }
    } else if (!isStrict) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../objects/isArguments":136,"../objects/isArray":137}],86:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches
 * or `fromIndex` constraints.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],87:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('../objects/forIn'),
    getArray = _dereq_('./getArray'),
    isFunction = _dereq_('../objects/isFunction'),
    objectTypes = _dereq_('./objectTypes'),
    releaseArray = _dereq_('./releaseArray');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;

},{"../objects/forIn":129,"../objects/isFunction":144,"./getArray":100,"./objectTypes":110,"./releaseArray":114}],88:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray'),
    isPlainObject = _dereq_('../objects/isPlainObject');

/**
 * The base implementation of `_.merge` without argument juggling or support
 * for `thisArg` binding.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 */
function baseMerge(object, source, callback, stackA, stackB) {
  (isArray(source) ? forEach : forOwn)(source, function(source, key) {
    var found,
        isArr,
        result = source,
        value = object[key];

    if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
      // avoid merging previously merged cyclic sources
      var stackLength = stackA.length;
      while (stackLength--) {
        if ((found = stackA[stackLength] == source)) {
          value = stackB[stackLength];
          break;
        }
      }
      if (!found) {
        var isShallow;
        if (callback) {
          result = callback(value, source);
          if ((isShallow = typeof result != 'undefined')) {
            value = result;
          }
        }
        if (!isShallow) {
          value = isArr
            ? (isArray(value) ? value : [])
            : (isPlainObject(value) ? value : {});
        }
        // add `source` and associated `value` to the stack of traversed objects
        stackA.push(source);
        stackB.push(value);

        // recursively merge objects and arrays (susceptible to call stack limits)
        if (!isShallow) {
          baseMerge(value, source, callback, stackA, stackB);
        }
      }
    }
    else {
      if (callback) {
        result = callback(value, source);
        if (typeof result == 'undefined') {
          result = source;
        }
      }
      if (typeof result != 'undefined') {
        value = result;
      }
    }
    object[key] = value;
  });
}

module.exports = baseMerge;

},{"../collections/forEach":41,"../objects/forOwn":131,"../objects/isArray":137,"../objects/isPlainObject":149}],89:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Native method shortcuts */
var floor = Math.floor;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without argument juggling or support
 * for returning floating-point numbers.
 *
 * @private
 * @param {number} min The minimum possible value.
 * @param {number} max The maximum possible value.
 * @returns {number} Returns a random number.
 */
function baseRandom(min, max) {
  return min + floor(nativeRandom() * (max - min + 1));
}

module.exports = baseRandom;

},{}],90:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    cacheIndexOf = _dereq_('./cacheIndexOf'),
    createCache = _dereq_('./createCache'),
    getArray = _dereq_('./getArray'),
    largeArraySize = _dereq_('./largeArraySize'),
    releaseArray = _dereq_('./releaseArray'),
    releaseObject = _dereq_('./releaseObject');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function} [callback] The function called per iteration.
 * @returns {Array} Returns a duplicate-value-free array.
 */
function baseUniq(array, isSorted, callback) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      result = [];

  var isLarge = !isSorted && length >= largeArraySize,
      seen = (callback || isLarge) ? getArray() : result;

  if (isLarge) {
    var cache = createCache(seen);
    indexOf = cacheIndexOf;
    seen = cache;
  }
  while (++index < length) {
    var value = array[index],
        computed = callback ? callback(value, index, array) : value;

    if (isSorted
          ? !index || seen[seen.length - 1] !== computed
          : indexOf(seen, computed) < 0
        ) {
      if (callback || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  if (isLarge) {
    releaseArray(seen.array);
    releaseObject(seen);
  } else if (callback) {
    releaseArray(seen);
  }
  return result;
}

module.exports = baseUniq;

},{"./baseIndexOf":86,"./cacheIndexOf":91,"./createCache":96,"./getArray":100,"./largeArraySize":106,"./releaseArray":114,"./releaseObject":115}],91:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = _dereq_('./baseIndexOf'),
    keyPrefix = _dereq_('./keyPrefix');

/**
 * An implementation of `_.contains` for cache objects that mimics the return
 * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache object to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var type = typeof value;
  cache = cache.cache;

  if (type == 'boolean' || value == null) {
    return cache[value] ? 0 : -1;
  }
  if (type != 'number' && type != 'string') {
    type = 'object';
  }
  var key = type == 'number' ? value : keyPrefix + value;
  cache = (cache = cache[type]) && cache[key];

  return type == 'object'
    ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
    : (cache ? 0 : -1);
}

module.exports = cacheIndexOf;

},{"./baseIndexOf":86,"./keyPrefix":105}],92:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keyPrefix = _dereq_('./keyPrefix');

/**
 * Adds a given value to the corresponding cache object.
 *
 * @private
 * @param {*} value The value to add to the cache.
 */
function cachePush(value) {
  var cache = this.cache,
      type = typeof value;

  if (type == 'boolean' || value == null) {
    cache[value] = true;
  } else {
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value,
        typeCache = cache[type] || (cache[type] = {});

    if (type == 'object') {
      (typeCache[key] || (typeCache[key] = [])).push(value);
    } else {
      typeCache[key] = true;
    }
  }
}

module.exports = cachePush;

},{"./keyPrefix":105}],93:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `_.max` and `_.min` as the default callback when a given
 * collection is a string value.
 *
 * @private
 * @param {string} value The character to inspect.
 * @returns {number} Returns the code unit of given character.
 */
function charAtCallback(value) {
  return value.charCodeAt(0);
}

module.exports = charAtCallback;

},{}],94:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used by `sortBy` to compare transformed `collection` elements, stable sorting
 * them in ascending order.
 *
 * @private
 * @param {Object} a The object to compare to `b`.
 * @param {Object} b The object to compare to `a`.
 * @returns {number} Returns the sort order indicator of `1` or `-1`.
 */
function compareAscending(a, b) {
  var ac = a.criteria,
      bc = b.criteria,
      index = -1,
      length = ac.length;

  while (++index < length) {
    var value = ac[index],
        other = bc[index];

    if (value !== other) {
      if (value > other || typeof value == 'undefined') {
        return 1;
      }
      if (value < other || typeof other == 'undefined') {
        return -1;
      }
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to return the same value for
  // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
  //
  // This also ensures a stable sort in V8 and other engines.
  // See http://code.google.com/p/v8/issues/detail?id=90
  return a.index - b.index;
}

module.exports = compareAscending;

},{}],95:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('../objects/forOwn'),
    isArray = _dereq_('../objects/isArray');

/**
 * Creates a function that aggregates a collection, creating an object composed
 * of keys generated from the results of running each element of the collection
 * through a callback. The given `setter` function sets the keys and values
 * of the composed object.
 *
 * @private
 * @param {Function} setter The setter function.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter) {
  return function(collection, callback, thisArg) {
    var result = {};
    callback = createCallback(callback, thisArg, 3);

    var index = -1,
        length = collection ? collection.length : 0;

    if (typeof length == 'number') {
      while (++index < length) {
        var value = collection[index];
        setter(result, value, callback(value, index, collection), collection);
      }
    } else {
      forOwn(collection, function(value, key, collection) {
        setter(result, value, callback(value, key, collection), collection);
      });
    }
    return result;
  };
}

module.exports = createAggregator;

},{"../functions/createCallback":66,"../objects/forOwn":131,"../objects/isArray":137}],96:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var cachePush = _dereq_('./cachePush'),
    getObject = _dereq_('./getObject'),
    releaseObject = _dereq_('./releaseObject');

/**
 * Creates a cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [array=[]] The array to search.
 * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
 */
function createCache(array) {
  var index = -1,
      length = array.length,
      first = array[0],
      mid = array[(length / 2) | 0],
      last = array[length - 1];

  if (first && typeof first == 'object' &&
      mid && typeof mid == 'object' && last && typeof last == 'object') {
    return false;
  }
  var cache = getObject();
  cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

  var result = getObject();
  result.array = array;
  result.cache = cache;
  result.push = cachePush;

  while (++index < length) {
    result.push(array[index]);
  }
  return result;
}

module.exports = createCache;

},{"./cachePush":92,"./getObject":101,"./releaseObject":115}],97:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = _dereq_('./baseBind'),
    baseCreateWrapper = _dereq_('./baseCreateWrapper'),
    isFunction = _dereq_('../objects/isFunction'),
    slice = _dereq_('./slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"../objects/isFunction":144,"./baseBind":79,"./baseCreateWrapper":83,"./slice":119}],98:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes');

/**
 * Used by `escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(match) {
  return htmlEscapes[match];
}

module.exports = escapeHtmlChar;

},{"./htmlEscapes":102}],99:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to escape characters for inclusion in compiled string literals */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\t': 't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/**
 * Used by `template` to escape characters for inclusion in compiled
 * string literals.
 *
 * @private
 * @param {string} match The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(match) {
  return '\\' + stringEscapes[match];
}

module.exports = escapeStringChar;

},{}],100:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = _dereq_('./arrayPool');

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;

},{"./arrayPool":78}],101:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectPool = _dereq_('./objectPool');

/**
 * Gets an object from the object pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Object} The object from the pool.
 */
function getObject() {
  return objectPool.pop() || {
    'array': null,
    'cache': null,
    'criteria': null,
    'false': false,
    'index': 0,
    'null': false,
    'number': null,
    'object': null,
    'push': null,
    'string': null,
    'true': false,
    'undefined': false,
    'value': null
  };
}

module.exports = getObject;

},{"./objectPool":109}],102:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Used to convert characters to HTML entities:
 *
 * Though the `>` character is escaped for symmetry, characters like `>` and `/`
 * don't require escaping in HTML and have no special meaning unless they're part
 * of a tag or an unquoted attribute value.
 * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
 */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

module.exports = htmlEscapes;

},{}],103:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes'),
    invert = _dereq_('../objects/invert');

/** Used to convert HTML entities to characters */
var htmlUnescapes = invert(htmlEscapes);

module.exports = htmlUnescapes;

},{"../objects/invert":135,"./htmlEscapes":102}],104:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],105:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
var keyPrefix = +new Date + '';

module.exports = keyPrefix;

},{}],106:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the size when optimizations are enabled for large arrays */
var largeArraySize = 75;

module.exports = largeArraySize;

},{}],107:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A fast path for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap in a `lodash` instance.
 * @param {boolean} chainAll A flag to enable chaining for all methods
 * @returns {Object} Returns a `lodash` instance.
 */
function lodashWrapper(value, chainAll) {
  this.__chain__ = !!chainAll;
  this.__wrapped__ = value;
}

module.exports = lodashWrapper;

},{}],108:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;

},{}],109:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var objectPool = [];

module.exports = objectPool;

},{}],110:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],111:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = _dereq_('./htmlUnescapes'),
    keys = _dereq_('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g');

module.exports = reEscapedHtml;

},{"../objects/keys":153,"./htmlUnescapes":103}],112:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to match "interpolate" template delimiters */
var reInterpolate = /<%=([\s\S]+?)%>/g;

module.exports = reInterpolate;

},{}],113:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlEscapes = _dereq_('./htmlEscapes'),
    keys = _dereq_('../objects/keys');

/** Used to match HTML entities and HTML characters */
var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

module.exports = reUnescapedHtml;

},{"../objects/keys":153,"./htmlEscapes":102}],114:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = _dereq_('./arrayPool'),
    maxPoolSize = _dereq_('./maxPoolSize');

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;

},{"./arrayPool":78,"./maxPoolSize":108}],115:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var maxPoolSize = _dereq_('./maxPoolSize'),
    objectPool = _dereq_('./objectPool');

/**
 * Releases the given object back to the object pool.
 *
 * @private
 * @param {Object} [object] The object to release.
 */
function releaseObject(object) {
  var cache = object.cache;
  if (cache) {
    releaseObject(cache);
  }
  object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
  if (objectPool.length < maxPoolSize) {
    objectPool.push(object);
  }
}

module.exports = releaseObject;

},{"./maxPoolSize":108,"./objectPool":109}],116:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./isNative'),
    noop = _dereq_('../utilities/noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"../utilities/noop":168,"./isNative":104}],117:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('../objects/forIn'),
    isFunction = _dereq_('../objects/isFunction');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `isPlainObject` which checks if a given value
 * is an object created by the `Object` constructor, assuming objects created
 * by the `Object` constructor have no inherited enumerable properties and that
 * there are no `Object.prototype` extensions.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 */
function shimIsPlainObject(value) {
  var ctor,
      result;

  // avoid non Object objects, `arguments` objects, and DOM elements
  if (!(value && toString.call(value) == objectClass) ||
      (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
    return false;
  }
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  forIn(value, function(value, key) {
    result = key;
  });
  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
}

module.exports = shimIsPlainObject;

},{"../objects/forIn":129,"../objects/isFunction":144}],118:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = _dereq_('./objectTypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"./objectTypes":110}],119:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],120:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var htmlUnescapes = _dereq_('./htmlUnescapes');

/**
 * Used by `unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} match The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
function unescapeHtmlChar(match) {
  return htmlUnescapes[match];
}

module.exports = unescapeHtmlChar;

},{"./htmlUnescapes":103}],121:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'assign': _dereq_('./objects/assign'),
  'clone': _dereq_('./objects/clone'),
  'cloneDeep': _dereq_('./objects/cloneDeep'),
  'create': _dereq_('./objects/create'),
  'defaults': _dereq_('./objects/defaults'),
  'extend': _dereq_('./objects/assign'),
  'findKey': _dereq_('./objects/findKey'),
  'findLastKey': _dereq_('./objects/findLastKey'),
  'forIn': _dereq_('./objects/forIn'),
  'forInRight': _dereq_('./objects/forInRight'),
  'forOwn': _dereq_('./objects/forOwn'),
  'forOwnRight': _dereq_('./objects/forOwnRight'),
  'functions': _dereq_('./objects/functions'),
  'has': _dereq_('./objects/has'),
  'invert': _dereq_('./objects/invert'),
  'isArguments': _dereq_('./objects/isArguments'),
  'isArray': _dereq_('./objects/isArray'),
  'isBoolean': _dereq_('./objects/isBoolean'),
  'isDate': _dereq_('./objects/isDate'),
  'isElement': _dereq_('./objects/isElement'),
  'isEmpty': _dereq_('./objects/isEmpty'),
  'isEqual': _dereq_('./objects/isEqual'),
  'isFinite': _dereq_('./objects/isFinite'),
  'isFunction': _dereq_('./objects/isFunction'),
  'isNaN': _dereq_('./objects/isNaN'),
  'isNull': _dereq_('./objects/isNull'),
  'isNumber': _dereq_('./objects/isNumber'),
  'isObject': _dereq_('./objects/isObject'),
  'isPlainObject': _dereq_('./objects/isPlainObject'),
  'isRegExp': _dereq_('./objects/isRegExp'),
  'isString': _dereq_('./objects/isString'),
  'isUndefined': _dereq_('./objects/isUndefined'),
  'keys': _dereq_('./objects/keys'),
  'mapValues': _dereq_('./objects/mapValues'),
  'merge': _dereq_('./objects/merge'),
  'methods': _dereq_('./objects/functions'),
  'omit': _dereq_('./objects/omit'),
  'pairs': _dereq_('./objects/pairs'),
  'pick': _dereq_('./objects/pick'),
  'transform': _dereq_('./objects/transform'),
  'values': _dereq_('./objects/values')
};

},{"./objects/assign":122,"./objects/clone":123,"./objects/cloneDeep":124,"./objects/create":125,"./objects/defaults":126,"./objects/findKey":127,"./objects/findLastKey":128,"./objects/forIn":129,"./objects/forInRight":130,"./objects/forOwn":131,"./objects/forOwnRight":132,"./objects/functions":133,"./objects/has":134,"./objects/invert":135,"./objects/isArguments":136,"./objects/isArray":137,"./objects/isBoolean":138,"./objects/isDate":139,"./objects/isElement":140,"./objects/isEmpty":141,"./objects/isEqual":142,"./objects/isFinite":143,"./objects/isFunction":144,"./objects/isNaN":145,"./objects/isNull":146,"./objects/isNumber":147,"./objects/isObject":148,"./objects/isPlainObject":149,"./objects/isRegExp":150,"./objects/isString":151,"./objects/isUndefined":152,"./objects/keys":153,"./objects/mapValues":154,"./objects/merge":155,"./objects/omit":156,"./objects/pairs":157,"./objects/pick":158,"./objects/transform":159,"./objects/values":160}],122:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources will overwrite property assignments of previous
 * sources. If a callback is provided it will be executed to produce the
 * assigned values. The callback is bound to `thisArg` and invoked with two
 * arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @type Function
 * @alias extend
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
 * // => { 'name': 'fred', 'employer': 'slate' }
 *
 * var defaults = _.partialRight(_.assign, function(a, b) {
 *   return typeof a == 'undefined' ? b : a;
 * });
 *
 * var object = { 'name': 'barney' };
 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var assign = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
    callback = args[--argsLength];
  }
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
    }
    }
  }
  return result
};

module.exports = assign;

},{"../internals/baseCreateCallback":82,"../internals/objectTypes":110,"./keys":153}],123:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = _dereq_('../internals/baseClone'),
    baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
 * be cloned, otherwise they will be assigned by reference. If a callback
 * is provided it will be executed to produce the cloned values. If the
 * callback returns `undefined` cloning will be handled by the method instead.
 * The callback is bound to `thisArg` and invoked with one argument; (value).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep=false] Specify a deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var shallow = _.clone(characters);
 * shallow[0] === characters[0];
 * // => true
 *
 * var deep = _.clone(characters, true);
 * deep[0] === characters[0];
 * // => false
 *
 * _.mixin({
 *   'clone': _.partialRight(_.clone, function(value) {
 *     return _.isElement(value) ? value.cloneNode(false) : undefined;
 *   })
 * });
 *
 * var clone = _.clone(document.body);
 * clone.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, callback, thisArg) {
  // allows working with "Collections" methods without using their `index`
  // and `collection` arguments for `isDeep` and `callback`
  if (typeof isDeep != 'boolean' && isDeep != null) {
    thisArg = callback;
    callback = isDeep;
    isDeep = false;
  }
  return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = clone;

},{"../internals/baseClone":80,"../internals/baseCreateCallback":82}],124:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseClone = _dereq_('../internals/baseClone'),
    baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Creates a deep clone of `value`. If a callback is provided it will be
 * executed to produce the cloned values. If the callback returns `undefined`
 * cloning will be handled by the method instead. The callback is bound to
 * `thisArg` and invoked with one argument; (value).
 *
 * Note: This method is loosely based on the structured clone algorithm. Functions
 * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
 * objects created by constructors other than `Object` are cloned to plain `Object` objects.
 * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to deep clone.
 * @param {Function} [callback] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the deep cloned value.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * var deep = _.cloneDeep(characters);
 * deep[0] === characters[0];
 * // => false
 *
 * var view = {
 *   'label': 'docs',
 *   'node': element
 * };
 *
 * var clone = _.cloneDeep(view, function(value) {
 *   return _.isElement(value) ? value.cloneNode(true) : undefined;
 * });
 *
 * clone.node == view.node;
 * // => false
 */
function cloneDeep(value, callback, thisArg) {
  return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}

module.exports = cloneDeep;

},{"../internals/baseClone":80,"../internals/baseCreateCallback":82}],125:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var assign = _dereq_('./assign'),
    baseCreate = _dereq_('../internals/baseCreate');

/**
 * Creates an object that inherits from the given `prototype` object. If a
 * `properties` object is provided its own enumerable properties are assigned
 * to the created object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */
function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties ? assign(result, properties) : result;
}

module.exports = create;

},{"../internals/baseCreate":81,"./assign":122}],126:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional defaults of the same property will be ignored.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param- {Object} [guard] Allows working with `_.reduce` without using its
 *  `key` and `object` arguments as sources.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var object = { 'name': 'barney' };
 * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var defaults = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (typeof result[index] == 'undefined') result[index] = iterable[index];
    }
    }
  }
  return result
};

module.exports = defaults;

},{"../internals/objectTypes":110,"./keys":153}],127:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('./forOwn');

/**
 * This method is like `_.findIndex` except that it returns the key of the
 * first element that passes the callback check, instead of the element itself.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': false },
 *   'fred': {    'age': 40, 'blocked': true },
 *   'pebbles': { 'age': 1,  'blocked': false }
 * };
 *
 * _.findKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => 'barney' (property order is not guaranteed across environments)
 *
 * // using "_.where" callback shorthand
 * _.findKey(characters, { 'age': 1 });
 * // => 'pebbles'
 *
 * // using "_.pluck" callback shorthand
 * _.findKey(characters, 'blocked');
 * // => 'fred'
 */
function findKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwn(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findKey;

},{"../functions/createCallback":66,"./forOwn":131}],128:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwnRight = _dereq_('./forOwnRight');

/**
 * This method is like `_.findKey` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to search.
 * @param {Function|Object|string} [callback=identity] The function called per
 *  iteration. If a property name or object is provided it will be used to
 *  create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {string|undefined} Returns the key of the found element, else `undefined`.
 * @example
 *
 * var characters = {
 *   'barney': {  'age': 36, 'blocked': true },
 *   'fred': {    'age': 40, 'blocked': false },
 *   'pebbles': { 'age': 1,  'blocked': true }
 * };
 *
 * _.findLastKey(characters, function(chr) {
 *   return chr.age < 40;
 * });
 * // => returns `pebbles`, assuming `_.findKey` returns `barney`
 *
 * // using "_.where" callback shorthand
 * _.findLastKey(characters, { 'age': 40 });
 * // => 'fred'
 *
 * // using "_.pluck" callback shorthand
 * _.findLastKey(characters, 'blocked');
 * // => 'pebbles'
 */
function findLastKey(object, callback, thisArg) {
  var result;
  callback = createCallback(callback, thisArg, 3);
  forOwnRight(object, function(value, key, object) {
    if (callback(value, key, object)) {
      result = key;
      return false;
    }
  });
  return result;
}

module.exports = findLastKey;

},{"../functions/createCallback":66,"./forOwnRight":132}],129:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;

},{"../internals/baseCreateCallback":82,"../internals/objectTypes":110}],130:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    forIn = _dereq_('./forIn');

/**
 * This method is like `_.forIn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forInRight(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
 */
function forInRight(object, callback, thisArg) {
  var pairs = [];

  forIn(object, function(value, key) {
    pairs.push(key, value);
  });

  var length = pairs.length;
  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    if (callback(pairs[length--], pairs[length], object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forInRight;

},{"../internals/baseCreateCallback":82,"./forIn":129}],131:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys'),
    objectTypes = _dereq_('../internals/objectTypes');

/**
 * Iterates over own enumerable properties of an object, executing the callback
 * for each property. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, key, object). Callbacks may exit iteration early by
 * explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
 */
var forOwn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forOwn;

},{"../internals/baseCreateCallback":82,"../internals/objectTypes":110,"./keys":153}],132:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    keys = _dereq_('./keys');

/**
 * This method is like `_.forOwn` except that it iterates over elements
 * of a `collection` in the opposite order.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
 *   console.log(key);
 * });
 * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
 */
function forOwnRight(object, callback, thisArg) {
  var props = keys(object),
      length = props.length;

  callback = baseCreateCallback(callback, thisArg, 3);
  while (length--) {
    var key = props[length];
    if (callback(object[key], key, object) === false) {
      break;
    }
  }
  return object;
}

module.exports = forOwnRight;

},{"../internals/baseCreateCallback":82,"./keys":153}],133:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = _dereq_('./forIn'),
    isFunction = _dereq_('./isFunction');

/**
 * Creates a sorted array of property names of all enumerable properties,
 * own and inherited, of `object` that have function values.
 *
 * @static
 * @memberOf _
 * @alias methods
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names that have function values.
 * @example
 *
 * _.functions(_);
 * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
 */
function functions(object) {
  var result = [];
  forIn(object, function(value, key) {
    if (isFunction(value)) {
      result.push(key);
    }
  });
  return result.sort();
}

module.exports = functions;

},{"./forIn":129,"./isFunction":144}],134:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if the specified property name exists as a direct property of `object`,
 * instead of an inherited property.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to check.
 * @returns {boolean} Returns `true` if key is a direct property, else `false`.
 * @example
 *
 * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
 * // => true
 */
function has(object, key) {
  return object ? hasOwnProperty.call(object, key) : false;
}

module.exports = has;

},{}],135:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates an object composed of the inverted keys and values of the given object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to invert.
 * @returns {Object} Returns the created inverted object.
 * @example
 *
 * _.invert({ 'first': 'fred', 'second': 'barney' });
 * // => { 'fred': 'first', 'barney': 'second' }
 */
function invert(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index];
    result[object[key]] = key;
  }
  return result;
}

module.exports = invert;

},{"./keys":153}],136:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
 * @example
 *
 * (function() { return _.isArguments(arguments); })(1, 2, 3);
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == argsClass || false;
}

module.exports = isArguments;

},{}],137:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative');

/** `Object#toString` result shortcuts */
var arrayClass = '[object Array]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is an array.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
 * @example
 *
 * (function() { return _.isArray(arguments); })();
 * // => false
 *
 * _.isArray([1, 2, 3]);
 * // => true
 */
var isArray = nativeIsArray || function(value) {
  return value && typeof value == 'object' && typeof value.length == 'number' &&
    toString.call(value) == arrayClass || false;
};

module.exports = isArray;

},{"../internals/isNative":104}],138:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var boolClass = '[object Boolean]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a boolean value.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
 * @example
 *
 * _.isBoolean(null);
 * // => false
 */
function isBoolean(value) {
  return value === true || value === false ||
    value && typeof value == 'object' && toString.call(value) == boolClass || false;
}

module.exports = isBoolean;

},{}],139:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var dateClass = '[object Date]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a date.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 */
function isDate(value) {
  return value && typeof value == 'object' && toString.call(value) == dateClass || false;
}

module.exports = isDate;

},{}],140:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 */
function isElement(value) {
  return value && value.nodeType === 1 || false;
}

module.exports = isElement;

},{}],141:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forOwn = _dereq_('./forOwn'),
    isFunction = _dereq_('./isFunction');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    objectClass = '[object Object]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
 * length of `0` and objects with no own enumerable properties are considered
 * "empty".
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object|string} value The value to inspect.
 * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({});
 * // => true
 *
 * _.isEmpty('');
 * // => true
 */
function isEmpty(value) {
  var result = true;
  if (!value) {
    return result;
  }
  var className = toString.call(value),
      length = value.length;

  if ((className == arrayClass || className == stringClass || className == argsClass ) ||
      (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
    return !length;
  }
  forOwn(value, function() {
    return (result = false);
  });
  return result;
}

module.exports = isEmpty;

},{"./forOwn":131,"./isFunction":144}],142:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseIsEqual = _dereq_('../internals/baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent to each other. If a callback is provided it will be executed
 * to compare values. If the callback returns `undefined` comparisons will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (a, b).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var copy = { 'name': 'fred' };
 *
 * object == copy;
 * // => false
 *
 * _.isEqual(object, copy);
 * // => true
 *
 * var words = ['hello', 'goodbye'];
 * var otherWords = ['hi', 'goodbye'];
 *
 * _.isEqual(words, otherWords, function(a, b) {
 *   var reGreet = /^(?:hello|hi)$/i,
 *       aGreet = _.isString(a) && reGreet.test(a),
 *       bGreet = _.isString(b) && reGreet.test(b);
 *
 *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
 * });
 * // => true
 */
function isEqual(a, b, callback, thisArg) {
  return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
}

module.exports = isEqual;

},{"../internals/baseCreateCallback":82,"../internals/baseIsEqual":87}],143:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeIsFinite = global.isFinite,
    nativeIsNaN = global.isNaN;

/**
 * Checks if `value` is, or can be coerced to, a finite number.
 *
 * Note: This is not the same as native `isFinite` which will return true for
 * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
 * @example
 *
 * _.isFinite(-101);
 * // => true
 *
 * _.isFinite('10');
 * // => true
 *
 * _.isFinite(true);
 * // => false
 *
 * _.isFinite('');
 * // => false
 *
 * _.isFinite(Infinity);
 * // => false
 */
function isFinite(value) {
  return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
}

module.exports = isFinite;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],144:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],145:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNumber = _dereq_('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * Note: This is not the same as native `isNaN` which will return `true` for
 * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // `NaN` as a primitive is the only value that is not equal to itself
  // (perform the [[Class]] check first to avoid errors with some host objects in IE)
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":147}],146:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `null`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
 * @example
 *
 * _.isNull(null);
 * // => true
 *
 * _.isNull(undefined);
 * // => false
 */
function isNull(value) {
  return value === null;
}

module.exports = isNull;

},{}],147:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var numberClass = '[object Number]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a number.
 *
 * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(8.4 * 5);
 * // => true
 */
function isNumber(value) {
  return typeof value == 'number' ||
    value && typeof value == 'object' && toString.call(value) == numberClass || false;
}

module.exports = isNumber;

},{}],148:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = _dereq_('../internals/objectTypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"../internals/objectTypes":110}],149:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative'),
    shimIsPlainObject = _dereq_('../internals/shimIsPlainObject');

/** `Object#toString` result shortcuts */
var objectClass = '[object Object]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

/**
 * Checks if `value` is an object created by the `Object` constructor.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * _.isPlainObject(new Shape);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 */
var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
  if (!(value && toString.call(value) == objectClass)) {
    return false;
  }
  var valueOf = value.valueOf,
      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

  return objProto
    ? (value == objProto || getPrototypeOf(value) == objProto)
    : shimIsPlainObject(value);
};

module.exports = isPlainObject;

},{"../internals/isNative":104,"../internals/shimIsPlainObject":117}],150:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var regexpClass = '[object RegExp]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a regular expression.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
 * @example
 *
 * _.isRegExp(/fred/);
 * // => true
 */
function isRegExp(value) {
  return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
}

module.exports = isRegExp;

},{}],151:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a string.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
 * @example
 *
 * _.isString('fred');
 * // => true
 */
function isString(value) {
  return typeof value == 'string' ||
    value && typeof value == 'object' && toString.call(value) == stringClass || false;
}

module.exports = isString;

},{}],152:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 */
function isUndefined(value) {
  return typeof value == 'undefined';
}

module.exports = isUndefined;

},{}],153:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative'),
    isObject = _dereq_('./isObject'),
    shimKeys = _dereq_('../internals/shimKeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"../internals/isNative":104,"../internals/shimKeys":118,"./isObject":148}],154:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createCallback = _dereq_('../functions/createCallback'),
    forOwn = _dereq_('./forOwn');

/**
 * Creates an object with the same keys as `object` and values generated by
 * running each own enumerable property of `object` through the callback.
 * The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a new object with values of the results of each `callback` execution.
 * @example
 *
 * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 *
 * var characters = {
 *   'fred': { 'name': 'fred', 'age': 40 },
 *   'pebbles': { 'name': 'pebbles', 'age': 1 }
 * };
 *
 * // using "_.pluck" callback shorthand
 * _.mapValues(characters, 'age');
 * // => { 'fred': 40, 'pebbles': 1 }
 */
function mapValues(object, callback, thisArg) {
  var result = {};
  callback = createCallback(callback, thisArg, 3);

  forOwn(object, function(value, key, object) {
    result[key] = callback(value, key, object);
  });
  return result;
}

module.exports = mapValues;

},{"../functions/createCallback":66,"./forOwn":131}],155:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'),
    baseMerge = _dereq_('../internals/baseMerge'),
    getArray = _dereq_('../internals/getArray'),
    isObject = _dereq_('./isObject'),
    releaseArray = _dereq_('../internals/releaseArray'),
    slice = _dereq_('../internals/slice');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * will overwrite property assignments of previous sources. If a callback is
 * provided it will be executed to produce the merged values of the destination
 * and source properties. If the callback returns `undefined` merging will
 * be handled by the method instead. The callback is bound to `thisArg` and
 * invoked with two arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize merging properties.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * var names = {
 *   'characters': [
 *     { 'name': 'barney' },
 *     { 'name': 'fred' }
 *   ]
 * };
 *
 * var ages = {
 *   'characters': [
 *     { 'age': 36 },
 *     { 'age': 40 }
 *   ]
 * };
 *
 * _.merge(names, ages);
 * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
 *
 * var food = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var otherFood = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(food, otherFood, function(a, b) {
 *   return _.isArray(a) ? a.concat(b) : undefined;
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
 */
function merge(object) {
  var args = arguments,
      length = 2;

  if (!isObject(object)) {
    return object;
  }
  // allows working with `_.reduce` and `_.reduceRight` without using
  // their `index` and `collection` arguments
  if (typeof args[2] != 'number') {
    length = args.length;
  }
  if (length > 3 && typeof args[length - 2] == 'function') {
    var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
  } else if (length > 2 && typeof args[length - 1] == 'function') {
    callback = args[--length];
  }
  var sources = slice(arguments, 1, length),
      index = -1,
      stackA = getArray(),
      stackB = getArray();

  while (++index < length) {
    baseMerge(object, sources[index], callback, stackA, stackB);
  }
  releaseArray(stackA);
  releaseArray(stackB);
  return object;
}

module.exports = merge;

},{"../internals/baseCreateCallback":82,"../internals/baseMerge":88,"../internals/getArray":100,"../internals/releaseArray":114,"../internals/slice":119,"./isObject":148}],156:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseDifference = _dereq_('../internals/baseDifference'),
    baseFlatten = _dereq_('../internals/baseFlatten'),
    createCallback = _dereq_('../functions/createCallback'),
    forIn = _dereq_('./forIn');

/**
 * Creates a shallow clone of `object` excluding the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` omitting the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The properties to omit or the
 *  function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object without the omitted properties.
 * @example
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
 * // => { 'name': 'fred' }
 *
 * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
 *   return typeof value == 'number';
 * });
 * // => { 'name': 'fred' }
 */
function omit(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var props = [];
    forIn(object, function(value, key) {
      props.push(key);
    });
    props = baseDifference(props, baseFlatten(arguments, true, false, 1));

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      result[key] = object[key];
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (!callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = omit;

},{"../functions/createCallback":66,"../internals/baseDifference":84,"../internals/baseFlatten":85,"./forIn":129}],157:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates a two dimensional array of an object's key-value pairs,
 * i.e. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
 */
function pairs(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"./keys":153}],158:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseFlatten = _dereq_('../internals/baseFlatten'),
    createCallback = _dereq_('../functions/createCallback'),
    forIn = _dereq_('./forIn'),
    isObject = _dereq_('./isObject');

/**
 * Creates a shallow clone of `object` composed of the specified properties.
 * Property names may be specified as individual arguments or as arrays of
 * property names. If a callback is provided it will be executed for each
 * property of `object` picking the properties the callback returns truey
 * for. The callback is bound to `thisArg` and invoked with three arguments;
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The source object.
 * @param {Function|...string|string[]} [callback] The function called per
 *  iteration or property names to pick, specified as individual property
 *  names or arrays of property names.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns an object composed of the picked properties.
 * @example
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
 * // => { 'name': 'fred' }
 *
 * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
 *   return key.charAt(0) != '_';
 * });
 * // => { 'name': 'fred' }
 */
function pick(object, callback, thisArg) {
  var result = {};
  if (typeof callback != 'function') {
    var index = -1,
        props = baseFlatten(arguments, true, false, 1),
        length = isObject(object) ? props.length : 0;

    while (++index < length) {
      var key = props[index];
      if (key in object) {
        result[key] = object[key];
      }
    }
  } else {
    callback = createCallback(callback, thisArg, 3);
    forIn(object, function(value, key, object) {
      if (callback(value, key, object)) {
        result[key] = value;
      }
    });
  }
  return result;
}

module.exports = pick;

},{"../functions/createCallback":66,"../internals/baseFlatten":85,"./forIn":129,"./isObject":148}],159:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('../internals/baseCreate'),
    createCallback = _dereq_('../functions/createCallback'),
    forEach = _dereq_('../collections/forEach'),
    forOwn = _dereq_('./forOwn'),
    isArray = _dereq_('./isArray');

/**
 * An alternative to `_.reduce` this method transforms `object` to a new
 * `accumulator` object which is the result of running each of its own
 * enumerable properties through a callback, with each callback execution
 * potentially mutating the `accumulator` object. The callback is bound to
 * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
 * Callbacks may exit iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Array|Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [accumulator] The custom accumulator value.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
 *   num *= num;
 *   if (num % 2) {
 *     return result.push(num) < 3;
 *   }
 * });
 * // => [1, 9, 25]
 *
 * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
 *   result[key] = num * 3;
 * });
 * // => { 'a': 3, 'b': 6, 'c': 9 }
 */
function transform(object, callback, accumulator, thisArg) {
  var isArr = isArray(object);
  if (accumulator == null) {
    if (isArr) {
      accumulator = [];
    } else {
      var ctor = object && object.constructor,
          proto = ctor && ctor.prototype;

      accumulator = baseCreate(proto);
    }
  }
  if (callback) {
    callback = createCallback(callback, thisArg, 4);
    (isArr ? forEach : forOwn)(object, function(value, index, object) {
      return callback(accumulator, value, index, object);
    });
  }
  return accumulator;
}

module.exports = transform;

},{"../collections/forEach":41,"../functions/createCallback":66,"../internals/baseCreate":81,"./forOwn":131,"./isArray":137}],160:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('./keys');

/**
 * Creates an array composed of the own enumerable property values of `object`.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property values.
 * @example
 *
 * _.values({ 'one': 1, 'two': 2, 'three': 3 });
 * // => [1, 2, 3] (property order is not guaranteed across environments)
 */
function values(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = values;

},{"./keys":153}],161:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('./internals/isNative');

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./internals/isNative":104}],162:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

module.exports = {
  'constant': _dereq_('./utilities/constant'),
  'createCallback': _dereq_('./functions/createCallback'),
  'escape': _dereq_('./utilities/escape'),
  'identity': _dereq_('./utilities/identity'),
  'mixin': _dereq_('./utilities/mixin'),
  'noConflict': _dereq_('./utilities/noConflict'),
  'noop': _dereq_('./utilities/noop'),
  'now': _dereq_('./utilities/now'),
  'parseInt': _dereq_('./utilities/parseInt'),
  'property': _dereq_('./utilities/property'),
  'random': _dereq_('./utilities/random'),
  'result': _dereq_('./utilities/result'),
  'template': _dereq_('./utilities/template'),
  'templateSettings': _dereq_('./utilities/templateSettings'),
  'times': _dereq_('./utilities/times'),
  'unescape': _dereq_('./utilities/unescape'),
  'uniqueId': _dereq_('./utilities/uniqueId')
};

},{"./functions/createCallback":66,"./utilities/constant":163,"./utilities/escape":164,"./utilities/identity":165,"./utilities/mixin":166,"./utilities/noConflict":167,"./utilities/noop":168,"./utilities/now":169,"./utilities/parseInt":170,"./utilities/property":171,"./utilities/random":172,"./utilities/result":173,"./utilities/template":174,"./utilities/templateSettings":175,"./utilities/times":176,"./utilities/unescape":177,"./utilities/uniqueId":178}],163:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'name': 'fred' };
 * var getter = _.constant(object);
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],164:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escapeHtmlChar = _dereq_('../internals/escapeHtmlChar'),
    keys = _dereq_('../objects/keys'),
    reUnescapedHtml = _dereq_('../internals/reUnescapedHtml');

/**
 * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
 * corresponding HTML entities.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('Fred, Wilma, & Pebbles');
 * // => 'Fred, Wilma, &amp; Pebbles'
 */
function escape(string) {
  return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}

module.exports = escape;

},{"../internals/escapeHtmlChar":98,"../internals/reUnescapedHtml":113,"../objects/keys":153}],165:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],166:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forEach = _dereq_('../collections/forEach'),
    functions = _dereq_('../objects/functions'),
    isFunction = _dereq_('../objects/isFunction'),
    isObject = _dereq_('../objects/isObject');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * Adds function properties of a source object to the destination object.
 * If `object` is a function methods will be added to its prototype as well.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Function|Object} [object=lodash] object The destination object.
 * @param {Object} source The object of functions to add.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
 * @example
 *
 * function capitalize(string) {
 *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
 * }
 *
 * _.mixin({ 'capitalize': capitalize });
 * _.capitalize('fred');
 * // => 'Fred'
 *
 * _('fred').capitalize().value();
 * // => 'Fred'
 *
 * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
 * _('fred').capitalize();
 * // => 'Fred'
 */
function mixin(object, source, options) {
  var chain = true,
      methodNames = source && functions(source);

  if (options === false) {
    chain = false;
  } else if (isObject(options) && 'chain' in options) {
    chain = options.chain;
  }
  var ctor = object,
      isFunc = isFunction(ctor);

  forEach(methodNames, function(methodName) {
    var func = object[methodName] = source[methodName];
    if (isFunc) {
      ctor.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            value = this.__wrapped__,
            args = [value];

        push.apply(args, arguments);
        var result = func.apply(object, args);
        if (chain || chainAll) {
          if (value === result && isObject(result)) {
            return this;
          }
          result = new ctor(result);
          result.__chain__ = chainAll;
        }
        return result;
      };
    }
  });
}

module.exports = mixin;

},{"../collections/forEach":41,"../objects/functions":133,"../objects/isFunction":144,"../objects/isObject":148}],167:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to restore the original `_` reference in `noConflict` */
var oldDash = global._;

/**
 * Reverts the '_' variable to its previous value and returns a reference to
 * the `lodash` function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @returns {Function} Returns the `lodash` function.
 * @example
 *
 * var lodash = _.noConflict();
 */
function noConflict() {
  global._ = oldDash;
  return this;
}

module.exports = noConflict;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],168:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],169:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('../internals/isNative');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var stamp = _.now();
 * _.defer(function() { console.log(_.now() - stamp); });
 * // => logs the number of milliseconds it took for the deferred function to be called
 */
var now = isNative(now = Date.now) && now || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internals/isNative":104}],170:[function(_dereq_,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isString = _dereq_('../objects/isString');

/** Used to detect and test whitespace */
var whitespace = (
  // whitespace
  ' \t\x0B\f\xA0\ufeff' +

  // line terminators
  '\n\r\u2028\u2029' +

  // unicode category "Zs" space separators
  '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
);

/** Used to match leading whitespace and zeros to be removed */
var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeParseInt = global.parseInt;

/**
 * Converts the given value into an integer of the specified radix.
 * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
 * `value` is a hexadecimal, in which case a `radix` of `16` is used.
 *
 * Note: This method avoids differences in native ES3 and ES5 `parseInt`
 * implementations. See http://es5.github.io/#E.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} value The value to parse.
 * @param {number} [radix] The radix used to interpret the value to parse.
 * @returns {number} Returns the new integer value.
 * @example
 *
 * _.parseInt('08');
 * // => 8
 */
var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
  // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
  return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
};

module.exports = parseInt;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../objects/isString":151}],171:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;

},{}],172:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseRandom = _dereq_('../internals/baseRandom');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMin = Math.min,
    nativeRandom = Math.random;

/**
 * Produces a random number between `min` and `max` (inclusive). If only one
 * argument is provided a number between `0` and the given number will be
 * returned. If `floating` is truey or either `min` or `max` are floats a
 * floating-point number will be returned instead of an integer.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} [min=0] The minimum possible value.
 * @param {number} [max=1] The maximum possible value.
 * @param {boolean} [floating=false] Specify returning a floating-point number.
 * @returns {number} Returns a random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(min, max, floating) {
  var noMin = min == null,
      noMax = max == null;

  if (floating == null) {
    if (typeof min == 'boolean' && noMax) {
      floating = min;
      min = 1;
    }
    else if (!noMax && typeof max == 'boolean') {
      floating = max;
      noMax = true;
    }
  }
  if (noMin && noMax) {
    max = 1;
  }
  min = +min || 0;
  if (noMax) {
    max = min;
    min = 0;
  } else {
    max = +max || 0;
  }
  if (floating || min % 1 || max % 1) {
    var rand = nativeRandom();
    return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
  }
  return baseRandom(min, max);
}

module.exports = random;

},{"../internals/baseRandom":89}],173:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = _dereq_('../objects/isFunction');

/**
 * Resolves the value of property `key` on `object`. If `key` is a function
 * it will be invoked with the `this` binding of `object` and its result returned,
 * else the property value is returned. If `object` is falsey then `undefined`
 * is returned.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {Object} object The object to inspect.
 * @param {string} key The name of the property to resolve.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = {
 *   'cheese': 'crumpets',
 *   'stuff': function() {
 *     return 'nonsense';
 *   }
 * };
 *
 * _.result(object, 'cheese');
 * // => 'crumpets'
 *
 * _.result(object, 'stuff');
 * // => 'nonsense'
 */
function result(object, key) {
  if (object) {
    var value = object[key];
    return isFunction(value) ? object[key]() : value;
  }
}

module.exports = result;

},{"../objects/isFunction":144}],174:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var defaults = _dereq_('../objects/defaults'),
    escape = _dereq_('./escape'),
    escapeStringChar = _dereq_('../internals/escapeStringChar'),
    keys = _dereq_('../objects/keys'),
    reInterpolate = _dereq_('../internals/reInterpolate'),
    templateSettings = _dereq_('./templateSettings'),
    values = _dereq_('../objects/values');

/** Used to match empty string literals in compiled template source */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match ES6 template delimiters
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to ensure capturing order of template delimiters */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals */
var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

/**
 * A micro-templating method that handles arbitrary delimiters, preserves
 * whitespace, and correctly escapes quotes within interpolated code.
 *
 * Note: In the development build, `_.template` utilizes sourceURLs for easier
 * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
 *
 * For more information on precompiling templates see:
 * http://lodash.com/custom-builds
 *
 * For more information on Chrome extension sandboxes see:
 * http://developer.chrome.com/stable/extensions/sandboxingEval.html
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} text The template text.
 * @param {Object} data The data object used to populate the text.
 * @param {Object} [options] The options object.
 * @param {RegExp} [options.escape] The "escape" delimiter.
 * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
 * @param {Object} [options.imports] An object to import into the template as local variables.
 * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
 * @param {string} [sourceURL] The sourceURL of the template's compiled source.
 * @param {string} [variable] The data object variable name.
 * @returns {Function|string} Returns a compiled function when no `data` object
 *  is given, else it returns the interpolated text.
 * @example
 *
 * // using the "interpolate" delimiter to create a compiled template
 * var compiled = _.template('hello <%= name %>');
 * compiled({ 'name': 'fred' });
 * // => 'hello fred'
 *
 * // using the "escape" delimiter to escape HTML in data property values
 * _.template('<b><%- value %></b>', { 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // using the "evaluate" delimiter to generate HTML
 * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
 * _.template('hello ${ name }', { 'name': 'pebbles' });
 * // => 'hello pebbles'
 *
 * // using the internal `print` function in "evaluate" delimiters
 * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
 * // => 'hello barney!'
 *
 * // using a custom template delimiters
 * _.templateSettings = {
 *   'interpolate': /{{([\s\S]+?)}}/g
 * };
 *
 * _.template('hello {{ name }}!', { 'name': 'mustache' });
 * // => 'hello mustache!'
 *
 * // using the `imports` option to import jQuery
 * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
 * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // using the `sourceURL` option to specify a custom sourceURL for the template
 * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
 *
 * // using the `variable` option to ensure a with-statement isn't used in the compiled template
 * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 *   var __t, __p = '', __e = _.escape;
 *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
 *   return __p;
 * }
 *
 * // using the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and a stack trace
 * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(text, data, options) {
  // based on John Resig's `tmpl` implementation
  // http://ejohn.org/blog/javascript-micro-templating/
  // and Laura Doktorova's doT.js
  // https://github.com/olado/doT
  var settings = templateSettings.imports._.templateSettings || templateSettings;
  text = String(text || '');

  // avoid missing dependencies when `iteratorTemplate` is not defined
  options = defaults({}, options, settings);

  var imports = defaults({}, options.imports, settings.imports),
      importsKeys = keys(imports),
      importsValues = values(imports);

  var isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // compile the regexp to match each delimiter
  var reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
  , 'g');

  text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // escape characters that cannot be included in string literals
    source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // replace delimiters with snippets
    if (escapeValue) {
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // the JS engine embedded in Adobe products requires returning the `match`
    // string in order to produce the correct `offset` value
    return match;
  });

  source += "';\n";

  // if `variable` is not specified, wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain
  var variable = options.variable,
      hasVariable = variable;

  if (!hasVariable) {
    variable = 'obj';
    source = 'with (' + variable + ') {\n' + source + '\n}\n';
  }
  // cleanup code by stripping empty strings
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // frame code as the function body
  source = 'function(' + variable + ') {\n' +
    (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
    "var __t, __p = '', __e = _.escape" +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n'
    ) +
    source +
    'return __p\n}';

  try {
    var result = Function(importsKeys, 'return ' + source ).apply(undefined, importsValues);
  } catch(e) {
    e.source = source;
    throw e;
  }
  if (data) {
    return result(data);
  }
  // provide the compiled function's source by its `toString` method, in
  // supported environments, or the `source` property as a convenience for
  // inlining compiled templates during the build process
  result.source = source;
  return result;
}

module.exports = template;

},{"../internals/escapeStringChar":99,"../internals/reInterpolate":112,"../objects/defaults":126,"../objects/keys":153,"../objects/values":160,"./escape":164,"./templateSettings":175}],175:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var escape = _dereq_('./escape'),
    reInterpolate = _dereq_('../internals/reInterpolate');

/**
 * By default, the template delimiters used by Lo-Dash are similar to those in
 * embedded Ruby (ERB). Change the following template settings to use alternative
 * delimiters.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'escape': /<%-([\s\S]+?)%>/g,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'evaluate': /<%([\s\S]+?)%>/g,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type RegExp
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type string
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type Object
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type Function
     */
    '_': { 'escape': escape }
  }
};

module.exports = templateSettings;

},{"../internals/reInterpolate":112,"./escape":164}],176:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = _dereq_('../internals/baseCreateCallback');

/**
 * Executes the callback `n` times, returning an array of the results
 * of each callback execution. The callback is bound to `thisArg` and invoked
 * with one argument; (index).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {number} n The number of times to execute the callback.
 * @param {Function} callback The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns an array of the results of each `callback` execution.
 * @example
 *
 * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
 * // => [3, 6, 4]
 *
 * _.times(3, function(n) { mage.castSpell(n); });
 * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
 *
 * _.times(3, function(n) { this.cast(n); }, mage);
 * // => also calls `mage.castSpell(n)` three times
 */
function times(n, callback, thisArg) {
  n = (n = +n) > -1 ? n : 0;
  var index = -1,
      result = Array(n);

  callback = baseCreateCallback(callback, thisArg, 1);
  while (++index < n) {
    result[index] = callback(index);
  }
  return result;
}

module.exports = times;

},{"../internals/baseCreateCallback":82}],177:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keys = _dereq_('../objects/keys'),
    reEscapedHtml = _dereq_('../internals/reEscapedHtml'),
    unescapeHtmlChar = _dereq_('../internals/unescapeHtmlChar');

/**
 * The inverse of `_.escape` this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
 * corresponding characters.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} string The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('Fred, Barney &amp; Pebbles');
 * // => 'Fred, Barney & Pebbles'
 */
function unescape(string) {
  return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
}

module.exports = unescape;

},{"../internals/reEscapedHtml":111,"../internals/unescapeHtmlChar":120,"../objects/keys":153}],178:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to generate unique IDs */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} [prefix] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return String(prefix == null ? '' : prefix) + id;
}

module.exports = uniqueId;

},{}]},{},[2])
(2)
});