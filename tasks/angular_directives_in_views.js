/*
 * angular-directives-in-views
 * https://github.com/RobertPellmann/grunt-angular-directives-in-views
 *
 * Copyright (c) 2017 Robert Pellmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var _ = require('lodash')
  var htmlparser = require("htmlparser2")
  var htmlTags = ['div']

  function getNormalizedFile(filepath) {
    return grunt.util.normalizelf(grunt.file.read(filepath));
  }

  function validateViews(views, target) {
    if(views === undefined) {
      grunt.fail.warn('No views are specified for target ' + target + '.')
    }
    if(grunt.util.kindOf(views) !== 'array') {
      grunt.fail.warn('views must be an array.')
    }
  }

  function validateViewExtension(viewExtension) {
    if(grunt.util.kindOf(viewExtension) !== 'string') {
      grunt.fail.warn('If you specify a view extension, it must be a string.')
    }
  }

  function validateAngular(angular, target) {
    if(angular === undefined) {
      grunt.fail.warn('No angular files are specified for target ' + target + '.')
    }
    if(grunt.util.kindOf(angular) !== 'array') {
      grunt.fail.warn('angular must be an array.')
    }
  }

  function validateLog(log, target) {
    if(grunt.util.kindOf(log) !== 'string') {
      grunt.file.warn('If you want to specify the location of the output log file for target ' + target + ', it has to be a string')
    }
  }

  function isHtmlTagName(name) {
    return _.find(htmlTags, function(htmlTag) {
      return htmlTag == name
    }) !== undefined
  }

  
  function normalizeDirectiveName(name) {
    var directiveNameRegex = new RegExp(/[a-z][a-z0-9]*|[A-Z][a-z0-9]*/,'g')
    var result, normalizedName
    while((result = directiveNameRegex.exec(name)) !== null) {
      if(normalizedName === undefined) {
        normalizedName = result[0].toLowerCase()
      }
      else {
        normalizedName = normalizedName + '-' + result[0].toLowerCase()
      }
    }
    if(normalizedName === undefined) {
      grunt.log.warn(name + ' is not a valid angular directive name.')
    }
    return normalizedName
  }

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('angular_directives_in_views', 'Scans .js files for angular directives to make sure directives in (html) views are defined.', function() {
    var data = this.data, 
        target = this.target,
        views = data.views, 
        viewExtension = 'html', 
        angular = data.angular, 
        log = 'tmp/' + target,
        directives = [],
        directiveRegEx = new RegExp(/directive\(["']\w*["']/, 'g')
    function isAngularDirective(name) {
      return _.find(directives, function(directive) {
        return directive == name
      }) !== undefined
    }
    // overrdie default configuration
    if(data.viewExtension !== undefined) {
      viewExtension = data.viewExtension
    }
    if(data.log !== undefined) {
      log = data.log
    }
    // check configuration
    validateViews(views, target)
    validateViewExtension(viewExtension)
    validateAngular(angular, target)
    validateLog(log, target)
    // parse directives
    _(angular)
    .filter(function(angularFilePath) {
      if(!grunt.file.exists(angularFilePath)) {
        grunt.log.warn('Angular source file "' + angularFilePath + '" not found.');
        return false
      }
      else {
        return true
      }
    })
    .map(function(angularFilePath) {
      return getNormalizedFile(angularFilePath)
    })
    .forEach(function(angularFileContent){
      var result
      while((result = directiveRegEx.exec(angularFileContent)) !== null) {
        
        var directiveEndIndex = directiveRegEx.lastIndex - 1,
            directiveName = result[0].substring(11, directiveEndIndex)
        directives.push(normalizeDirectiveName(directiveName))
      }
    })
    if(directives.length == 0) {
      grunt.log.write('No directives where found in the angular files for target ' + target + '.')
    }
    // read views
    _(views)
    .filter(function(viewFilePath) {
      if(!grunt.file.exists(viewFilePath)) {
        grunt.log.warn('View source file "' + viewFilePath + '" not found.')
        return false
      }
      else {
        return true
      }
    }).map(function(viewFilePath) {
      return getNormalizedFile(viewFilePath)
    })
    .forEach(function(viewFileContent) {
      var parser = new htmlparser.Parser({
        onopentag: function(name, attributes) {
          if(!isHtmlTagName(name) && !isAngularDirective(name)) {
            grunt.file.write(log, 'unknown directive <' + name + '>\n')
          }
        }
      })
      parser.write(viewFileContent)
    })
  })
}
