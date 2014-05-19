module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    shell:
      options:
        failOnError: true

      jison:
        command: 'jison src/grammar.y src/lexer.l -o src/parser.js &&
                  mkdir -p lib/src/ && cp src/parser.js lib/src/'

      push_ghpages:
        command: 'git subtree push --prefix demo origin gh-pages'
        options:
          stdout: true

    jasmine_test:
      all: ['lib/spec/']
      options:
        specFolders: ['lib/spec/']
        showColors: true
        includeStackTrace: false
        forceExit: true

    # this is actually the code coverage task, but renaming it causes problems
    jasmine_node:
      coverage:
        savePath: 'demo/coverage/'
        report: ['html']
        excludes: ['lib/spec/*.js']
        thresholds:
          lines: 75
      all: ['lib/spec/']
      options:
        specFolders: ['lib/spec/']
        showColors: true
        includeStackTrace: false
        forceExit: true

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
      lib:
        files: [
          expand: true         # Enable dynamic expansion.
          cwd: 'src/'          # Src matches are relative to this path.
          src: ['**/*.coffee'] # Actual pattern(s) to match.
          dest: 'lib/src/'         # Destination path prefix.
          ext: '.js'           # Dest filepaths will have this extension.
        ]
      specs:
        files: [
          expand: true         # Enable dynamic expansion.
          cwd: 'spec/'         # Src matches are relative to this path.
          src: ['**/*.coffee'] # Actual pattern(s) to match.
          dest: 'lib/spec/'    # Destination path prefix.
          ext: '.js'           # Dest filepaths will have this extension.
        ]

    browserify:
      demo:
        files: [
          expand: true
          cwd: 'lib/'
          src: ['src/repl.js', 'spec/<%= pkg.name %>-spec.js', 'spec/functional-spec.js',
                'spec/<%= pkg.name %>-core-spec.js']
          dest: 'demo/js/'
        ]
        options:
          exclude: ['lodash-node']


  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-browserify'

  # grunt-jasmine-node is for tests, grunt-jasmine-node-coverage is for code coverage
  grunt.loadNpmTasks 'grunt-jasmine-node'
  grunt.renameTask 'jasmine_node', 'jasmine_test'
  grunt.loadNpmTasks 'grunt-jasmine-node-coverage'

  grunt.registerTask 'build', ['coffeelint', 'shell:jison', 'coffee']
  grunt.registerTask 'test', ['build', 'jasmine_test']
  grunt.registerTask 'default', ['build', 'browserify', 'jasmine_node']
  grunt.registerTask 'push_demo', ['shell:push_ghpages']
