(function() {
  var closer, core;

  closer = require('./closer');

  core = require('./closer-core');

  module.exports = {
    parse: function(src, options) {
      var coreIdentifier;
      if (options == null) {
        options = {};
      }
      coreIdentifier = options.coreIdentifier || null;
      delete options.coreIdentifier;
      return core.$wireCallsToCoreFunctions(closer.parse(src, options), coreIdentifier);
    },
    core: core
  };

}).call(this);
