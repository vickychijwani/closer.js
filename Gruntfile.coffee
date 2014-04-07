module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    shell:
      jison:
        command: 'jison src/grammar.y src/lexer.l -o src/parser.js'
        options:
          failOnError: true

      browserify:
        command: 'browserify -s <%= pkg.name %> src/<%= pkg.name %>.js > demo/js/<%= pkg.name %>.js;
          browserify -s <%= pkg.name %>_spec spec/<%= pkg.name %>_spec.js > demo/js/<%= pkg.name %>_spec.js;'
        options:
          failOnError: true

      push_ghpages:
        command: 'git subtree push --prefix demo origin gh-pages'
        options:
          failOnError: true

    jasmine_node:
      all: ['spec/']
      options:
        showColors: false
        includeStackTrace: false
        forceExit: true

    watch:
      files: ['src/lexer.l', 'src/grammar.y', 'src/nodes.js', 'src/<%= pkg.name %>.js', 'spec/**/*.js']
      tasks: ['shell:jison', 'jasmine_node', 'shell:browserify']
      options:
        spawn: true
        interrupt: true
        atBegin: true
        livereload: true

  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-jasmine-node'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['shell:jison', 'jasmine_node', 'shell:browserify']
  grunt.registerTask 'push_demo', ['shell:push_ghpages']