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
  // taken from https://www.w3schools.com/tags/
  var htmlTags = ['!DOCTYPE', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'autio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','datalist','dd','del','details','dfn','dialog','dir','div','dl','dt','em','embed','fieldset','figcaption','figure','font','footer','form','frame','frameset','h1','h2','h3','h4','h5','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','label','legend','li','link','main','map','mark','menu','menuitem','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','span','strike','strong','style','sub','summary','sup','table','tbody','td','textarea','tfoot','th','thead','time','title','tr','track','tt','u','ul','var','video','wbr']
  var angularTags = ['ng-view', 'ng-transclude', 'ng-include', 'ng-form', 'ng-app', 'ng-bind-html', 'ng-bind-template', 'ng-controller', 'ng-jq', 'ng-pluralize']

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

  function validateIgnoreTags(ignoreTags) {
    if(grunt.util.kindOf(ignoreTags) !== 'array') {
      grunt.fail.warn('options.ignoreTags must be a string array containing the tag names.')
    }
  }

  function isHtmlTagName(name) {
    return _.find(htmlTags, function(htmlTag) {
      return htmlTag == name
    }) !== undefined
  }

  function isAngularTagName(name) {
    return _.find(angularTags, function(angularTag){
      return angularTag == name
    }) !== undefined
  }

  function isPredefinedTagName(name) {
    return isHtmlTagName(name) || isAngularTagName(name)
  }

  
  function normalizeDirectiveName(name) {
    var directiveNameRegex = /[a-z][a-z0-9]*|[A-Z][a-z0-9]*/g
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

  function isDirectory(path) {
    if(path !== undefined && path !== null && path.length > 0) {
      var lastCharacterIsSlash = path[path.length - 1] == '/'
      return lastCharacterIsSlash
    }
    else {
      grunt.log.warn(value + ' is not a valid directory path')
    }
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
        directiveRegEx = /directive\(["']\w*["']/g
    function isAngularDirective(name) {
      return _.find(directives, function(directive) {
        return directive == name
      }) !== undefined
    }
    function isIgnoredTag(name) {
      return _.find(options.ignoreTags, function(tagName) {
        return tagName == name
      }) !== undefined
    }
    function fileHasValidExtenion(fileName) {
      if(fileName !== undefined && fileName !== null && fileName !== '') {
        if(options.viewExtensions == '*') {
          return true
        }
        else {
          var splittedFileName = fileName.split('.')
          if(splittedFileName.length > 0) {
            var fileExtension = splittedFileName[splittedFileName.length - 1]
            return _(options.viewExtensions).find(function(viewExtension) {
              return fileExtension == viewExtension
            }) !== undefined
          }
          else {
            grunt.log.error(fileName + ' has not an extension')
          }
        }
      }
      else {
        grunt.log.warn(fileName + 'is not a valid file name.')
      }
    }
    var options = this.options({
      suppressOutput: false,
      suppressOutputFile: false,
      ignoreTags: [],
      viewExtensions: ['html']
    })
    // check configuration
    validateViews(views, target)
    validateViewExtension(viewExtension)
    validateAngular(angular, target)
    validateIgnoreTags(options.ignoreTags)
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
    var viewFiles = _.filter(views, function(view) { return !isDirectory(view)})
    var viewDirectories = _.filter(views,function(view) { return isDirectory(view)})
    var errors = []
    // read views
    function viewExists(viewFilePath) {
      if(!grunt.file.exists(viewFilePath)) {
        grunt.log.warn('View source file "' + viewFilePath + '" not found.')
        return false
      }
      else {
        return true
      }
    }
    function getViewContent(viewFilePath) {
      return { file: viewFilePath, content: getNormalizedFile(viewFilePath) } 
    }
    function parseViewFile(viewFile) {
      var parser = new htmlparser.Parser({
        onopentag: function(name, attributes) {
          if(!isIgnoredTag(name) && !isPredefinedTagName(name) && !isAngularDirective(name)) {
            errors.push('unknown directive <' + name + '> in ' + viewFile.file  + '\r\n')
          }
        }
      })
      parser.write(viewFile.content)
    }
    function processViews(viewsFilePaths) {
      _(viewsFilePaths)
      .filter(function(viewFilePath) {
        return viewExists(viewFilePath)
      }).map(function(viewFilePath) {
        return getViewContent(viewFilePath)
      })
      .forEach(function(viewFile) {
        parseViewFile(viewFile)
      })
    }
    function processView(view) {
      if(viewExists(view)) {
        var viewFile = getViewContent(view)
        parseViewFile(viewFile)
      }
    }
    function processDirectories(directories) {
      _(directories)
      .forEach(function(viewDirectory) {
        grunt.file.recurse(viewDirectory, function(abspath, rootdir, subdir, filename) {
          if(fileHasValidExtenion(filename)) {
            processView(abspath)
          }
        })
      })
    }
    processViews(viewFiles)
    processDirectories(viewDirectories)
    if(!options.suppressOutput) {
      _.forEach(errors, function(error) {
        grunt.log.error(error)
      })
    }
    if(!options.suppressOutputFile && errors.length > 0) {
      grunt.file.write(log, _.join(errors,''))
    }
  })
}