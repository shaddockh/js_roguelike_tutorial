module.exports = function (grunt) {

  var scriptdirs = ['client/**/*.js', 'client/scripts/**/*.js', 'test/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js'].concat(scriptdirs),
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js'].concat(scriptdirs),
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js'].concat(scriptdirs),
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/app.js': ['bower_components/**/*.js'].concat(scriptdirs)
        },
        options: {
          shim: {
            rot: {
              path: "bower_components/rot.js/rot.js",
              exports: "ROT"
            }
          },
          transform: ['debowerify']
        }
      },
      all: {
        src: 'client/app.js',
        dest: 'dist/app.js'
      },
      debug: {
        src: ['client/app.js', 'bower_components/**/*.js'],
        dest: 'dist/app.js',
        options: {
          debug: true,
          transform: ['debowerify']
        }
      }
    },
    copy: {
      client: {
        expand: true,
        cwd: 'client/',
        src: ['**/*.html', '**/*.css'],
        dest: 'dist/'
      }
    },
    connect: {
      options: {
        port: process.env.PORT || 3131,
        base: 'dist/'
      },
      all: {}
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: 'client/**/*',
        tasks: ['browserify:debug']
      },
      assets: {
        files: ['client/**/*.html', 'client/**/*.css', 'assets/**/*', '*.css', '*.js', 'images/**/*', 'img/**/*'],
        tasks: ['copy']
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: ['should']
      },
      src: ['test/**/*.js']
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('clean', ['jsbeautifier:modify', 'jshint']);
  grunt.registerTask('verify', ['jsbeautifier:verify', 'jshint']);

  grunt.registerTask('test', ['verify', 'mochaTest']);

  grunt.registerTask('default', ['test', 'browserify:all', 'copy']);

  grunt.registerTask('server', ['default', 'connect', 'watch']);
};
