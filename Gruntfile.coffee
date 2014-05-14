module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    shell:
      options:
        failOnError: true

      jison:
        command: 'jison src/grammar.y src/lexer.l -o src/parser.js;
                  mkdir -p lib/src/; cp src/parser.js lib/src/;'

      copy_to_demo:
        command: 'cp dist/<%= pkg.name %>-core.min.js demo/js/;
                  cp dist/<%= pkg.name %>.min.js demo/js/;'

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
      dist:
        files: [
          expand: true
          cwd: 'lib/src/'
          src: ['<%= pkg.name %>.js', '<%= pkg.name %>-core.js', 'assertions.js']
          dest: 'dist/'
        ]
        options:
          exclude: ['lodash-node', 'mori', './<%= pkg.name %>', './<%= pkg.name %>-core', './assertions']
      specs:
        files: [
          expand: true
          cwd: 'lib/spec/'
          src: ['<%= pkg.name %>-spec.js', '<%= pkg.name %>-core-spec.js', 'functional-spec.js']
          dest: 'demo/js/'
        ]
        options:
          exclude: ['lodash-node', 'mori', '../src/closer', '../src/closer-core', '../src/assertions']

    uglify:
      dist:
        files: [
          expand: true
          cwd: 'dist/'
          src: ['<%= pkg.name %>.js', '<%= pkg.name %>-core.js', 'assertions.js']
          dest: 'dist/'
          ext: '.min.js'
        ]

    concat:
      mori:
        src: ['node_modules/mori/mori.js', 'dist/<%= pkg.name %>-core.js']
        dest: 'dist/<%= pkg.name %>-core.js'
      mori_min:
        src: ['node_modules/mori/mori.js', 'dist/<%= pkg.name %>-core.min.js']
        dest: 'dist/<%= pkg.name %>-core.min.js'


  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-jasmine-node'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'test', ['coffeelint', 'shell:jison', 'coffee', 'jasmine_node']
  grunt.registerTask 'build', ['coffeelint', 'shell:jison', 'coffee']
  grunt.registerTask 'default', ['test', 'browserify', 'uglify', 'concat', 'shell:copy_to_demo']
  grunt.registerTask 'push_demo', ['shell:push_ghpages']
