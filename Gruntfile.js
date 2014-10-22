module.exports = function (grunt) {

  var scriptdirs = ['client/**/*.js', 'client/scripts/**/*.js', 'test/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'bower.json', 'package.json'].concat(scriptdirs),
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'bower.json', 'package.json'].concat(scriptdirs),
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'bower.json', 'package.json'].concat(scriptdirs),
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    browserify: {
      all: {
        //src: 'client/app.js',
        src: ['client/app.js'],
        dest: 'dist/app.js',
        options: {
          debug: true,
          transform: ['debowerify', 'folderify']
        }
      },
      debug: {
        src: ['client/app.js'],
        dest: 'dist/app.js',
        options: {
          debug: true,
          transform: ['debowerify', 'folderify']
        }
      }
    },
    copy: {
      client: {
        files: [{
          expand: true,
          cwd: 'client/',
          src: ['**/*.html', '**/*.css'],
          dest: 'dist/'
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist/',
          src: ['**/*.min.css'],
          dest: 'dist/'
        }]
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
