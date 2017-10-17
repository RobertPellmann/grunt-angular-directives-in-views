# angular-directives-in-views

> Scans .js files for angular directives to make sure directives in (html) views are defined.

Attention: This plugin is for directives from Angular 1.x. It will not work with Angular > 1.x.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install angular-directives-in-views --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-directives-in-views')
```

## Version ##

0.1.3

## The "angular_directives_in_views" task

### Overview
In your project's Gruntfile, add a section named `angular_directives_in_views` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  angular_directives_in_views: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
grunt.loadNpmTasks('grunt-angular-directives-in-views')
grunt.registerTask('default', ['angular_directives_in_views'])
```

### HTML and Angular Tags

All HTML Tags defined in https://www.w3schools.com/tags/ and the Angular directives ng-view, ng-transclude, ng-include, ng-form, ng-app, ng-bind-html, ng-bind-template, ng-controller, ng-jq, ng-pluralize will be ignored. Furthermore directives that are used as attributes will not be found by this plugin.

If you have tags that do not belong to neither HTML nor Angular, you can tell the plugin in the options to ignore them.

### Options

#### options.suppressOutput
Type: `Boolean`
Default value: `false`

If set to true all consol output regarding the view analysis is suppressed.

#### options.suppressOutputFile
Type: `Boolean`
Default value: `false`

Every target will create a file in a tmp directory next to the gruntfile with the file name set to the target name.
This is usefull if the information is too much for the console.
Set to false, if you do not wish to create those files.

#### options.ignoreTags
Type: `Array[String]`
Default value: `[]`

If you have tags that are neither html nor angular tags, you can specify them in this array.

Example:

```html
@using Razor

@inherits RazorViewBase<dynamic>

<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title></title>
</head>
<body>
    <div>
        <hello-world></hello-world>
    </div>
</body>
</html>
```

In this example you would have &lt;dynamic&gt; within your view and the parser would identity it as an unknown directive.
To avoid such confusion, you have to add those special tags to the ignoreTag Array:

```js
grunt.initConfig({
  angular_directives_in_views: {
    my_views: {
        views: ['views/test.html'],
        angular: ['scripts/angular-directives.js'],
        options: {
          ignoreTags: ['dynamic']
        }
      }
  }
})
```

#### options.viewExtensions ####

Type: `Array[String]` or `*`
Default value: `['html']`

If you use directories in your views argument and you want to use different views than html views, you have to
override this option.
If you provide an array you give the task a whitelist of acceptable extensions.
If you want the task to pick anything up regardless of extension, you can set it to '*'.

```js
grunt.initConfig({
  angular_directives_in_views: {
    my_views: {
        views: ['views/'],
        angular: ['scripts/angular-directives.js'],
        options: {
          viewExtensions: ['html','txt']
        }
      }
  }
})
```

### Important note ###

If you want to use directories in the views argument, then the string MUST HAVE a trailing slash, e.g. views/

### Usage Examples

```js
grunt.initConfig({
  angular_directives_in_views: {
    my_views: {
        views: ['views/test.html'],
        angular: ['scripts/angular-directives.js'],
        options: {
          suppressOutput: true
        }
      }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
| Date | Version | Comment
| --- | --- | --- |
| 16.10.2017 | 0.1.0 - 0.1.3 | First somewhat working version. |
| 17.10.2017 | 0.1.4 | Ignore angular tags |