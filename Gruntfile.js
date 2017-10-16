/*
 * angular-directives-in-views
 * https://github.com/RobertPellmann/grunt-angular-directives-in-views
 *
 * Copyright (c) 2017 Robert Pellmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    angular_directives_in_views: {
      view_simple: {
        views: ['test/fixtures/view.html'],
        angular: ['test/fixtures/angular-directives.js']
      },
      view_simple_invalid: {
        views: ['test/fixtures/view-invalid.html'],
        angular: ['test/fixtures/angular-directives.js']
      },
      view_multiple: {
        views: ['test/fixtures/view-multiple.html'],
        angular: ['test/fixtures/angular-directives.js']
      },
      view_invalid_one: {
        views: ['test/fixtures/view-invalid-one.html'],
        angular: ['test/fixtures/angular-directives.js'],
        options: {
          suppressOutput: true
        }
      },
      view_ignore_invalid_tag: {
        views: ['test/fixtures/razor.cshtml'],
        angular: ['test/fixtures/angular-directives.js'],
        options: {
          ignoreTags: ['dynamic']
        }
      },
      view_scan_directory_html: {
        views: ['test/fixtures/views/'],
        angular: ['test/fixtures/angular-directives.js']
      },
      view_scan_directory_cshtml: {
        views: ['test/fixtures/views/'],
        angular: ['test/fixtures/angular-directives.js'],
        options: {
          viewExtensions: ['html','cshtml']
        }
      },
      view_scan_directory_all: {
        views: ['test/fixtures/views/'],
        angular: ['test/fixtures/angular-directives.js'],
        options: {
          viewExtensions: '*'
        }
      },
      view_scan_sub_directory: {
        views: ['test/fixtures/views/'],
        angular: ['test/fixtures/angular-directives.js'],
        options: {
          viewExtensions: ['cshtml']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'angular_directives_in_views', 'nodeunit']);

  // By default, lint and run all tests.
  // grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('default', ['test'])
};
