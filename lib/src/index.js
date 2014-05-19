(function() {
  var assertions, closer, core;

  closer = require('./closer');

  core = require('./closer-core');

  assertions = require('./assertions');

  module.exports = {
    parse: function(src, options) {
      var assertionsIdentifier, coreIdentifier;
      if (options == null) {
        options = {};
      }
      coreIdentifier = options.coreIdentifier || null;
      assertionsIdentifier = options.assertionsIdentifier || null;
      delete options.coreIdentifier;
      delete options.assertionsIdentifier;
      return core.$wireCallsToCoreFunctions(closer.parse(src, options), coreIdentifier, assertionsIdentifier);
    },
    core: core,
    assertions: assertions
  };

}).call(this);
