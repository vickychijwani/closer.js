module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    shell:
      options:
        failOnError: true

      jison:
        command: 'mkdir -p lib/; jison src/grammar.y src/lexer.l -o lib/parser.js'

      browserify:
        command: 'browserify -t coffeeify --extension=".coffee" -s <%= pkg.name %> src/<%= pkg.name %>.coffee > dist/<%= pkg.name %>.js;
          browserify -t coffeeify --extension=".coffee" -s <%= pkg.name %>-core src/<%= pkg.name %>-core.coffee > dist/<%= pkg.name %>-core.js;'

      browserify_spec:
        command: 'browserify -t coffeeify --extension=".coffee" -s <%= pkg.name %>-spec spec/<%= pkg.name %>-spec.coffee > demo/js/<%= pkg.name %>-spec.js;
          browserify -t coffeeify --extension=".coffee" -s <%= pkg.name %>-core-spec spec/<%= pkg.name %>-core-spec.coffee > demo/js/<%= pkg.name %>-core-spec.js;
          browserify -t coffeeify --extension=".coffee" -s functional-spec spec/functional-spec.coffee > demo/js/functional-spec.js;'

      copy_uglified:
        command: 'cp dist/<%= pkg.name %>-core.js demo/js/<%= pkg.name %>-core.js;
                  cp dist/<%= pkg.name %>.js demo/js/<%= pkg.name %>.js;'

      push_ghpages:
        command: 'git subtree push --prefix demo origin gh-pages'

    jasmine_node:
      all: ['spec/']
      options:
        showColors: true
        includeStackTrace: false
        forceExit: true
        coffee: true

    watch:
      files: ['src/lexer.l', 'src/grammar.y', 'src/**/*.coffee', 'spec/**/*.coffee']
      tasks: ['default']
      options:
        spawn: true
        interrupt: true
        atBegin: true
        livereload: true

    coffeelint:
      app: ['src/**/*.coffee', 'spec/**/*.coffee']
      options:
        max_line_length:
          level: 'ignore'
        line_endings:
          value: 'unix'
          level: 'error'

    coffee:
      compile:
        files: [
          expand: true         # Enable dynamic expansion.
          cwd: 'src/'          # Src matches are relative to this path.
          src: ['**/*.coffee'] # Actual pattern(s) to match.
          dest: 'lib/'         # Destination path prefix.
          ext: '.js'           # Dest filepaths will have this extension.
        ]

    uglify:
      parser:
        files:
          'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
      core:
        files:
          'dist/<%= pkg.name %>-core.js': ['dist/<%= pkg.name %>-core.js']

  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-jasmine-node'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'default', ['coffeelint', 'shell:jison', 'jasmine_node', 'shell:browserify', 'shell:browserify_spec', 'uglify', 'shell:copy_uglified']
  grunt.registerTask 'test', ['coffeelint', 'shell:jison', 'jasmine_node']
  grunt.registerTask 'build', ['coffeelint', 'shell:jison']
  grunt.registerTask 'push_demo', ['shell:push_ghpages']
